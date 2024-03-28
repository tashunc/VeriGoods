// pages/api/hello.ts
import type {NextApiRequest, NextApiResponse} from 'next';
import {connectToClient} from '@/utils/mongodb';

class VerifiedRoles {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

}

let client: any;
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<VerifiedRoles | { message: string }>
) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Method Not Allowed' });
        }
        const { id, name } = req.body;

        client = await connectToClient();
        await client.connect();
        const db = await client.db("supplyChain");
        // Perform database operations
        const collection = await db.collection("role");

        const doc = {
            id: id,
            name: name,
        }
        const result = await collection.insertOne(doc);

        console.log(`A document was inserted with the _id: ${result.insertedId}`);


        // // Query for a movie that has the title 'Back to the Future'


        // if (data)  {
        res.status(200).json({message: "Document inserted Successfully"})

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    } finally {
        await client.close()
    }
}