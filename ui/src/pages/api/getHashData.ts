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
    res: NextApiResponse<HashMap<string> | { message: string }>
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
            res.status(200).json(hashes)


        }


    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    } finally {
        await client.close()
    }
}