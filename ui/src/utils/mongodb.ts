const { MongoClient, ServerApiVersion } = require('mongodb');

// Replace the uri string with your connection string.
const uri = process.env.CONNECTION_STRING? process.env.CONNECTION_STRING :" None";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
export async function connectToClient() {
    try {
         // console.log(uri)
        // await client.db("supplyChain").command({ ping: 1 });
        // await client.connect();
        // await client.db("supplyChain").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return client;
        // const movies = database.collection("role");
        // // Query for a movie that has the title 'Back to the Future'
        // const query = { id: 'id_1' };
        // const movie = await movies.findOne(query);
        // console.log(movie);
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
// run().catch(console.dir);