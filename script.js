// Select elements
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// API Key and endpoint setup
const API_KEY = "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";
const API_URL = "https://api.groq.com/v1/chat/completions";

// Function to append messages to chat
function addMessage(content, isUser = false) {
    const message = document.createElement("div");
    message.classList.add("message", isUser ? "user" : "bot");
    message.innerText = content;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;  // Auto-scroll
}

// Function to send user message to Groq API
async function sendMessage() {
    const message = userInput.value;
    if (!message) return;

    // Display user message
    addMessage(message, true);
    userInput.value = "";

    // Request data
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: message }],
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            stream: false  // Streaming not supported in frontend fetch API
        })
    });

    // Check for a valid response
    if (response.ok) {
        const data = await response.json();
        const botMessage = data.choices[0].message.content;
        addMessage(botMessage, false);
    } else {
        addMessage("Error: Unable to retrieve response from AI.", false);
    }
}

// Event listener for button click and 'Enter' key
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
