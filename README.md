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
    
3.  **Tokenization and OpenAI Embeddings**
    
    -   **LangChain:** Tokenizes text into meaningful units, generates OpenAI embeddings for tokens.
    
5.  **Embedding Storage**
    
    -   **Pinecone:** Pinecone is used as a vector database. It stores OpenAI embeddings efficiently, enables fast similarity search.
    
7.  **Query Processing and Retrieval from db:**
    
    -   **Query Input:** Receives user query.
    -   **Embedding Generation:** Generates OpenAI embeddings for query.
    -   **Similarity Search:** Uses Pinecone to find top 3 matching embeddings.
    
9.  **Response Generation**
    
    -   **Data Retrieval:** Retrieves corresponding web page content based on matched embeddings.
    -   **OpenAI LLM:** Processes retrieved content and query, generates informative and comprehensive answer.
    

**Visual Diagram (Conceptual)**

[View on Eraser![](https://app.eraser.io/workspace/1XPo5y3hUOEtLZTNkvx4/preview)](https://app.eraser.io/workspace/1XPo5y3hUOEtLZTNkvx4)

**Key Considerations**

-   **Embedding Dimensionality:** Choose appropriate dimensionality for embeddings, balancing accuracy and storage/search efficiency.
-   **Similarity Metric:** Select a suitable similarity metric for Pinecone search (e.g., cosine similarity).
-   **Query Understanding:** Ensure the LLM can effectively understand and interpret user queries.
-   **Answer Generation:** Refine LLM prompts and parameters for generating accurate and relevant answers.