import express from 'express'
import Redis from 'ioredis'
import mongoose from 'mongoose'
const app = express()
app.use(express.json())

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6380')
const  BANNER_KEY = 'app:banner'
app.post("/banner",async (req, res) => {
    await redis.set(BANNER_KEY, req.body?.message || "welcome to  our website ")
   res.json({
    success:true,
   })
})

app.get("/banner",async(req,res)=>{
    const message = await redis.get(BANNER_KEY)
    res.json({message})
})
app.delete("/banner",async(req,res)=>{
    await redis.del(BANNER_KEY)
    res.json({success:true})
})
app.get("/banner/exists",async(req,res)=>{
    const exists = await redis.exists(BANNER_KEY)
    res.json({exists:Boolean(exists)})
})

app.get('/mongo', async (req, res) => {
const url = process.env.MONGO_URL || 'mongodb://redis:redis123@localhost:27017/mongo-basic?authSource=admin'
if(mongoose.connection.readyState === 0) {
    await mongoose.connect(url)
}
res.json({ mongo: 'MongoDB is connected',database:mongoose.connection.db.databaseName })
}
)
app.listen(3000, () => {
    console.log('Server is running on port 3000')
})