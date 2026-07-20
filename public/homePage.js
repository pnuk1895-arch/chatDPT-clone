
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const inputArea = document.querySelector(".input-area");
const welcomeScreen = document.querySelector("#welcomeScreen");
const historyBox = document.querySelector(".historyBox");
const newChatBtn = document.querySelector("#new-chat-btn");
const chatMessages = document.querySelector("#messages");
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




        if (isNewConversation) {
            currentConversationId = data.conversationId;

            createChatElement(data.conversationId, text)

            activeChat(data.conversationId)

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

    const threeDotHistory = document.createElement("span")
    threeDotHistory.classList.add("threeDotHistory")
    threeDotHistory.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19"
                                fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                <path
                                    d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                            </svg>`

    historyBox.append(historyChatBox)
    historyChatBox.append(threeDotHistory)

    historyChatBox.addEventListener("click", (e) => {
        e.stopPropagation();
        let chatID = e.currentTarget.dataset.id
        allChatOfOneWindow(chatID)
        activeChat(chatID)
    })

    //delete button
    const Delete = document.createElement("span")
    Delete.dataset.id = ID
    Delete.classList.add("delete")
    Delete.innerText = "Delete"

    let show = false

    threeDotHistory.addEventListener("click", (e) => {
        e.stopPropagation();

        if (show) {
            Delete.remove()
            show = false
            console.log(false)
        }
        else {

            historyChatBox.append(Delete)
            show = true
            console.log(true)
        }
    })


    Delete.addEventListener("click", (e) => {
        e.stopPropagation();
        let id = e.target.dataset.id // id of the element that i want to delete
        deleteChat(id)//function to deletedocument form database

        Array.from(historyBox.children).forEach((child) => {
            if (child.dataset.id === id) {
                child.remove()
                if (child.classList.contains("active")) {
                    chatMessages.innerText = ""
                    return;
                }
                return;
            }
        })
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


    chatMessages.innerHTML = ""

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

    input.value = "";

    chatMessages.innerHTML = "";

    currentChatId = null;
    currentConversationId = null;

    // Show welcome screen again
    welcomeScreen.style.display = "flex";

}

let activeID = ""

function activeChat(ID) {

    if (activeID == ID) return;

    document.querySelector(".active")?.classList.remove("active")

    document.querySelector(`[data-id="${ID}"]`).classList.add("active")

    activeID = ID

    localStorage.setItem("activeChatId", ID);
}

async function loadConversations() {
    try {
        const allObjs = await fetch("/getAllConversation");

        const dataAllObjs = await allObjs.json();

        if (!allObjs.ok) {
            throw new Error(dataAllObjs.message || "Something went wrong");
        }

        dataAllObjs.allObj.forEach(obj => {
            createChatElement(obj._id, obj.title);
        });

        // AFTER creating the elements
        const savedId = localStorage.getItem("activeChatId");

        if (savedId) {
            activeChat(savedId);
            await allChatOfOneWindow(savedId);
        }

    } catch (error) {
        console.error(error);
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

window.visualViewport?.addEventListener("resize", updatePosition);
window.visualViewport?.addEventListener("scroll", updatePosition);


function updatePosition() {
    if (window.visualViewport) {
        const keyboardHeight =
            window.innerHeight - window.visualViewport.height;

        inputArea.style.bottom = `${keyboardHeight}px`;
    }
}

async function deleteChat(ID) {


    let response = await fetch("http://localhost:4000/DeleteDocument", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            {
                ID: ID
            }
        )
    })

    const data = await response.json()

}

