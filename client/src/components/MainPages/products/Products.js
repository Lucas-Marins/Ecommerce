import React, {useContext, useState} from 'react'
import {GlobalState} from '../../../GlobalState'
import ProductItem from '../utils/productItem/productItem'
import Loading from '../utils/loading/Loading'


function Products() {
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const [isAdmin] = state.UserAPI.isAdmin

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
