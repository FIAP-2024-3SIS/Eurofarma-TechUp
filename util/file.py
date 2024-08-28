from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
import io

def process_files(files):
    text = ""

    for file in files:
        try:
            pdf = PdfReader(file) 
            for page in pdf.pages:
                text += page.extract_text()
                
        except Exception as e:
            print(f"Erro ao processar o arquivo: {e}")

    return text

def create_text_chunks(text): 
    text_splitter = CharacterTextSplitter(
        separator='\n',
        chunk_size=1500,
        chunk_overlap=300,
        length_function=len
    )
    
    chunks = text_splitter.split_text(text)
    
    return chunks
