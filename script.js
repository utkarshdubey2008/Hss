// Function to send user message to Groq API
async function sendMessage() {
    const message = userInput.value;
    if (!message) {
        console.log("No message entered.");
        return;
    }

    // Display user message and clear input
    addMessage(message, true);
    userInput.value = "";

    // Add loading indicator
    const loadingMessage = "Loading...";
    addMessage(loadingMessage, false);

    console.log("Sending message to Groq API:", message);

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
            console.log("Error:", response.status, response.statusText);
            addMessage("Error: Unable to retrieve response from AI.", false);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        addMessage("Error: Could not connect to API.", false);
    }
}
