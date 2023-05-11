import { MongoClient } from "mongodb";

const mongoUri = "";

export const client = new MongoClient(mongoUri);

export async function runDb() {
  try {
    await client
    await client.db("")
  } catch (e) {}
}
