import React, {useContext, useState, useEffect,useRef} from 'react'
import {useParams, Link} from 'react-router-dom'
import {GlobalState} from '../../../GlobalState'
import ProductItem from '../utils/productItem/productItem'
import Rating from '../rating/Rating'
import FormInput from '../utils/formInput/FormInput'
import axios from 'axios'
import CommentItem from '../utils/commentItem/CommentItem'
import Loading from '../utils/images/loading.gif'


function DetailProduct() {
    const params = useParams()
    const {id} = useParams()
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const addCart = state.UserAPI.addCart
    const [detailProduct, setDetailProduct] = useState([])
    const socket = state.productsAPI.socket

    const [rating, setRating] = useState(0)

    const[comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)

    const [page, setPage] = useState(1)
    const pageEnd = useRef()

    useEffect(() =>{
        if(params.id){

            products.forEach(product => {
                if(product._id === params.id) setDetailProduct(product)
            })
        }
    },[params.id, products])


     useState(() => {
        setLoading(true)
        const getData = async () => {
            const res = await axios.get(`/api/comments/${id}?limit=${page * 5}`)
            setComments(res.data.comments)
            setLoading(false)
        }
        getData()
    },[id, page])


    // Realtime
    // Join room
    useEffect(() => {
        if(socket){
            socket.emit('joinRoom', id)
        }
    },[socket, id])

      // infiniti scroll
    //   useEffect(() => {
    //     const observer = new IntersectionObserver(entries => {
    //         if(entries[0].isIntersecting){
    //             setPage(prev => prev + 1)
    //         }
    //     },{
    //         threshold: 0.1
    //     })

    //     observer.observe(pageEnd.current)
    // },[])


    useEffect(() => {
        if(socket){
            socket.on('sendCommentToClient', msg => {
                setComments([msg, ...comments])
            })

            return () => socket.off('sendCommentToClient')
        } 
    },[socket, comments])

    useEffect(() => {
        if(socket){
            socket.on('sendReplyCommentToClient', msg => {
                const newArr = [...comments]
                newArr.forEach(cm => {
                    if(cm._id === msg._id){
                        cm.reply = msg.reply
                    }
                })

                setComments(newArr)
            })

            return () => socket.off('sendReplyCommentToClient')
        } 
    },[socket, comments])

    if(detailProduct.length === 0) return null;


    return (
        <>
            <div className="detail">
                <img src={detailProduct.images.url} alt="" />
                <div className="box-detail">
                    <div className="row">
                        <h2>{detailProduct.title}</h2>
                        <h6>#id: {detailProduct.product_id}</h6>
                    </div>
                    <span>$ {detailProduct.price}</span>
                    <p>{detailProduct.description}</p>
                    <p>{detailProduct.content}</p>
                    <p>Sold: {detailProduct.sold}</p>
                    <Link to="/cart" className="cart"
                     onClick={() => addCart(detailProduct) }>
                         Buy now
                    </Link>

                    <div>
                        <h3 style={{margin: '10px 0'}} > Rating: {detailProduct.numReviews} reviews</h3>
                        <Rating props={products}/>
                    </div>
                </div>
            </div>

            <div className="comments">
                    <h2 >
                        Faça aqui seu comentário sobre o produto e avalie 
                    </h2>

                <div className="reviews">
                    <input type="radio" name="rate" id="rd-5" onChange={() => setRating(5)} />
                    <label htmlFor="rd-5" className="fas fa-star"></label>

                    <input type="radio" name="rate" id="rd-4" onChange={() => setRating(4)} />
                    <label htmlFor="rd-4" className="fas fa-star"></label>

                    <input type="radio" name="rate" id="rd-3" onChange={() => setRating(3)} />
                    <label htmlFor="rd-3" className="fas fa-star"></label>

                    <input type="radio" name="rate" id="rd-2" onChange={() => setRating(2)} />
                    <label htmlFor="rd-2" className="fas fa-star"></label>

                    <input type="radio" name="rate" id="rd-1" onChange={() => setRating(1)} />
                    <label htmlFor="rd-1" className="fas fa-star"></label>
                </div>
            </div>

        <FormInput id={id} socket={socket} rating={rating} />       

        <div className="comments_list">
                {
                    comments.map(comment => (
                        <CommentItem key={comment._id} comment={comment} socket={socket} />
                    ))
                }
        </div>    

            <div>
                <h2>Related products</h2>
                <div className="products">
                    {
                        products.map(product => {
                            return product.category === detailProduct.category 
                                ? <ProductItem key={product._id} product={product} /> : null
                        })
                    }
                </div>

                {
                    loading && <div className="loading"><img src={Loading} alt=""/></div>
                }
                <button ref={pageEnd} style={{opacity: 0}}>Load more</button>
            </div>
        </>
    )
}

export default DetailProduct