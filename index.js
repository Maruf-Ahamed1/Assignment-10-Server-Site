const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, Long, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

//__________Middleware -----//
app.use(cors());
app.use(express.json())


//--------------------------------------------


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aymc4k9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

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

    //___Database name____//
    const CraftCollection = client.db("CraftDB").collection('craft')
        //_______POST________//
    app.post('/add',async(req,res)=>{
        console.log(req.body)
        const result = await CraftCollection.insertOne(req.body)
        // console.log(result);
        res.send(result)
    })
        //________GET_________//
    app.get('/my/:email',async(req,res)=>{
      console.log(req.params.email)
      const result = await CraftCollection.find({email:req.params.email}).toArray()
      res.send(result)
    })
        //________GET-2_________//
    app.get("/singleDetails/:id",async(req,res) =>{
      console.log(req.params.id)
      const result = await CraftCollection.findOne({_id: new ObjectId(req.params.id),})
      console.log(result)
      res.send(result)
    })

    app.put("/updateCraft/:id",async(req,res) => {
      console.log(req.params.id)
      const query = {_id: new ObjectId(req.params.id)}
      const data = {
        $set:{
          Subcategory_Name:req.body.Subcategory_Name,
          price:req.body.price,
          Short_Description:req.body.Short_Description,
          rating:req.body.rating,
        }
      }
      const result = await CraftCollection.updateOne(query,data);
      console.log(result);
      res.send(result)
    })
  

      //__________Delete___________//
    app.delete('/my/:id',async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await CraftCollection.deleteOne(query)
      console.log(result)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close(); 
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('Art-Maker server is running')
})

app.listen(port,()=>{
    console.log(`Art-Maker Server is Running>>>>>: ${port}`)
})

