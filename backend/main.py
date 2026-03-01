# main.py

import os
import shutil

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from rag import process_pdf, ask_question, upload_to_supabase


app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Upload endpoint
@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)


    # upload to supabase
    supabase_url = upload_to_supabase(file_path, file.filename)


    # store in pinecone
    process_pdf(file_path, supabase_url)


    return {

        "message": "Uploaded successfully",

        "supabase_url": supabase_url

    }



# Chat endpoint
@app.post("/chat")
async def chat(question: str = Form(...)):

    answer = ask_question(question)

    return {

        "answer": answer

    }