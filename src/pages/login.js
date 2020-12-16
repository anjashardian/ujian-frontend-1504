import React from 'react'
import Axios from 'axios'
import {
    InputGroup,
    FormControl,
    Button,
    Modal
} from 'react-bootstrap'

import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../actions'

class LoginPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            loginError: [false, ""]
        }
    }

    handleLogin = () => {
        let email = this.refs.email.value;
        let password = this.refs.password.value;

        console.log(email, password);
        if (!email || !password) return this.setState({ loginError: [true, "Please Input All Form"] })


        Axios.get(`http://localhost:2000/users?email=${email}&password=${password}`)
            .then((res) => {
                console.log(res.data);

                if (res.data.length === 0) return this.setState({ loginError: [true, "Invalid Email or Password"] })
                localStorage.id = res.data[0].id;
                this.props.login(res.data[0])
                this.setState({ loginError: [false, ""] });
            })
            .catch((err) => console.log(err));
    };

    render() {
        // console.log(this)
        if (this.props.username) return <Redirect to="/" />
        // object destructuring untuk local state
        const { loginError, visible } = this.state

        return (
            <div style={styles.container}>
                <div style={styles.center}>
                    <div style={{ marginBottom: '10px' }}>
                        <h1>Login</h1>
                    </div>
                    <div style={{ width: '100%', height: 'auto', marginButtom: '5px', textAlign: 'center' }}>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1" style={{ width: '45px', display: 'flex', justifyContent: 'center' }}>
                                    <i className="fas fa-user" ></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Email"
                                aria-label="Email"
                                aria-describedby="basic-addon1"
                                ref="email"
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend style={{ cursor: 'pointer' }}
                                onClick={() => this.setState({ visible: !visible })}>
                                <InputGroup.Text id="basic-addon1" style={{ width: '45px', display: 'flex', justifyContent: 'center' }}>
                                    <i className={visible ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Password"
                                aria-label="Password"
                                aria-describedby="basic-addon1"
                                ref="password"
                                type={visible ? "text" : "password"}
                            />
                        </InputGroup>
                        <Button onClick={this.handleLogin} style={{ margin: "10px" }}>
                            Login
                            <i className="fas fa-sign-in-alt" style={{ marginLeft: "8px" }} />
                        </Button>
                        </div>
                </div>
                <Modal show={loginError[0]} onHide={() => this.setState({ loginError: [false, ""] })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>{loginError[1]}</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" onClick={() => this.setState({ loginError: [false, ""] })}>
                            Okay
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        background: "url(https://images.unsplash.com/photo-1560072810-1cffb09faf0f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80) no-repeat center",
        backgroundSize: 'cover'
    },
    center: {
        marginTop: '100px',
        padding: '10px 30px',
        width: '350px',
        height: '50vh',
        backgroundColor: 'rgba(255, 255, 255, .7)',
        display: 'flex',
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid gray",
        borderRadius: "30px"
    },
    item: {
        width: '100%',
        height: 'auto',
        marginButtom: '5px'
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.user.username
    }
}

export default connect(mapStateToProps, { login })(LoginPage)