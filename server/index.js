

import express from "express"
import mongoose from "mongoose"
import "dotenv/config"
import cors from "cors"
import authRouter from "./router/authRouter.js"
import userRouter from "./router/userRouter.js"
import clientRoute from "./router/clientRoute.js"
import serviceRouter from "./router/serviceRouter.js"
import projectRouter from "./router/projectRouter.js"
import taskRouter from "./router/taskRouter.js"
import testimonialRouter from "./router/testimonialRouter.js"
import invoiceRouter from "./router/invoiceRouter.js"


const app = express()


const PORT = process.env.PORT



app.use(cors())


app.use(express.json())



// DB CONNECTION
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB CONNECTED"))
.catch((err) => console.log(err))



// ROUTES
app.use('/api/auth', authRouter) 


app.use('/api/user', userRouter)


app.use('/api/client' , clientRoute)


app.use('/api/service', serviceRouter)


app.use('/api/test', testimonialRouter)


app.use('/api/project', projectRouter)


app.use('/api/task', taskRouter)


app.use('/api/invoice' , invoiceRouter)




// API
app.get('/',(req,res) => {

    res.send("HELLO SIRE TECH SOLUTIONS")

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

    const message = err.message || "Internal Server Erroror"

    res.status(statusCode).json({success:false , message:message})

})