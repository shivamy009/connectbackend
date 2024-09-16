const express=require('express')

const app = express()
const cors=require('cors')
app.use(cors())

require('dotenv').config()
app.use(express.json())

const db=require('./db/database')
const authRoute=require('./router/authRoute')
const friendRoute=require('./router/friendRouter')

db();

app.use('/api/v1/auth',authRoute)
app.use('/api/v1/friend',friendRoute)

app.use('/f',(req,res)=>{
    res.send("hello")
})

const PORT = process.env.PORT || 8001

app.listen(PORT,()=>{
    console.log(`App is listening on port ${PORT}`)
})
