import streamlit as st
from streamlit_chat import message
import sys
import os


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'html')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))



from util.embeddins import create_vectorstore, create_conversation_chain
from util.file import create_text_chunks, process_files
from util.template import bot_template,user_template

img_logo_path = os.path.abspath('./img/Eurofarma_logo.png')
img_bot_path = os.path.abspath('./img/chatbot_img.png')

# from dotenv import load_dotenv
# load_dotenv()

openai_api_key = st.secrets['OPENAI_API_KEY']

if openai_api_key is None:
    print("openai_api_key não encontrado no arquivo .env")
else:
    print(f"Token da API carregado com sucesso: {openai_api_key[:5]}...")

def main():
    
    st.set_page_config(page_title='EuroFarma - ChatBot', page_icon=':books:')

    st.markdown(
        '''
        <style>
            [data-testid="stSidebar"] {
            background-color: #FFF253;
            color: black;
            padding: 20px;
            }

            
            [data-testid="stSidebar"] .sidebar-title-container {
              display: flex;
              align-items: center;
              margin-bottom: 20px;
            }

            [data-testid="stSidebar"] .sidebar-title-container img {
              width: 90px;
              height: auto;
              margin-right: 20px;
            }

            [data-testid="stSidebar"] .sidebar-title-container h1 {
              font-family: 'Open Sans', sans-serif;
              font-size: 24px;
              margin: 0;
            }
            
            .chat-message {
            padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1rem; display: flex
            }
            .chat-message.user {
                background-color: #09378e
            }
            .chat-message.bot {
                background-color: #748ab6
            }
            .chat-message .avatar {
            width: 10%;
            }
            .chat-message .avatar img {
            max-width: 100px;
            max-height: 100px;
            border-radius: 50%;
            object-fit: cover;
            }
            .chat-message .message {
            width: 70%;
            padding: 0 4rem;
            color: #fff;
            }
            
            .custom-button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                font-weight: bold;
                color: #fff;
                background-color: #09378e;
                border: none;
                border-radius: 5px;
                text-align: center;
                cursor: pointer;
                text-decoration: none;
                transition: background-color 0.3s ease;
            }

            .custom-button:hover {
                background-color: #063287;
            }
            
            
        </style>
        ''',
        unsafe_allow_html=True
    )

    st.subheader('Bem vindo ao ChatBot da Eurofarma!', divider='gray')
    user_question = st.text_input('Inicie nossa conversa :)')

    if 'conversation' not in st.session_state:
        st.session_state.conversation = None

    if user_question:
        if st.session_state.conversation is None:
            st.write("Por favor, carregue um documento primeiro.")
        else:
            response = st.session_state.conversation({'question': user_question})
            chat_history = response['chat_history']

            for i, text in enumerate(chat_history):
                if i % 2 == 0:
                    st.markdown(user_template.replace('{{MSG}}', text.content), unsafe_allow_html=True)
                else:
                    st.markdown(bot_template.replace('{{MSG}}', text.content), unsafe_allow_html=True)

    with st.sidebar:
        st.image(img_logo_path, width=240)
        pdf_docs = st.file_uploader('Área de upload de documentos', accept_multiple_files=True)

        if pdf_docs:
            st.write('Arquivos carregados com sucesso')

        if st.button('Upload',type="secondary"):
            if pdf_docs:
                all_files_text = process_files(pdf_docs)
                chunks = create_text_chunks(all_files_text)

                vectorstore = create_vectorstore(chunks)

                st.session_state.conversation = create_conversation_chain(vectorstore)
            else:
                st.write("Por favor, carregue um documento primeiro.")

if __name__ == '__main__':
    main()
