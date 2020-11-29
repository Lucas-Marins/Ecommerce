import React ,{useContext, useEffect} from 'react'
import {Switch, Route} from 'react-router-dom'
import Products from './products/Products'
import DetailProduct from './detailProduct/detailProduct'
import Login from './auth/Login'
import Register from './auth/Register'
import Cart from './cart/Cart'
import NotFound from  './utils/not_found/NotFound'

import {GlobalState} from '../../GlobalState'


function Pages(){
  const state = useContext(GlobalState)
  const [isLogged] = state.UserAPI.isLogged

  return(
    <Switch>
      <Route path="/" exact component={Products} />
      <Route path="/details/:id"  component={DetailProduct} />

      <Route path="/login"  component={isLogged ? NotFound : Login} />
      <Route path="/register"  component={isLogged ? NotFound : Register} />

      <Route path="/cart"  component={Cart} />


      <Route path="*"  component={NotFound} />
    </Switch>
  )
}

export default Pages