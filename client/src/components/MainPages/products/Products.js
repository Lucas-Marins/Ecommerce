import React, {useContext, useState} from 'react'
import {GlobalState} from '../../../GlobalState'
import ProductItem from '../utils/productItem/productItem'


function Products() {
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products

    return (
        <div className="products">
            {
                products.map(product => {
                    return <ProductItem key={product._id} product={product} />
                })
            } 
        </div>
    )
}

export default Products
