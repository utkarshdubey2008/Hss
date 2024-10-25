const Groq = require('groq-sdk');

const groq = new Groq();
async function main() {
    const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
                "role": "user",
                "content": ""
            }
        ],
        "model": "llama3-8b-8192",
        "temperature": 1,
        "max_tokens": 1024,
        "top_p": 1,
        "stream": true,
        "stop": null
    });

    for await (const chunk of chatCompletion) {
        process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
}

main();

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
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
}

// Function to send user message to Groq API
async function sendMessage() {
    const message = userInput.value;
    if (!message) {
        console.log("No message entered."); // Log if input is empty
        return;
    }

    // Display user message and clear input
    addMessage(message, true);
    userInput.value = "";

    // Add loading indicator
    const loadingMessage = "Loading...";
    addMessage(loadingMessage, false);

    console.log("Sending message to Groq API:", message); // Log the message

    try {
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
                stream: false
            })
        });

        // Remove loading indicator
        const messages = document.querySelectorAll(".message");
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.innerText === loadingMessage) {
            lastMessage.remove();
        }

        // Check for valid response
        if (response.ok) {
            const data = await response.json();
            const botMessage = data.choices[0]?.message?.content || "No response from AI.";
            addMessage(botMessage, false);
        } else {
            const errorText = await response.text(); // Get the response text for detailed error information
            console.log("Error:", response.status, response.statusText, errorText);
            addMessage("Error: Unable to retrieve response from AI. " + errorText, false);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        addMessage("Error: Could not connect to API.", false);
    }
}

// Event listener for button click and 'Enter' key
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
