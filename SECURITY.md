# Security Policy

## API Key Security (Critical)

This application is a **client-side only** web application. This means that all code, including the logic to call the Google Gemini API, runs directly in the user's browser.

### ⚠️ Risk: API Key Exposure
Because the application runs in the browser, your `GEMINI_API_KEY` must be sent to the client. **This means your API key is visible to anyone who inspects the network traffic or the application code.**

### 🛡️ Mitigation: Restrict Your Key
To prevent unauthorized usage of your API key, you **MUST** restrict it in the Google AI Studio console.

1.  Go to [Google AI Studio API Keys](https://aistudiocdn.com/app/apikey).
2.  Look for the **Project** column next to your key (it often starts with `gen-lang-client...`).
3.  **Click the project name link.** This will open the Google Cloud Console for that specific project.
4.  In the Google Cloud Console, click on the name of your API Key (or the pencil icon) to edit it.
5.  Under **Application restrictions**, select **Websites**.
6.  Add your GitHub Pages URL:
    *   `https://greg-hahn.github.io/*`
    *   `http://localhost:3000/*` (for local development)
7.  Click **Save**.

By doing this, Google will reject any requests using your key that don't come from your specific website.

## Reporting Vulnerabilities

If you discover a security vulnerability within this project, please open an issue on GitHub.
