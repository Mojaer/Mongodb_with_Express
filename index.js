const express = require('express');
var bodyParser = require('body-parser')


const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const mongoose = require('mongoose');
const { ppid } = require('process');


const productDb = new mongoose.Schema({
    tittle: String,
    price: Number,
    description: String,
    createAt: {
        type: Date,
        default: Date.now
    }

})

const Product = mongoose.model("Products", productDb);


const mongoDB = async (req, res) => {
    try {
        await mongoose.connect('mongodb://127.0.1:27017/testMongoDB');
        console.log('gese gese');

    } catch (error) {
        console.log('cholena');
        console.log(error.message);
        process.exit(1)

    }
}


//GET request to see all product-----------------------------------------------------------

app.get('/', async (req, res) => {
    try {
        const allProducts = await Product.find();
        const limitedProducts = await Product.find({ price: { $gt: 17 } })
        res.status(202).send({
            success: true,
            message: 'Products are available',
            limited: limitedProducts,
            Data: allProducts

        });
    } catch (error) {
        res.status(200).send({
            success: false,
            message: error.message
        })

    }
})

//Get specific products---------------------------------------------------------

app.get('/product/:id', async (req, res) => {
    try {
        const id = req.params.id

        const specificProduct = await Product.findOne({ _id: id }).select({
            tittle: true,
            price: 1,
            _id: 0
        });
        // Here select is for specific property of the product and tittle :true/1 will show only tittle 
        // and _id:0/false wont show thw id property

        res.status(202).send({
            success: true,
            message: 'Products are available',
            Data: specificProduct

        });
    } catch (error) {
        res.status(200).send(error.message)

    }
})

// POST request to add product --------------------------------------------------------------

app.post('/product', async (req, res) => {
    try {
        const tittle = req.body.tittle;
        const price = req.body.price;
        const description = req.body.description;

        const newProduct = new Product({
            tittle: tittle,
            price: price,
            description: description,
        })
        const productData = await newProduct.save()
        res.status(201).send(productData);

    } catch (error) {

        res.status(500).send(error.message)
    }
})

// Listen in a port ----------------------------------------------------------------------------

app.listen(3000, async () => {
    console.log('this is running in http://localhost:3000');
    await mongoDB()
})