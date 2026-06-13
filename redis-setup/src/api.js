import express from "express"
const app = express()
app.use(express.json())
app.post("/welcome-email",async(req,res)=>{

const job = await emailQueue.add("welcome-email",{
    to:req.body.to,
    name:req.body.name,
    email:req.body.email
})
res.send("Welcome email job added to the queue")  
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})
