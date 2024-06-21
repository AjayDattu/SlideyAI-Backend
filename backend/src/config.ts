import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017'; // MongoDB URL
const dbName = 'slidyai'; // Database name

const client = new MongoClient(url);

export async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(dbName);
    } catch (err) {
        console.error('Connection error', err);
        throw err;
    }
}

export { client };
