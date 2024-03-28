// pages/api/hello.ts
import type {NextApiRequest, NextApiResponse} from 'next';
import {connectToClient} from '@/utils/mongodb';
import {number} from "prop-types";

class leaf {
    position: number;
    data: string

    constructor(position: number, data: string) {
        this.position = position;
        this.data = data;

    }

}


let client: any;
let increment: number;

let hashes = new HashMap()
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<leaf | { message: string }>
) {
    try {
        if (req.method === 'GET') {
            client = await connectToClient();
            await client.connect();
            const db = await client.db("supplyChain");
            // Perform database operations
            const collection = await db.collection("proof");
            // db.proxy.createIndex( { "position" : 1 }, { unique : true } )
            let index = 0;
            const lastPosition = await collection.find({}).sort({position: -1}).limit(1).toArray();
            while (index >= lastPosition) {
                if (!hashes.get(index)) {
                    const item = await collection.findOne({position: index});
                    if (!!item) {
                        console.error("Update Failed, item : " + item + ", index : " +index)
                        break;
                    }
                    hashes.set(item.position, item.data)
                }
                index++;

            }
            // const lastPosition = await collection.find({},{["position"]: 1, _id: 0}).sort({position: -1}).limit(1).toArray();
            // increment = lastPosition[0]?.position? lastPosition[0]?.position : 0;
            // console.log(lastPosition[0]?.position);
            // const lastRecords = collection.findOne().sort({position: -1}).limit(1);
            // const doc = {
            //     increment++,
            //     data
            // }
            // const result = await collection.insertOne(doc);

            // console.log(`A document was inserted with the _id: ${result.insertedId}`);
            // console.log(lastRecords)
            res.status(200).json({message: "Good"})


        } else if (req.method === 'POST') {

            // should send the hash value of the data that u need proof of
            const data = req.body;
            console.log(data)
            client = await connectToClient();
            await client.connect();
            const db = await client.db("supplyChain");
            // Perform database operations
            const collection = await db.collection("proof");
            // db.proxy.createIndex({"position": 1}, {unique: true})

            const lastPosition = await collection.find({}).sort({position: -1}).limit(1).toArray();
            increment = (lastPosition[0]?.position ? lastPosition[0]?.position : 0) + 1;
            console.log("Added position : " + lastPosition[0]?.position + 1);
            const doc = {
                position: increment,
                data
            }
            const result = await collection.insertOne(doc);

            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            // console.log(lastRecords)


            // // Query for a movie that has the title 'Back to the Future'


            // if (data)  {
            res.status(200).json({message: "Document inserted Successfully"})
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    } finally {
        await client.close()
    }
}