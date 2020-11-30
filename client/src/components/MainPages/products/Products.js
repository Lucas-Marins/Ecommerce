import React, {useContext, useEffect} from 'react'
import {GlobalState} from '../../../GlobalState'
import ProductItem from '../utils/productItem/productItem'
import Loading from '../utils/loading/Loading'
import axios from 'axios'


function Products() {
    const state = useContext(GlobalState)
    const [products, setProducts] = state.productsAPI.products
    const [isAdmin] = state.UserAPI.isAdmin
 
    
    useEffect(()=>{
      const getProducts = async () => {
        const res = await axios.get('/api/products')
        setProducts(res.data.product)
      }

      getProducts()
    },[setProducts])
  

    return (
      <>
        <div className="products">
            {
                products.map(product => {
                    return <ProductItem key={product._id} product={product}
                    isAdmin={isAdmin} />
                  
                })
            } 
        </div>
        {products.length === 0 && <Loading />}
      </>
    )
}

export default Products
