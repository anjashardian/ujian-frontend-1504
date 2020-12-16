import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import {
    Image,
    Button,
    Modal
} from 'react-bootstrap'

class DetailProduct extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            image: '',
            selectedSize: null,
            size: 0,
            stock: '',
            total: 0,
            toLogin: false,
            cartErr: false,
            toCart: false
        }
    }

    componentDidMount() {
        Axios.get(`http://localhost:2000/products${this.props.location.search}`)
            .then((res) => {
                console.log(res.data[0].img)
                this.setState({ data: res.data, image: res.data.img })
            })
            .catch((err) => console.log(err))
    }

    handleAddToCart = () => {
        const { total, size, data } = this.state
        if (!this.props.id) return this.setState({ toLogin: true })

        // check user input
        if (total === 0 || size === 0) return this.setState({ cartErr: true })

        let cartData = {
            name: data.name,
            image: data.img,
            category: data.category,
            brand: data.brand,
            colour: data.colour,
            price: data.price,
            size: size,
            qty: total,
            total: total * data.price
        }
        // console.log(cartData)
        let tempCart = this.props.cart
        tempCart.push(cartData)
        // console.log(tempCart)

        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: tempCart })
            .then((res) => {
                console.log(res.data)
                this.setState({ toCart: true })
            })
            .catch((err) => console.log(err))
    }
    render() {
        const { data, image, selectedSize, total, stock, toLogin, cartErr, toCart } = this.state

        if (toLogin) return <Redirect to='/login' />

        if (toCart) return <Redirect to='/cart' />

        return (
            <div>
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Product Detail</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div style={{ display: 'flex', height: '65vh' }}>
                            <div style={{ backgroundColor: 'yellow', width: '200px' }}>
                                <Image src={image} rounded style={{ height: '90%', width: '90%' }} />
                            </div>
                            <div style={{ backgroundColor: 'green', width: '400px' }}>
                                <h2>{data.name}</h2>
                                <h6>Description: {data.description}</h6>
                                <h6>Price: IDR {data.price ? data.price.toLocaleString() : 0}</h6>
                                <div style={{ display: 'flex' }}>
                                <div style={{ marginRight: '50px' }}>
                                    <h5>Size: </h5>
                                    <div>
                                        {(data.stock || []).map((item, index) => {
                                            return (
                                                <Button
                                                    key={index}
                                                    onClick={() => this.setState({ size: item.code, selectedSize: index, stock: item.total })}
                                                    style={{
                                                        backgroundColor: selectedSize === index ? '#130f40' : '#ffffff',
                                                        color: selectedSize === index ? 'white' : 'black'
                                                    }}>
                                                    {item.code}
                                                </Button>
                                            )
                                        })}
                                    </div>
                                    <h5>*Stock = {stock}</h5>
                                </div>
                                <div style={{ width: '20%' }}>
                                    <h5>Quantity: </h5>
                                    <div style={{ display: 'flex', backgroundColor: 'white', justifyContent: 'space-between', borderRadius: '5px' }}>
                                        <Button
                                            disabled={total <= 0 ? true : false}
                                            variant="danger"
                                            onClick={() => this.setState({ total: total - 1 })}>
                                            -
                                        </Button>
                                        <h1>{total}</h1>
                                        <Button
                                            disabled={total >= stock ? true : false}
                                            variant="primary"
                                            onClick={() => this.setState({ total: total + 1 })}>
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary">Close</Button>
                        <Button variant="primary">Save changes</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        email: state.user.email,
        cart: state.user.cart
    }
}

export default connect(mapStateToProps)(DetailProduct)