import React, {createContext, useState, useEffect} from 'react'
import ProductsAPI from './api/ProductAPI'
import UserAPI from './api/UserAPI'
import axios from 'axios'

export const GlobalState = createContext()

export const DataProvider = ({children}) => {
  const [token, setToken] = useState(false)

  const refreshToken = async () => {
    const res = await axios.get('/user/refresh_token')

    setToken(res.data.accesstoken)
   
  }

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin')
    if(firstLogin) refreshToken()
  },[])

  const state= {
    token: [token, setToken] ,
    productsAPI : ProductsAPI(),
    UserAPI: UserAPI(token)
  }
  return(
    <GlobalState.Provider value={state}>
        {children}
    </GlobalState.Provider>
  )
}