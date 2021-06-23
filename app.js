const express = require('express');
const hbs = require('hbs')

var app = express()
app.set('view engine', 'hbs')

const MongoClient = require('mongodb').MongoClient
const url = "mongodb+srv://hungnt:hwng.nt1608@cluster0.mrpik.mongodb.net/test"

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))

app.get('/', (req, res) =>{
    res.render('index')
})

app.get('/insert', (req, res) =>{
    res.render('insert')
})

app.post('/doInsert', async (req, res) => {
    var nameInput = req.body.txtName;
    var priceInput = req.body.txtPrice;
    var imageInput = req.body.txtImage;
    var newProduct = {name: nameInput, price: priceInput, image: imageInput}
    var client = await MongoClient.connect(url)
    var dbo = client.db("NguyenThanhHungDB")
    await dbo.collection("Toy").insertOne(newProduct)
    res.render('index')
})

app.get('/view', async (req, res) => {
    var client = await MongoClient.connect(url)
    var dbo = client.db("NguyenThanhHungDB")
    var results = await dbo.collection("Toy").find({}).toArray()
    res.render('allProducts', {model:results})
})

app.get('/edit', async (req, res) => {
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id" : ObjectID(id)};
    const client= await MongoClient.connect(url);
    const dbo = client.db("NguyenThanhHungDB");
    const productToEdit = await dbo.collection("Toy").findOne(condition);
    res.render('edit',{product:productToEdit})
})

app.post('/update', async (req, res) => {
    let id = req.body.id;
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let newValues = {$set : {name: nameInput, price: priceInput}};
    var ObjectID =require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client = await MongoClient.connect(url);
    let dbo = client.db("NguyenThanhHungDB");
    await dbo.collection("Toy").updateOne(condition, newValues);
    res.redirect('/view')
})



const path = require('path');

const router = express.Router();
const upload = require('./uploadMiddleware');
const Resize = require('./Resize');

router.get('/', async function (req, res) {
    await res.render('index');
});

router.post('/post', upload.single('image'), async function (req, res) {
    // folder upload
    const imagePath = path.join(__dirname, '/public/images');
    // call class Resize
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
        res.status(401).json({error: 'Please provide an image'});
    }
    const filename = await fileUpload.save(req.file.buffer);
    
    return res.status(200).json({ name: filename });
});

module.exports = router;






var PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running at: ' + PORT)