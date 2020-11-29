import React ,{useContext} from 'react'
import {Switch, Route} from 'react-router-dom'
import Products from './products/Products'
import DetailProduct from './detailProduct/detailProduct'
import Login from './auth/Login'
import Register from './auth/Register'
import OrderHistory from './history/OrderHistory'
import OrderDetails from './history/OrderDetails'
import Cart from './cart/Cart'
import NotFound from  './utils/not_found/NotFound'
import Category from './categories/Categories'

import {GlobalState} from '../../GlobalState'


function Pages(){
  const state = useContext(GlobalState)
  const [isLogged] = state.UserAPI.isLogged
  const [isAdmin] = state.UserAPI.isAdmin

  return(
    <Switch>
      <Route path="/" exact component={Products} />
      <Route path="/details/:id"  component={DetailProduct} />

      <Route path="/login"  component={isLogged ? NotFound : Login} />
      <Route path="/register"  component={isLogged ? NotFound : Register} />

      <Route path="/category"  component={isAdmin ? Category : NotFound} />


      <Route path="/history"  exact component={isLogged ? OrderHistory : NotFound} />
      <Route path="/history/:id" exact component={isLogged ? OrderDetails : NotFound} />

      <Route path="/cart"  exact component={Cart} />


      <Route path="*"  component={NotFound} />
    </Switch>
  )
}

export default Pages