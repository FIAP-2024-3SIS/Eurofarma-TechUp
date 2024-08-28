import streamlit as st
from streamlit_chat import message
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
img_logo_path = os.path.abspath('./img/topomenu_img.png')
img_bot_path = os.path.abspath('./img/chatbot_img.png')


from util.embeddins import create_vectorstore, create_conversation_chain
from util.file import create_text_chunks, process_files


from dotenv import load_dotenv
load_dotenv()

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

            /* Container para imagem e título */
            [data-testid="stSidebar"] .sidebar-title-container {
              display: flex;
              align-items: center;
              margin-bottom: 20px;
            }

            [data-testid="stSidebar"] .sidebar-title-container img {
              width: 70px;
              height: auto;
              margin-right: 40px;
            }

            [data-testid="stSidebar"] .sidebar-title-container h1 {
              font-family: 'Open Sans', sans-serif;
              font-size: 24px;
              margin: 0;
            }

             [data-testid="stSidebar"] .sidebar-title-container h {
              font-family: 'Open Sans', sans-serif;
              font-size: 24px;
              margin: 0;
            }
        </style>
        ''',
        unsafe_allow_html=True
    )

    st.image(img_bot_path, width=20)
    st.subheader('ChatBot Eurofarma', divider='gray')
    user_question = st.text_input('Faça uma pergunta para mim')

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
                    message(text.content, is_user=True, key=str(i) + '_user')
                else:
                    message(text.content, is_user=False, key=str(i) + '_bot')

    with st.sidebar:
        st.image(img_logo_path, width=40)
        pdf_docs = st.file_uploader('Faça o upload do seu documento', accept_multiple_files=True)

        if pdf_docs:
            st.write('Arquivos carregados com sucesso')

        if st.button('Upload'):
            if pdf_docs:
                all_files_text = process_files(pdf_docs)
                chunks = create_text_chunks(all_files_text)

                vectorstore = create_vectorstore(chunks)

                st.session_state.conversation = create_conversation_chain(vectorstore)
            else:
                st.write("Por favor, carregue um documento primeiro.")

if __name__ == '__main__':
    main()
