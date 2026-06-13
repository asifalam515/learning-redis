import express from 'express'
import Redis from 'ioredis'
const app = express()
app.use(express.json())

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6380')
const  BANNER_KEY = 'app:banner'

const otpKey = (phone)=>{
    return `otp: ${phone}`
}


app.post("/user/:id/json",async(req,res)=>{
    await redis.set(`user:${req.params.id}:json`,JSON.stringify(req.body))
    res.json({savedAs:"json"})
})

app.get("/user/:id/json",async(req,res)=>{
const raw = await redis.get(`user:${req.params.id}:json`)

    res.json({user:raw ? JSON.parse(raw) :null})
})
// want to store as object
app.post("/user/:id/hash",async(req,res)=>{
    await redis.hset(`user:${req.params.id}:hash`,req.body)
    res.json({savedAs:"hash"})
})
app.get("/user/:id/hash",async(req,res)=>{
   const user =  await redis.hgetall(`user:${req.params.id}:hash`)
    res.json({user})
})

// for otp application 
app.post("/otp",async(req,res)=>{
    const {phone} = req.body
    const otp  = Math.floor(100000 + Math.random() * 900000)
    await redis.set(otpKey(phone),otp,'EX',50) //top valid only for 50 second
    res.json({message:"OTP ",otp})
})

// check 
app.post("/otp/verify",async(req,res)=>{
    const {phone,otp} = req.body
    const savedOtp = await redis.get(otpKey(phone))
    if(!savedOtp){
        return res.status(400).json({
            message:"otp expired"
        })

    }
    if(savedOtp != otp){
            return res.status(400).json({
            message:"Invalid OTP"
        })

    }
    // validate user here  
    await redis.del(otpKey(phone))
    res.json({message:"otp verified"})
})
app.get("/otp/:phone/ttl",async(req,res)=>{
    const ttl = await redis.ttl(otpKey(req.params.phone))
  res.json({ttl})
})
app.listen(3000, () => {
    console.log('Server is running on port 3000')
})