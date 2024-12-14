const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatbtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

let userMessage = null; // Variable to store user's message
const API_KEY = ""; // Paste API key her
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  console.log(`Creating chat li with message: ${message} and class: ${className}`);
  
  //Create a chat <li> element with passed message and class name
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi; // return chat <li> element
};

const generateResponse = (incomingChatli) => {
  console.log("Generating response...");
  
  // Generate a random response from the bot
  const API_URL = " https://api.groq.com/openai/v1/chat/completions";
  const messageElement = incomingChatli.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gemma-7b-it",
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  };

  console.log("Sending request to API with options: ", requestOptions);

  // Send POST request to API, get a response and set the response as paragraph text
  fetch(API_URL, requestOptions)
    .then((res) => {
      console.log("Received response: ", res);
      return res.json();
    })
    .then((data) => {
      console.log("API data: ", data);
      messageElement.textContent = data.choices[0].message.content.trim();
    })
    .catch((error) => {
      console.error("Error fetching API response: ", error);
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops Something went wrong. Please try again.";
    })
    .finally(() => {
      console.log("Scrolling chatbox to bottom");
      chatbox.scrollTo(0, chatbox.scrollHeight);
    });
};

const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
  console.log("User message: ", userMessage);
  if (!userMessage) return;

  // Clear the input textarea and set its height to default
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append the user's message to the chatbox
  const outgoingChatli = createChatLi(userMessage, "outgoing");
  chatbox.appendChild(outgoingChatli);
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    // Display "Typing..." message while waiting for the response
    const incomingChatli = createChatLi("Typing...", "incoming");
    chatbox.appendChild(incomingChatli);
    generateResponse(incomingChatli);
  }, 600);
};

chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea based on its content
  console.log("Adjusting textarea height");
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  // If Enter key is pressed without the Shift key and the window
  // width is greater than 800px, handle the chat
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatbtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => {
  console.log("Closing chatbot");
  document.body.classList.remove("show-chatbot");
});
chatbotToggler.addEventListener("click", () => {
  console.log("Toggling chatbot visibility");
  document.body.classList.toggle("show-chatbot");
});
