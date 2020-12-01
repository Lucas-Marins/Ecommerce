const Product = require('../models/product');

class Apifeatures {
  constructor(query , queryString){
    this.query = query
    this.queryString = queryString;
  }
  filtering(){
    const queryObj = {...this.queryString}
    const excludedFields = ['page', 'sort', 'limit']
    excludedFields.forEach(el => delete(queryObj[el]))

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

    // gte = greatet than or equal
    // lte = Lesser than or equal
    // lt = Lesse than
    // gt = greater than
    this.query.find(JSON.parse(queryStr))

    return this;
  }

  sorting(){
    if(this.queryString.sort){
      const sortBy = this.queryString.sort.split(',').join(' ')
      console.log(sortBy)
      this.query = this.query.sort(sortBy)
    }else{
      this.query = this.query.sort('-createdAt')
    }

    return this;
  }

  paginating(){
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 9
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit)
    return this
  }
}

const productCrtl = {
  getProduct: async (req, res) => {
    try {
      const features = new Apifeatures(Product.find(), req.query)
      .filtering().sorting().paginating()

      const products = await features.query

      res.json({
        status: 'success',
        result: products.length,
        product: products
      })
    } catch (error) {
      return res.status(500).json({msg: err.message})
    }
  },
  createProduct: async(req, res) => {
    try {
    const {product_id, title, price, description, content, images, category, numReviews, rating} = req.body
      if(!images) return res.status(500).json({msg: 'No image upload'})

      const product = await Product.findOne({product_id})
      if(product)
      return res.status(500).json({msg: "This product already exists"})

      const newProduct = new Product({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
        numReviews,
        rating
      })

      await newProduct.save()
      res.json(newProduct)

    } catch (error) {
      return res.status(500).json({msg: err.message})
    }
  },
  deleteProduct: async(req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id)
      res.json({msg:"Deleted a Product"})
    } catch (error) {
      return res.status(500).json({msg: err.message})
    }
  },
  updateProducts: async(req, res) => {
    try {
      const {title, price, description, content, images, category} = req.body
      if(!images) return res.status(500).json({msg: 'No image upload'})

      await Product.findByIdAndUpdate({_id: req.params.id}, {
        title: title.toLowerCase(), 
        price, 
        description, 
        content, 
        images, 
        category
      })

      res.json({msg: "Updated a Product"})
    } catch (error) {
      return res.status(500).json({msg: err.message})
    }
  },
  reviews: async(req, res) => {
    try {
        const {rating} = req.body

        if(rating && rating !== 0){
            const product = await Product.findById(req.params.id)
            if(!product) return res.status(400).json({msg: 'Product does not exist.'})

            let num = product.numReviews
            let rate = product.rating

            await Product.findOneAndUpdate({_id: req.params.id}, {
                rating: rate + rating, numReviews: num + 1
            })

            res.json({msg: 'Update success'})

        }

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  }
}


module.exports = productCrtl