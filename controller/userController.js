const path = require("path")
const conversationModel = require("../model/conversationModel")


function homePage(req, res) {

    const homePath = path.join(__dirname, "../public/homePage.html")

    res.sendFile(homePath,(error) => {
    
        if (error) {
        
            console.log("error while sending home page", error)
        
        }
        else {
        
               console.log("home page has been send")
        
        }
    })
}

async function callToLLM(req, res) {

    const { prompt, conversationId } = req.body

    let conversationObj;

    try {
        if (!conversationId) {
            conversationObj = new conversationModel(
                {
                    title: prompt,
                    messages: [
                        {
                            role: "user",
                            text: prompt
                        }
                    ]
                }
            )
            await conversationObj.save()
        }
        else {
            conversationObj = await conversationModel.findById(conversationId)

            if (!conversationObj) {
                return res.status(400).json({
                    success: false,
                    message: "Connection down.Try again"
                })
            }

            conversationObj.messages.push(
                {
                    role: "user",
                    text: prompt
                }
            )
        }

        const model = process.env.MODEL
        const Apikey = process.env.API_KEY
        const URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${Apikey}`


        const responseLLM = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 60, // Strictly limits the output to ~60 tokens
                    temperature: 0.7
                }
            })
        })

        const data = await responseLLM.json()

        const result = data.candidates?.[0].content.parts?.[0].text || "no response found"

        // console.log("result",result)

        conversationObj.messages.push({
            role: "Ai",
            text: result
        })


        await conversationObj.save()

        res.status(200).json(
            {
                success: true,
                result: result,
                conversationId: conversationObj.id,
                conversationTitle: conversationObj.title
            }
        )
    } catch (error) {
        // console.log(`error while fetching llm ${error.stack}`)
    
        res.status(500).json({
            success: false,
            result: error
        })
    }
}

async function callToMongoDB(req, res) {

    const { id } = req.body
    try {
        let chatDocument = await conversationModel.findById(id)

        res.status(200).json(
            {
                success: true,
                messages: chatDocument.messages
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                success:false,
                messages:error
            }
        )
    }
}

async function getAllConversationObj(req, res) {

    try {
        const allObjDocument = await conversationModel.find()

        res.status(200).json(
            {
                success: true,
                allObj: allObjDocument,
            }
        )
    }
    catch (error) {
        res.status(500).json(
            {
                success: false,
                message: error,
            }
        )
    }
}

module.exports = {
    homePage,
    callToLLM,
    callToMongoDB,
    getAllConversationObj
}