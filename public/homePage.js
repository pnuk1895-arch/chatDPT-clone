'use strict';


const input = document.getElementById("message-input");//const inputEl = document.getElementById('message-input');
const sendBtn = document.getElementById("send-btn");//const sendBtn = document.getElementById('send-btn');
const inputArea = document.querySelector(".input-area");
const welcomeScreen = document.querySelector(".welcome-screen");// const welcomeEl = document.getElementById('welcomeScreen');
const historyBox = document.querySelector(".historyBox");
const newChatBtn = document.querySelector("#new-chat-btn");
const chatMessages = document.querySelector("#messages");// const messagesEl = document.getElementById('messages');
const sidebar = document.getElementById('sidebar');
const backdrop = document.getElementById('sidebarBackdrop');
const openBtn = document.getElementById('openSidebar');
const closeBtn = document.getElementById('closeSidebar');
const chatTitle = document.getElementById('chatTitle');



let currentConversationId = null;

openBtn.addEventListener('click', toggleSidebar);
closeBtn.addEventListener('click', closeSidebar);
backdrop.addEventListener('click', closeSidebar);

window.addEventListener("DOMContentLoaded", (e) => {
    loadConversations(e)
})

sendBtn.addEventListener("click", sendMessage);

newChatBtn.addEventListener("click", addNewChat)

input.addEventListener("keydown", (e) => {


    if (e.key === "Enter") {
        sendMessage();
    }


});

// =======================
// Send Message
// =======================

async function sendMessage() {

    inputArea.style.bottom = "20px"

    welcomeScreen.style.display = "none"

    let isNewConversation = currentConversationId === null;

    // getting user input or prompt
    const text = input.value.trim();

    if (text === "") return;

    // show user prompt
    showMessage(text, "user");

    input.value = "";
    input.focus();

    // show typing indicator
    showTyping();

    try {

        // make API call to backend
        const response = await fetch("/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                prompt: text,
                conversationId: currentConversationId
            })
        });

        if (!response.ok) {
            throw new Error(data.result || "something went wrong")
        }

        const data = await response.json();

        currentConversationId = data.conversationId;


        if (isNewConversation) {

            createChatElement(data.conversationId, text)

            //    activeChat(data.conversationId)

        }
        hideTyping();

        // show AI response
        showMessage(data.result, "AI");
    }
    catch (error) {

        console.log(error);
        if (error.result) {
            alert("wait or restart the page")
        }

        hideTyping();

    }

}

function createChatElement(ID, TEXT) {

    const historyChatBox = document.createElement("div")

    historyChatBox.dataset.id = ID

    historyChatBox.classList.add("chatHistoryBox")

    historyChatBox.innerText = TEXT.substring(0, 30)

    historyBox.prepend(historyChatBox)

    historyChatBox.addEventListener("click", (e) => {
        allChatOfOneWindow(e.currentTarget.dataset.id)
    })
}

// =======================
// Add Message To UI
// =======================

function showMessage(text, role) {


    const message = document.createElement("div");

    message.classList.add(
        "message",
        role
    );

    const avatar =
        role === "user"
            ? "👤"
            : "🤖";

    message.innerHTML = `
    <div class="avatar">
        ${avatar}
    </div>

    <div class="message-content">
        ${text}
    </div>
`;

    chatMessages.appendChild(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;

}

// ----- show typing indicator -----
let typingEl = null;

function showTyping() {
    if (typingEl) return;
    typingEl = document.createElement('div');
    typingEl.className = 'typing-indicator';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
function hideTyping() {
    if (typingEl) {
        typingEl.remove();
        typingEl = null;
    }
}

let currentChatId = null;

async function allChatOfOneWindow(id) {

    console.log(id, "id")

    // If same chat is clicked again, do nothing
    if (currentChatId === id) {
        return;
    }

    // Save the new chat id
    currentChatId = id;

    welcomeScreen.style.display = "none"

    inputArea.style.bottom = "0px"

    messages.innerHTML = ""

    try {

        const chatDocumentresponse = await fetch("/chatDocument",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id
                })
            }
        )

        const chatDocumentData = await chatDocumentresponse.json()

        if (!chatDocumentresponse.ok) {
            throw new Error(data.messages || "something went wrong")
        }

        chatDocumentData.messages.forEach(msg => {
            showMessage(msg.text, msg.role)
        });
    } catch (error) {
        if (error.messages)
            alert("page was not loaded")
    }
}

function addNewChat() {

    welcomeScreen.style.display = ""

    inputArea.style.removeProperty("bottom")

    input.value = ""

    chatMessages.innerHTML = ""

    currentChatId = null

    currentConversationId = null

}

async function loadConversations(e) {
    try {
        const allObjs = await fetch("/getAllConversation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!allObjs.ok) {
            throw new Error(data.message || "something went wrong")
        }

        const dataAllObjs = await allObjs.json()

        let dataArr = dataAllObjs.allObj

        dataArr.forEach(Objs => {
            let id = Objs._id
            let title = Objs.title

            createChatElement(id, title)

        })

    } catch (error) {
        if (error.message) {
            alert("wait and open webpage again")
        }
    }

}

let isSidebarOpen = false;

function openSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('open');
    isSidebarOpen = true;
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
    isSidebarOpen = false;
    document.body.style.overflow = '';
}

function toggleSidebar() {
    if (isSidebarOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

// ----- detect mobile -----
function checkMobile() {
    isMobile = window.innerWidth <= 768;
    // if desktop, ensure sidebar is visible and backdrop hidden
    if (!isMobile) {
        sidebar.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
        isSidebarOpen = false;
    }
}