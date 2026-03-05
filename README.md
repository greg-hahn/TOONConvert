# 🎭 TOONConvert

**TOONConvert** is a high-performance, AI-powered data conversion engine designed to optimize data exchange for Large Language Models (LLMs). It specializes in converting standard formats like **JSON** and **CSV** into **TOON (Token-Oriented Object Notation)**—a compact, token-efficient format that can reduce LLM API costs by 30-60%.

![TOONConvert Preview](https://picsum.photos/seed/toonconvert/1200/600)

## 🚀 Features

- **Multi-Format Conversion**: Seamlessly transform data between JSON, CSV, and TOON Code.
- **LLM Optimization**: Reduce token usage and improve parsing accuracy for models like Gemini, GPT-4, and Claude.
- **Real-Time Streaming**: Watch your data convert in real-time using Gemini 2.5 Flash.
- **Token Estimation**: Instant ROI calculation with estimated token counts for major AI providers.
- **Security Hardened**: Built-in XSS protection via DOMPurify and prompt injection guardrails.
- **Responsive Design**: A beautiful, dark-mode "mission control" interface built with Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Engine**: Google Gemini API (@google/genai)
- **Security**: DOMPurify for safe HTML rendering
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/toonconvert.git
   cd toonconvert
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛡️ Security Note

This application has been hardened against common web vulnerabilities:
- **XSS Protection**: All syntax-highlighted output is sanitized using DOMPurify.
- **Prompt Security**: Conversion prompts include strict guardrails to prevent instruction leakage and prompt injection.
- **Privacy**: A clear privacy notice is provided to prevent accidental submission of sensitive PII.

## 📄 License

MIT © [Your Name/Organization]
