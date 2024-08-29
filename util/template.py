css = '''
<style>
.chat-message {
    padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1rem; display: flex
}
.chat-message.user {
    background-color: #2b313e
}
.chat-message.bot {
    background-color: #475063
}
.chat-message .avatar {
  width: 20%;
}
.chat-message .avatar img {
  max-width: 78px;
  max-height: 78px;
  border-radius: 50%;
  object-fit: cover;
}
.chat-message .message {
  width: 80%;
  padding: 0 1.5rem;
  color: #fff;
}
'''

bot_template = '''
        <div class="chat-message bot">
            <div class="avatar">
                <img src="https://baixardesign.com.br/fileupload/box/1334751839293/Avatar%203D%20Mulher%20Estilo%20professora%20PNG6.png" >
            </div>
            <div class="message">{{MSG}}</div>
        </div>
'''

user_template = '''
<div class="chat-message user">
    <div class="avatar">
        <img src="https://as1.ftcdn.net/v2/jpg/05/99/32/28/1000_F_599322870_hufBazDahX69a57xhcprgfn4WSjAlXZj.jpg">
    </div>    
    <div class="message">{{MSG}}</div>
</div>
'''