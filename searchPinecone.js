import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

dotenv.config();

/* Make sure you have Pincecone DB set up already AND have data stored in vectors. You can create the pinecone db via api but, it's much easier to
do it via UI imo.*/
/// https://www.pinecone.io/docs/indexes/#create-an-index
const client = new PineconeClient();
await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
});
const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

/// https://js.langchain.com/docs/api/vectorstores_pinecone/classes/PineconeStore#fromexistingindex
const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex}
);

/* Make sure to have an OpenAI Api key  */
/// https://js.langchain.com/docs/api/llms_openai/classes/OpenAI#constructor
const model = new OpenAI();

/// https://python.langchain.com/en/latest/modules/chains/getting_started.html#quick-start-using-llmchain
const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    k: 1,
    returnSourceDocuments: true,
});

var query = "what is this document about?"
const response = await chain.call({query: query });

console.log("\n" + "Query: " + query + "\n");
console.log("\n" + "Response: " +response.text + "\n");