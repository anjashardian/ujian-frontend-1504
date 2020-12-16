import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Axios from 'axios'
import {connect} from 'react-redux'

import Navigation from './components/Navigation'

import Home from './pages/home'
import LoginPage from './pages/login'
import DetailProduct from './pages/detProduct'
import Error from './pages/error'
import CartPage from './pages/cartPage'

import { login} from './actions'

class App extends React.Component{
  componentDidMount() {
    Axios.get(`http://localhost:2000/users/${localStorage.id}`)
        .then((res) => {
            console.log(res.data);
            this.props.login(res.data)

            // keep get history
            Axios.get(`http://localhost:2000/history?email=${this.props.email}`)
                .then((res) => {
                    console.log(res.data)
                    this.props.getHistory(res.data)
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err));
}
  render(){
    return(
      <div>
        <Navigation/>
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/login' component={LoginPage} />
          <Route path='/detail' component={DetailProduct} />
          <Route path='/cart' component={CartPage} />
          <Route path='*' component={Error} />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
      email: state.user.email,
      
  }
}

export default connect(mapStateToProps, { login })(App)
