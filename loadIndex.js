import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CSVLoader } from "langchain/document_loaders/fs/csv";

dotenv.config();

/* Make sure you have Pincecone DB set up already. You can create the pinecone db via api 
   but, it's much easier to do it via UI imo.*/
/// https://www.pinecone.io/docs/indexes/#create-an-index
const client = new PineconeClient();
await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
});
const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

console.log("Pinecone Index:" + pineconeIndex);

/* langchain has many types of transform loaders. these loaders will 
transform data from a specific format into the Document format. */  
const loader = new PDFLoader(/* your pdf */);
//const loader = new CSVLoader(/* your csv */); //example of another loader type
const documents = await loader.load();
console.log("documents: " + JSON.stringify(docs));

var result = await PineconeStore.fromDocuments(documents, new OpenAIEmbeddings(), {
    pineconeIndex,
});

console.log("Result: " + JSON.stringify(result));
