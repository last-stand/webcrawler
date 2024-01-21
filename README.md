# CrawlCraft :spider: Webcrawler
This system capable of crawling data from a provided web URL,
vectorizing the crawled data, and enabling users to submit queries to retrieve and visualize
relevant information.

## Requirements
* Implement a web crawling mechanism in JavaScript or TypeScript to fetch and
extract data from any provided URL or website.
* Ensure that your solution is capable of handling dynamic content or elements
loaded asynchronously on the web page.
* Implement a method to convert the crawled textual data into vectorized
representations. Choose an appropriate vectorization technique (eg. Word
Embeddings) and store the data in a Vector DB.
* Develop a system where the user submits text queries, vectorizing them using
the same technique, and providing the top 3 relevant crawled data.

## Architecture Diagram

Here's a description of the architecture diagram, incorporating the specified components:
1.  **Data Ingestion**
    
    -   **Puppeteer:** Fetches web page content from given URL and passes it to the next component.
    
2.  **Tokenization and OpenAI Embeddings**
    
    -   **LangChain:** Tokenizes text into meaningful units, generates OpenAI embeddings for tokens.
    
3.  **Embedding Storage**
    
    -   **Pinecone:** Pinecone is used as a vector database. It stores OpenAI embeddings efficiently, enables fast similarity search.
    
4.  **Query Processing and Retrieval from db:**
    
    -   **Query Input:** Receives user query.
    -   **Embedding Generation:** Generates OpenAI embeddings for query.
    -   **Similarity Search:** Uses Pinecone to find top 3 matching embeddings.
    
5.  **Response Generation**
    
    -   **Data Retrieval:** Retrieves corresponding web page content based on matched embeddings.
    -   **OpenAI LLM:** Processes retrieved content and query, generates informative and comprehensive answer.

6.  **NodeJs Server**
    
    -   **Express:** This whole setup is running on the top of **express** server which is providing interface to use this system.
    

**Visual Diagram (Conceptual)**

[View on Eraser![](https://app.eraser.io/workspace/1XPo5y3hUOEtLZTNkvx4/preview)](https://app.eraser.io/workspace/1XPo5y3hUOEtLZTNkvx4)

**Key Considerations**

-   **Embedding Dimensionality:** Choose appropriate dimensionality for embeddings, balancing accuracy and storage/search efficiency.
-   **Similarity Metric:** Select a suitable similarity metric for Pinecone search (e.g., cosine similarity).
-   **Query Understanding:** Ensure the LLM can effectively understand and interpret user queries.
-   **Answer Generation:** Refine LLM prompts and parameters for generating accurate and relevant answers.

## Build and Run
1. **Prerequisites**
	- Make sure you have node js installed with version `>=18.0.0` and npm version `>=8.0.0 <10.0.0`
	- You create should create Pinecone vector databse account and generate api key [pinecone-api-link](https://docs.pinecone.io/docs/quickstart#2-get-your-api-key). Pinecone also have free tier database which can be used by beginners witout need of adding credit card.
	- You create should create OpenAI account and generate api key [openapi-link](https://platform.openai.com/account/api-keys). 
2. **Install node js dependencies**
	- Go to the project's root folder and run
	```sh
	$ npm install
	```
3. **Configuration**
	- Create `.env` file in project's root folder with given template below and provide api keys mentioned below. You can tweak config according to your need.
        ```
        ENV=dev
        PORT=8001
        URL=http://127.0.0.1:8001
        OPENAI_API_KEY=sk-YOUR_OPEN_API_KEY
        PINECONE_API_KEY=YOUR_PINECONE_API_KEY
        PINECONE_ENVIRONMENT=gcp-starter
        PINECONE_INDEX=web-crawler
        ```
4. **Run**
	- To start express server just run
        ```sh
        $ npm start
        ```
	    By default server will run on 8001 port. Open the  link [http://127.0.0.1:8001](http://127.0.0.1:8001) in the browser.
    
	- To run express server in dev mode, run
        ```sh
        $ npm run dev
        ```
	This is how UI looks like in the browser.
    [Screenshot![](https://app.eraser.io/workspace/tkMgJtPpnJXu3rdHvkyf/preview)](https://app.eraser.io/workspace/tkMgJtPpnJXu3rdHvkyf)