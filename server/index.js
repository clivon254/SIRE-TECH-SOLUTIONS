

import express from "express"
import mongoose from "mongoose"
import "dotenv/config"
import cors from "cors"


const app = express()


const PORT = process.env.PORT



app.use(cors())


app.use(express.json())



// DB CONNECTION
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB CONNECTED"))



// ROUTES



// API
app.get('/',(req,res) => {


})



// LISTEN
app.listen(PORT ,(err) => {

    if(!err)
    {
        console.log(`Server is running on port ${PORT}`)
    }
    else
    {
        console.log(err)
    }

})


app.use((err,req,res,next) => {

    const statusCode = err.statusCode || 500

    const message = err.message || "Internal Server Error"

    res.status(statusCode).json({success:false , message:message})
    
})