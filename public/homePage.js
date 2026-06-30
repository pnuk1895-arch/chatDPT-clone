const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const inputArea = document.querySelector(".input-area")
const welcomeScreen = document.querySelector(".welcome-screen")
const historyBox = document.querySelector(".historyBox")
const newChatBtn = document.querySelector("#new-chat-btn")
const chatMessages =document.querySelector("#messages")

let currentConversationId = null;
//  console.log(currentConversationId)
// =======================
// Event Listeners
// =======================

window.addEventListener("DOMContentLoaded",(e)=>{
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

    inputArea.style.position = "static"

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
    showTypingIndicator();

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

        if(!response.ok)
        {
            throw new Error(data.result || "something went wrong")
        }

        const data = await response.json();

        currentConversationId = data.conversationId;

        
        if (isNewConversation) {

           createChatElement(data.conversationId, text)

        }
            removeTypingIndicator();

            // show AI response
            showMessage(data.result, "AI");
    }
    catch (error) {

        console.log(error);
        if(error.result)
        {
            alert("wait or restart the page")
        }
        
        removeTypingIndicator();

    }

}

function createChatElement(ID,TEXT){

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

// =======================
// Typing Indicator
// =======================

function showTypingIndicator() {

    const typing = document.createElement("div");

    typing.classList.add(
        "message",
        "ai"
    );

    typing.id = "typing-indicator";

    typing.innerHTML = `
    <div class="avatar">
        🤖
    </div>

    <div class="message-content">
        Typing...
    </div>
`;

    chatMessages.appendChild(typing);

    chatMessages.scrollTop = chatMessages.scrollHeight;


}

function removeTypingIndicator() {


    const typing =
        document.getElementById(
            "typing-indicator"
        );

    if(typing) {
        typing.remove();
    }

}

let currentChatId = null;

async function allChatOfOneWindow(id) {

    console.log(id,"id")

    // If same chat is clicked again, do nothing
    if (currentChatId === id) {
        return;
    }

    // Save the new chat id
    currentChatId = id;

    welcomeScreen.style.display="none"

    inputArea.style.position="static"

    messages.innerHTML=""

    try{

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
  
    if(!chatDocumentresponse.ok)
    {
        throw new Error( data.messages || "something went wrong" )
    }

    chatDocumentData.messages.forEach(msg => {
       showMessage(msg.text, msg.role)
    });
    }catch(error){
        if(error.messages)
        alert("page was not loaded")
    }
}

function addNewChat() {

    welcomeScreen.style.display = ""

    inputArea.style.position = "absolute"

    chatMessages.innerHTML=""

    currentChatId=null

    currentConversationId=null

}

async function loadConversations(e)
{
    try{
        const allObjs= await fetch("/getAllConversation",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                }
            })

            if(!allObjs.ok)
            {
                throw new Error(data.message || "something went wrong")
            }

        const dataAllObjs= await allObjs.json()

        let dataArr=dataAllObjs.allObj

        dataArr.forEach( Objs=>{
            let id=Objs._id
            let title=Objs.title

            createChatElement(id,title)
                                    
        })  
        
    }catch(error){
        if(error.message)
        {
            alert("wait and open webpage again")
        }
    }
   
}


