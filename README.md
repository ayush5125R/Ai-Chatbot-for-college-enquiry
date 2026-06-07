# Live Demo

https://ai-chatbot-for-college-enquiry-o254.onrender.com# 

#🎓 AI-Powered College Enquiry Chatbot Widget

 An interactive, responsive, and embeddable AI chatbot widget designed for university websites (configured for IILM University). The chatbot utilizes the **Google Gemini AI API** to answer queries regarding admissions, fees, courses, placements, and facilities in multiple languages (English, Hindi, and Hinglish).

It also features a robust **Offline Fallback Mode** to ensure the widget continues to answer common questions even if the API keys are blocked or connection limits are reached.

---

## 🌟 Features

- **Context-Aware AI Responses**: Powered by Gemini AI, utilizing custom institutional context injected dynamically from a context source file.
- **Multilingual Support**: Converses fluently in English, Hindi, and Hinglish (Hindi written in the Latin alphabet).
- **Responsive Embeddable Widget**: Designed with premium vanilla CSS featuring smooth animations, mobile responsiveness, and clean UI aesthetics.
- **Offline Resiliency**: Built-in fallback responses for admissions, placements, fees, and courses in case the external API is unreachable or rate-limited.
- **Node.js/Express Backend**: Clean API endpoints parsing messages and communicating securely with Google's generative AI models.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, and JavaScript with a responsive UI, smooth animations, and mobile-friendly design.
- **Backend**: Node.js, Express.js.
- **AI Engine**: Google Generative AI (`@google/generative-ai` SDK) utilizing `gemini-2.5-flash`.

---

## 🚀 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-chatbot-college-enquiry.git
cd ai-chatbot-college-enquiry
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (use `.env.example` as a reference):
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the application
Start the server in development mode:
```bash
npm run dev
```

The application will start on **`http://localhost:5000`**. Open this URL in your web browser to test the chatbot!

---

## 📂 Project Structure

```
├── public/
│   ├── index.html   # Main website/landing page simulation
│   ├── style.css    # Modern styling for the embeddable chat widget
│   └── widget.js    # Chatbot widget logic & backend API connection
├── .env.example     # Environment variable template
├── .gitignore       # Git exclusion list
├── context.txt      # College knowledge-base context injected into Gemini
├── server.js        # Node.js/Express API backend & Gemini API integration
└── package.json     # Node project configuration & dependencies
```

---

## 🔒 Security Best Practices
*The `.env` file containing your private `GEMINI_API_KEY` is excluded from GitHub using `.gitignore`. Make sure never to commit your real API key to public repositories.*
