# PDF-Insights

PDF-Insights is an AI-powered web application that enables users to upload PDF documents and interact with them through natural language conversations. The system uses Retrieval-Augmented Generation (RAG) to provide accurate, context-aware answers grounded strictly in the document content.

It integrates modern AI infrastructure including Supabase for cloud storage, Pinecone for vector search, and GPT-4o-mini via OpenRouter for intelligent responses, orchestrated using FastAPI and LangGraph.

---

## Features

- Upload PDF documents to secure cloud storage
- Automatically extract and process document text
- Convert document content into vector embeddings
- Perform semantic search using Pinecone
- Chat with documents using natural language
- AI responses strictly based on document context
- Modern chat interface inspired by ChatGPT and Dia
- Fast, scalable, and production-ready backend

---

## How It Works

1. User uploads a PDF document
2. The file is stored in Supabase Storage
3. Text is extracted and split into smaller chunks
4. Each chunk is converted into vector embeddings
5. Embeddings are stored in Pinecone vector database
6. User asks a question
7. Relevant document chunks are retrieved
8. GPT-4o-mini generates a context-aware answer

---

## Architecture

Frontend  
- React  
- TailwindCSS  

Backend  
- FastAPI  
- LangGraph  

AI and Vector Layer  
- OpenRouter (GPT-4o-mini)  
- Sentence Transformers Embeddings  
- Pinecone Vector Database  

Cloud Storage  
- Supabase Storage  

---

## Core Capabilities

- Retrieval-Augmented Generation (RAG)
- Semantic document search
- Context-grounded AI responses
- Cloud-based document storage
- Scalable vector indexing
- Real-time conversational interface

---

## Use Cases

- Research paper analysis
- Academic assistance
- Resume review and analysis
- Legal document understanding
- Technical documentation assistant
- Personal knowledge base chatbot

---

## Technology Stack

Backend  
FastAPI  
LangGraph  

Frontend  
React  
TailwindCSS  

AI  
GPT-4o-mini (via OpenRouter)  
Sentence Transformers  

Infrastructure  
Supabase  
Pinecone  

---

## Deployment

The application is designed to be deployed using modern cloud platforms.

Backend  
Render or Railway  

Frontend  
Vercel or Netlify  

Cloud Services  
Supabase  
Pinecone  
OpenRouter  

---

## Author

Samir Sharma  

GitHub  
https://github.com/samir7837

---

## License

MIT License
