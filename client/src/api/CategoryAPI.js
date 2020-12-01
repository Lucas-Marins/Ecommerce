import {useState, useEffect} from 'react';
import axios from 'axios'

function CategoriesAPI() {
  const [callback, setCallback] = useState(false)
  const [ categories, setCategories] = useState([])
  
  useEffect(()=>{
    const getCategories = async () => {
      const res = await axios.get('/api/category')
      setCategories(res.data)
    }

    getCategories()
  },[callback])

  return{
    categories: [ categories, setCategories],
    callback: [callback, setCallback]
  }
}

export default CategoriesAPI;