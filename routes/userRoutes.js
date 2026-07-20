const express = require("express")
const { homePage,
        callToLLM,
        callToMongoDB,
        getAllConversationObj,
        deleteDocumentObj
    } = require("../controller/userController")

const userRoutes = express.Router()

userRoutes.get("/", homePage)

userRoutes.post("/chat", callToLLM)

userRoutes.post("/chatDocument", callToMongoDB)

userRoutes.get("/getAllConversation", getAllConversationObj)

userRoutes.delete("/DeleteDocument", deleteDocumentObj)

module.exports = userRoutes