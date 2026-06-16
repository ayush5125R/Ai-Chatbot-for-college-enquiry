const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize GroqCloud client
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

// Read the prompt context once at startup
let systemPrompt = "You are a helpful assistant.";
try {
  systemPrompt = fs.readFileSync(path.join(__dirname, 'context.txt'), 'utf8');
  console.log("Loaded context knowledge successfully.");
} catch (error) {
  console.error("Failed to read context.txt", error);
}

// Chat API Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
       return res.status(500).json({ error: "Please configure your GROQ_API_KEY in the .env file" });
    }

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: systemPrompt
              },
              {
                role: "user",
                content: message
              }
            ],
            temperature: 0.2,
        });

        res.json({ reply: response.choices[0].message.content });
    } catch(apiError) {
        // --- OFFLINE FALLBACK MODE ---
        // If Groq API is temporarily unavailable
        console.warn("API Error, falling back to offline mode:", apiError.message);
        
        const m = message.toLowerCase();
        let fallback = "The AI service is temporarily unavailable. I can still answer common questions about admissions, courses, fees, placements, and campus facilities using my built-in knowledge base. ";
        
        if (m.includes('admission') || m.includes('process')) {
            fallback += "But based on my data: The admission process at IILM involves online registration, application form submission with SOP, documentation upload, and a personal interview based on merit.";
        } else if (m.includes('fee') || m.includes('cost')) {
            fallback += "Regarding fees: The exact fee structure varies by course and campus. Please refer to the 'Fee & Scholarship' section on the official IILM website.";
        } else if (m.includes('course') || m.includes('program') || m.includes('btech') || m.includes('mba')) {
            fallback += "IILM offers Management (MBA, BBA), Engineering & Computer Science (B.Tech, M.Tech, MCA), Law (BA LLB, LLM), and Liberal Arts programs.";
        } else if (m.includes('placement') || m.includes('job') || m.includes('package')) {
            fallback += "IILM has an active placement cell. Top recruiters include KPMG, BlackRock, Gartner, and Deloitte.";
        } else {
            fallback += "IILM University has campuses in Gurugram and Greater Noida with modern facilities including smart classrooms and sports complexes. How else can I help?"
        }
        res.json({ reply: fallback });
    }
  } catch (error) {
    console.error("Error communicating with Groq API:", error);
    res.status(500).json({ error: "Sorry, I am facing some technical issues connecting to the server. Please try again later." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
