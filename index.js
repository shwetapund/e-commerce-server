import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import mongoose, {Schema,model} from "mongoose";

const app = express();
app.use(express.json());

const PORT = 5000;

const connectMongoDB = async () =>{
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    if(conn){
        console.log("MongoDB connected successfully");
    }
}
connectMongoDB();

const productSchema = new Schema ({
    name:String,
    description:String,
    productImage:String,
    price:String,
    highQuality:String,
});


//model
const Product = model('Product',productSchema);

app.get('/products',async(req,res)=>{

    const products = await Product.find();
   res.json({
        success : true,
        data: products,
        message:'successfully fetch all products'
    })
});

app.post('/product',async (req,res)=>{
    const {name, description, price, productImage, highQuality} = req.body;

    const newProduct = new Product({
        name:name,
        description:description,
        price:price,
        productImage:productImage,
        highQuality:highQuality,
    })
    const savedProduct = await newProduct.save();

    res.json({
        success:true,
        data: savedProduct,
        message:'successfully added new products'
    })
})

app.get('/product',async (req,res)=>{
    const {name} = req.query;

    const product = await Product.findOne({
        name:name
    })
    res.json({
        success:true,
        data:product,
        message:"successfully fetch products",
    })
})

app.delete('/product/:id',async(req,res)=>{
    const {id} = req.params;

    await Product.deleteOne({_id:id})

    res.json({
        success:true,
        data:{},
        message:`Successfully deleted product with id ${id}`,
    })

});

app.put('/product/:_id', async(req,res)=>{
    const {_id} = req.params;

    const {name,description,price,productImage,highQuality} = req.body;

    await Product.updateOne({_id:_id},{$set: {
        name:name,
        description:description,
        highQuality:highQuality,
        productImage:productImage,
        price:price
    } })

    const findUpdate = await Product.findOne({_id:_id})

    res.json({
        success:true,
        data:findUpdate,
        message:`Successfully update product with id ${_id}`
    })

})

app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`)
})


