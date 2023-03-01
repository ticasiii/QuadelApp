import { createClient, Graph } from 'redis';

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

export const quadelGraph = new Graph(client, 'graph'); 