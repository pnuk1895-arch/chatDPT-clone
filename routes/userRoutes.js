const express=require("express")
const { homePage, callToLLM, callToMongoDB, getAllConversationObj}=require("../controller/userController")

const userRoutes=express.Router()

userRoutes.get("/",homePage)

userRoutes.post("/chat",callToLLM)

userRoutes.post("/chatDocument",callToMongoDB)

userRoutes.post("/getAllConversation", getAllConversationObj)

module.exports=userRoutes