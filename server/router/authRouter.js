

import express from "express"
import { contactMe, forgotPassword, login, register, resetPassword } from "../controller/authController.js"


const authRouter = express.Router()


authRouter.post('/register',register)


authRouter.post('/login', login)


authRouter.post('/reset-password/:token', resetPassword)


authRouter.post('/forgot-password', forgotPassword)


authRouter.post('/contact', contactMe)


export default authRouter