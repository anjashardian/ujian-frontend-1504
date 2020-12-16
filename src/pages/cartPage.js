import React from 'react'
import Axios from 'axios'

import { Redirect } from 'react-router-dom'

import { login } from '../actions'

import {
    Table,
    Button,
    Image,
    Form,
    Modal
} from 'react-bootstrap'

class CartPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: null,
            newQty: 0,
            reqPayment: false,
            reqPass: false,
            errPass: false,
            errPayment: false,
            cartEmpty: false,
            toHistory: false
        }
    }

    handleDelete = (index) => {
        // console.log(index)
        let tempCart = this.props.cart

        // syntax splice untuk menghapus
        tempCart.splice(index, 1)
        console.log(tempCart)

        Axios.patch(`http://localhost:2000/users/${localStorage.id}`, { cart: tempCart })
            .then((res) => {
                console.log(res.data)

                Axios.get(`http://localhost:2000/users/${localStorage.id}`)
                    .then((res) => this.props.login(res.data))
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    handleMinus = () => {
        if (this.state.newQty <= 0) return

        this.setState({ newQty: this.state.newQty - 1 })
    }

    changeQty = (e) => {
        this.setState({ newQty: e.target.value })
    }

    handleDone = (index) => {
        // mengganti data pesanan suatu produk berdasarkan index
        // tempProduct adalah tempat penyimpanan sementara data product yang ingin diedit
        let tempProduct = this.props.cart[index]

        // mengganti data cart untuk product yang ingin diganti
        tempProduct.qty = parseInt(this.state.newQty)
        tempProduct.total = this.state.newQty * this.props.cart[index].price
        console.log(tempProduct)

        // memasukan object pesanan product yang baru, ke dalam array cart yang lama
        // tempCart adalah tempat penampungan sementara data cart user yang lama
        let tempCart = this.props.cart

        // syntax splice untuk mereplace
        tempCart.splice(index, 1, tempProduct)
        console.log(tempCart)

        // mengirim perubahan ke database json
        Axios.patch(`http://localhost:2000/users/${localStorage.id}`, { cart: tempCart })
            .then((res) => {
                console.log(res.data)

                // update data di redux
                Axios.get(`http://localhost:2000/users/${localStorage.id}`)
                    .then((res) => {
                        this.props.login(res.data)
                        this.setState({ selectedIndex: null })
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    totalPrice = () => {
        let counter = 0
        this.props.cart.map(item => counter += item.total)
        // console.log(counter)
        return counter
    }

    checkOut = () => {
        if (this.props.cart.length === 0) return this.setState({ cartEmpty: true })

        this.setState({ reqPass: true })
    }

    confPayment = () => {
        let nominal = this.refs.payment.value
        // console.log(nominal)
        let total = this.totalPrice()
        // console.log(total)

        if (nominal < total) return this.setState({ errPayment: true })

        // siapkan data
        let history = {
            username: this.props.username,
            date: new Date().toLocaleString(),
            total: total,
            product: this.props.cart
        }
        console.log(history)

        // update data history user
        Axios.post('http://localhost:2000/history', history)
            .then((res) => {
                console.log(res.data)

                // kosongkan cart dan update database
                Axios.patch(`http://localhost:2000/users/${localStorage.id}`, { cart: [] })
                    .then((res) => {
                        console.log(res.data)

                        // update redux
                        Axios.get(`http://localhost:2000/users/${localStorage.id}`)
                            .then((res) => {
                                console.log(res.data)
                                this.props.login(res.data)
                                this.setState({ reqPayment: false, toHistory: true })
                            })
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    confPass = () => {
        let pass = this.refs.pass.value
        // console.log(pass)
        if (pass !== this.props.pass) return this.setState({ errPass: true })

        this.setState({ reqPayment: true, reqPass: false })
    }

    renderTHead = () => {
        return (
            <thead style={{ textAlign: "center" }}>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
        )
    }

   

    render() {
        const { reqPayment, reqPass, errPass, errPayment, cartEmpty, toHistory } = this.state

        // redirect ke login kalau user belum login
        if (!this.props.id) return <Redirect to='/login' />

        // redirect ke history kalau user berhasil check out
        if (toHistory) return <Redirect to='/history' />

        return (
            <div style={{ marginTop: '70px', padding: '0 15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h1>Ini Cart Page</h1>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button  variant="success">Checkout</Button>
                    </div>
                </div>
                <Table striped bordered hover variant="dark">
                    {this.renderTHead()}
                 
                </Table>
                <h1 style={{ textAlign: 'right' }}>Total: IDR {this.totalPrice().toLocaleString()}</h1>
                <Modal show={reqPass} onHide={() => this.setState({ reqPass: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control ref="pass" placeholder="Tolong Masukan Password Untuk Melanjutkan Pembayaran:" />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ reqPass: false })}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.confPass} >
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={errPass} onHide={() => this.setState({ errPass: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Wrong Password</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ errPass: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={reqPayment} onHide={() => this.setState({ reqPayment: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Payment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control ref="payment" type="number" placeholder="Tolong Masukan Jumlah Uang Untuk Pembayaran:" />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ reqPayment: false })}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.confPayment} >
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={errPayment} onHide={() => this.setState({ errPayment: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Jumlah Uang Kurang Dari Total Cart</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ errPayment: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={cartEmpty} onHide={() => this.setState({ cartEmpty: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Make Sure Your Cart Is Not Empty!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ cartEmpty: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}



export default CartPage