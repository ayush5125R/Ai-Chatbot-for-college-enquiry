// Chatbot Widget logic designed to be embeddable anywhere
const IILMChatWidget = {
    backendUrl: '', // Will be set via init
    isOpen: false,
    
    init(backendUrl) {
        this.backendUrl = backendUrl;
        this.injectHTML();
        this.bindEvents();
        this.addWelcomeMessage();
    },

    injectHTML() {
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'iilm-chat-widget';

        widgetContainer.innerHTML = `
            <div class="iilm-chat-window" id="iilmChatWindow">
                <div class="iilm-chat-header">
                    <div class="iilm-header-info">
                        <div class="iilm-logo-placeholder">IILM</div>
                        <div class="iilm-title-container">
                            <span class="title">IILM Assistant</span>
                            <span class="subtitle">Ask me anything!</span>
                        </div>
                    </div>
                    <button class="iilm-close-btn" id="iilmCloseBtn">&times;</button>
                </div>
                <div class="iilm-chat-body" id="iilmChatBody">
                    <!-- Messages go here -->
                    <div class="iilm-typing-indicator" id="iilmTyping">
                        <span></span><span></span><span></span>
                    </div>
                </div>
                <div class="iilm-chat-input-area">
                    <input type="text" id="iilmChatInput" placeholder="Type your question..." autocomplete="off">
                    <button id="iilmSendBtn">
                        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                    </button>
                </div>
            </div>
            <button class="iilm-chat-btn" id="iilmChatBtn">
                <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
            </button>
        `;
        document.body.appendChild(widgetContainer);
    },

    bindEvents() {
        const chatBtn = document.getElementById('iilmChatBtn');
        const closeBtn = document.getElementById('iilmCloseBtn');
        const sendBtn = document.getElementById('iilmSendBtn');
        const inputField = document.getElementById('iilmChatInput');

        chatBtn.addEventListener('click', () => this.toggleWindow());
        closeBtn.addEventListener('click', () => this.toggleWindow());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    },

    toggleWindow() {
        const chatWindow = document.getElementById('iilmChatWindow');
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            chatWindow.classList.add('open');
            document.getElementById('iilmChatInput').focus();
        } else {
            chatWindow.classList.remove('open');
        }
    },

    addMessage(text, sender) {
        const chatBody = document.getElementById('iilmChatBody');
        const typingIndicator = document.getElementById('iilmTyping');
        const msgDiv = document.createElement('div');
        msgDiv.className = `iilm-message ${sender}`;
        
        // Convert basic markdown/newlines to HTML
        const htmlText = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        msgDiv.innerHTML = htmlText;

        chatBody.insertBefore(msgDiv, typingIndicator);
        this.scrollToBottom();
    },

    addWelcomeMessage() {
        setTimeout(() => {
            if (document.querySelectorAll('.iilm-message.bot').length === 0) {
                 this.addMessage("Hello! 👋 I'm the IILM University AI Assistant. You can ask me about admissions, courses, fees, or placements in English, Hindi, or Hinglish. How can I help you today?", 'bot');
            }
        }, 1000);
    },

    showTyping() {
        const typingIndicator = document.getElementById('iilmTyping');
        typingIndicator.style.display = 'block';
        this.scrollToBottom();
    },

    hideTyping() {
        const typingIndicator = document.getElementById('iilmTyping');
        typingIndicator.style.display = 'none';
        this.scrollToBottom();
    },

    scrollToBottom() {
        const chatBody = document.getElementById('iilmChatBody');
        chatBody.scrollTop = chatBody.scrollHeight;
    },

    async sendMessage() {
        const inputField = document.getElementById('iilmChatInput');
        const message = inputField.value.trim();
        
        if (!message) return;

        // Display user message
        this.addMessage(message, 'user');
        inputField.value = '';
        this.showTyping();

        try {
            const response = await fetch(`${this.backendUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            
            this.hideTyping();
            
            if (response.ok) {
                this.addMessage(data.reply, 'bot');
            } else {
                this.addMessage(data.error || "Something went wrong.", 'bot');
            }
        } catch (error) {
            console.error("Chat error:", error);
            this.hideTyping();
            this.addMessage("Unable to connect to the server. Please ensure the backend is running.", 'bot');
        }
    }
};
