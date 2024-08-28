from langchain_community.vectorstores import FAISS
from langchain_community.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_openai import OpenAIEmbeddings

def create_vectorstore(chunks):
    if not isinstance(chunks, list) or not all(isinstance(chunk, str) for chunk in chunks):
        raise ValueError("`chunks` deve ser uma lista de strings")
   
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_texts(texts=chunks, embedding=embeddings)
    
    return vectorstore

def create_conversation_chain(vectorstore):
    llm = ChatOpenAI()
    
    memory = ConversationBufferMemory(memory_key='chat_history', return_messages=True)
    
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory
    )
    
    return conversation_chain
