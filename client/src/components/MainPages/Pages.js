import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Products from './products/Products'
import DetailProduct from './detailProduct/detailProduct'
import Login from './auth/Login'
import Register from './auth/Register'
import Cart from './cart/Cart'
import NotFound from  './utils/not_found/NotFound'


function Pages(){
  return(
    <Switch>
      <Route path="/" exact component={Products} />
      <Route path="/details/:id"  component={DetailProduct} />

      <Route path="/login"  component={Login} />
      <Route path="/register"  component={Register} />

      <Route path="/cart"  component={Cart} />


      <Route path="*"  component={NotFound} />
    </Switch>
  )
}

export default Pages