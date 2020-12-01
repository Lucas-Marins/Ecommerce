import {useState, useEffect} from 'react'
import axios from 'axios'
import io from 'socket.io-client'


function ProductsAPI(){
  const[products, setProducts] = useState([])
  const[callback, setCallback] = useState(false)
  const [category, setCategory] = useState('')
  const [sort, sortSort] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(0)
  const [socket, setSocket] = useState(null)



  
  useEffect(()=>{
    const getProducts = async () => {
      const res = await axios.get(`/api/products?limit=${page*9}&${category}&${sort}&title[regex]=${search}`)
      setProducts(res.data.product)
      setResult(res.data.result)

      
      const socket = io()
      setSocket(socket)
      return () => socket.close()     
    }

    getProducts()
  },[callback, category, sort, search, page])

 
  return{
    products:[products, setProducts],
    callback: [callback, setCallback],
    category: [category , setCategory],
    sort: [sort, sortSort],
    search: [search, setSearch],
    page:  [page, setPage],
    result:  [result, setResult],
    socket,
  }
}

export default ProductsAPI