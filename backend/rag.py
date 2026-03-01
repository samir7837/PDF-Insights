# rag.py

import os
import uuid
import requests

from typing import TypedDict

from dotenv import load_dotenv

# =========================
# LOAD ENV
# =========================

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX = os.getenv("PINECONE_INDEX")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET")


# =========================
# SUPABASE CLIENT
# =========================

from supabase import create_client

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_KEY
)


# =========================
# PINECONE CLIENT
# =========================

from pinecone import Pinecone

pc = Pinecone(api_key=PINECONE_API_KEY)

index = pc.Index(PINECONE_INDEX)


# =========================
# EMBEDDINGS
# =========================

from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-mpnet-base-v2"
)


# =========================
# VECTOR STORE
# =========================

from langchain_pinecone import PineconeVectorStore

vectorstore = PineconeVectorStore(
    index=index,
    embedding=embeddings,
    text_key="text"
)


# =========================
# DOCUMENT LOADER
# =========================

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter


# =========================
# LANGGRAPH STATE
# =========================

class GraphState(TypedDict):

    question: str
    context: str
    answer: str


# =========================
# UPLOAD TO SUPABASE
# =========================

def upload_to_supabase(file_path, filename):

    unique_name = f"{uuid.uuid4()}_{filename}"

    with open(file_path, "rb") as f:

        supabase.storage.from_(SUPABASE_BUCKET).upload(
            unique_name,
            f
        )

    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET}/{unique_name}"

    print("Supabase URL:", public_url)

    return public_url


# =========================
# PROCESS PDF → PINECONE
# =========================

def process_pdf(file_path, supabase_url):

    loader = PyPDFLoader(file_path)

    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    chunks = splitter.split_documents(docs)

    texts = []
    metadatas = []

    for chunk in chunks:

        texts.append(chunk.page_content)

        metadatas.append({
            "text": chunk.page_content,
            "source": supabase_url
        })

    vectorstore.add_texts(
        texts=texts,
        metadatas=metadatas
    )

    print("Stored in Pinecone")


# =========================
# LANGGRAPH RETRIEVE STEP
# =========================

def retrieve(state: GraphState):

    question = state["question"]

    docs = vectorstore.similarity_search(
        question,
        k=4
    )

    context = "\n".join(
        doc.page_content for doc in docs
    )

    return {
        "context": context,
        "question": question
    }


# =========================
# OPENROUTER GPT-4O-MINI
# =========================

def query_openrouter(context, question):

    response = requests.post(

        url="https://openrouter.ai/api/v1/chat/completions",

        headers={

            "Authorization": f"Bearer {OPENROUTER_API_KEY}",

            "Content-Type": "application/json",

            "HTTP-Referer": "http://localhost:8000",

            "X-Title": "PDFInsights"

        },

        json={

            # GPT-4o-mini via OpenRouter
            "model": "openai/gpt-4o-mini",

            "messages": [

                {
                    "role": "system",
                    "content": "You are a helpful assistant. Answer ONLY using the provided context."
                },

                {
                    "role": "user",
                    "content": f"""
Context:
{context}

Question:
{question}
"""
                }

            ]

        }

    )

    data = response.json()

    print("OpenRouter Response:", data)

    if "choices" not in data:

        return f"Error from OpenRouter: {data}"

    return data["choices"][0]["message"]["content"]


# =========================
# LANGGRAPH GENERATE STEP
# =========================

def generate(state: GraphState):

    answer = query_openrouter(
        state["context"],
        state["question"]
    )

    return {
        "answer": answer
    }


# =========================
# BUILD LANGGRAPH
# =========================

from langgraph.graph import StateGraph, END

workflow = StateGraph(GraphState)

workflow.add_node("retrieve", retrieve)

workflow.add_node("generate", generate)

workflow.set_entry_point("retrieve")

workflow.add_edge("retrieve", "generate")

workflow.add_edge("generate", END)

app_graph = workflow.compile()


# =========================
# MAIN ASK FUNCTION
# =========================

def ask_question(question):

    result = app_graph.invoke(
        {
            "question": question
        }
    )

    return result["answer"]