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

class Error {
    error: string

    constructor(error: string) {
        this.error = error;

    }

}

let client: any;
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<VerifiedRoles | { message: string }>
) {
    try {
        const {roleId} = req.query;
        if (!roleId) {
            res.status(400).json({ message: "Invalid Request no roleId" });
        }
        client = await connectToClient();
        await client.connect();
        const db = await client.db("supplyChain");
        // Perform database operations
        const collection = await db.collection("role");
        // // Query for a movie that has the title 'Back to the Future'
        const query = {id: roleId};
        const role = await collection.findOne(query);
        console.log(role);

        // if (data)  {

        res.status(200).json(role);

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    } finally {
        await client.close()
    }
}