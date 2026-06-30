const express = require("express")

const userRoutes=require("./routes/userRoutes")
const mongoose= require("mongoose")

const app=express()

const dotenv= require("dotenv")
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"))
// middleware was registered here it wil excute when user send the request to the route 
app.use(userRoutes)


async function mongoDB()
{   
    try {
        await mongoose.connect(process.env.mongo_URL)
        
        console.log("mongoDB connected successfully")
    
        const port=process.env.PORT || 4000
        app.listen(port,()=>{
            console.log(`server is listening at ${port}`)
        })

    } catch (error) {
        console.log("error while connect to mongoDB", error )
    }
    
}
mongoDB()


