const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = "mongodb+srv://tech_hub_dbUser:h9eNs7RmHcHYcvhf@cluster0.ilfvfer.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const myDB = client.db("tech-hub");
        const usersCollection = myDB.collection("users");
        const cartItems = myDB.collection("cartItems");
        const productsCollection = myDB.collection("allProductData");


        // add user to database
        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log("New User : ", user);
            const result = await usersCollection.insertOne(user)
            res.send(result)

        });
        //add products in cart
        app.post('/cartitems', async (req, res) => {
            const cart = req.body;
            console.log("Cart item : ", cart);
            const result = await cartItems.insertOne(cart)
            res.send(result)
        });
        // Get all products
        app.get('/products', async (req, res) => {
            const products = await productsCollection.find().toArray();
            res.send(products);
        });
        // Delete a product by ID
        const { ObjectId } = require('mongodb');
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        //add new products
        app.post('/products', async (req, res) => {
            try {
                const product = req.body;
                if (!product.name || !product.addedBy) {
                    return res.status(400).send({ error: 'Missing required fields' });
                }
                const result = await productsCollection.insertOne(product);
                res.send(result);
            } catch (error) {
                console.error("Error adding product:", error);
                res.status(500).send({ error: 'Failed to add product' });
            }
        });






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);


app.get('/', (req, res) => {
    res.send("Simple server is running")
})

app.listen(port, () => {
    console.log(`SImple server is running on port ${port}`);
})