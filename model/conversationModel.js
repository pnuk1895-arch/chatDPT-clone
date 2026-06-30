const mongoose =require("mongoose")

const conversationSchema= new mongoose.Schema({
    title:String,
    messages:[
        {
            role:String,
            text:String
        }
    ]
})

const conversationClass= mongoose.model("conversationCollection", conversationSchema)

module.exports= conversationClass