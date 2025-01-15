

import User from "../model/userModel.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"



export const register = async (req,res,next) => {

   
    const {email,password,username} = req.body

    if(!email || !password || !username || username === "" || password === "" || email === "")
    {
        return next(errorHandler(401, "Please fill all the fields"))
    }

    const isEmail = await User.findOne({email})

    if(isEmail)
    {
        return next(errorHandler(400,"The email is already registered"))
    }

    const hashedPassword = bcryptjs.hashSync(password ,10)

    const newUser = new User({
        email,
        password:hashedPassword,
        username
    })

    try
    {

        newUser.save()

        res.status(200).json({success:true , message:"You have successfully registered"})

    }   
    catch(error)
    {
        next(error)
    }

}


export const login = async (req,res,next) => {

    const {email,password} = req.body

    if(!email || !password || email === "" || password === "")
    {
        return next(errorHandler(400, "please  fill all the fields"))
    }

    try
    {
        const user = await User.findOne({email})

        if(!user)
        {
            return next(errorHandler(404,"The email is not registered"))
        }

        const isMatch = await bcryptjs.compare(password , user.password)

        if(!isMatch)
        {
            return next(errorHandler(400 ,"Invalid password"))
        }

        const token = jwt.sign(
            {
                id:user._id,
                isAdmin:user.isAdmin
            },
            process.env.JWT_SECRETE,
            {expiresIn:'12h'}
        )

        const {password:pass , ...rest } = await user._doc

        res.status(200).json({success:true , rest ,token})
    }
    catch(error)
    {
        next(error)
    }

}


export const forgotPassword = async (req,res,next) => {

    const {email} = req.body

    if(!email || email === "")
    {
        return next(errorHandler(400, "Enter an email please"))
    }

    const user = await User.findOne({email})

    if(!user)
    {
        return next(errorHandler(404,"The email is not registered"))
    }
    
    try
    {
        const token = jwt.sign(
         {id:user._id },
         process.env.JWT_SECRETE,
         {expiresIn:'2h'}
        )

        var transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.AUTH_USER,
                pass:process.env.AUTH_PASS
            }
        })

        const url = process.env.FRONTEND_URL

        var mailOptions = {
            from:"SIRE TECH SOLUTIONS",
            to:user.email,
            subject:"RESET PASSWORD",
            text:`please click the link reset your password : ${url}/reset-password/${token}`
        }

        transporter.sendMail(mailOptions ,(error,info) => {

            if(error)
            {
                console.log(error)
            }
            else
            {
                console.log("Email sent: " + info.response)
            }

        })

        res.status(200).json({success:true, message:"Link has been sent"})

    }
    catch(error)
    {
        next(error)
    }

}


export const resetPassword = async (req,res,next) => {

    const {token} = req.params

    const {password, confirmPassword} = req.body

    try
    {
        const decodedToken = jwt.verify(token , process.env.JWT_SECRETE)

        const user = await User.findById(decodedToken.id)

        if(!user)
        {
            return next(errorHandler(404,"User not found"))
        }

        if(password !== confirmPassword)
        {
            return next(errorHandler(400 ,"password do not match"))
        }

        const hashedPassword = bcryptjs.hashSync(password ,10)

        user.password = hashedPassword

        await user.save()

        res.status(200).json({success:true ,message:"Password successfully reset"})

    }
    catch(error)
    {
        next(error)
    }

}


export const contactMe = async (req,res,next) => {

    const {phone ,name , email, subject ,content} = req.body

    try
    {

        var transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.AUTH_USER,
                pass:process.env.AUTH_PASS
            }
        })

        const mailOptions = {
            from:`<${email}>`,
            to:process.env.AUTH_USER ,
            subject:`Contact Form : ${subject}`,
            text:`
                Name:${name}
                Email:${email}
                Subject:${subject}
                Message:${content}
            `
        }

        await transporter.sendMail(mailOptions ,(error,info) => {

            if(error)
            {
                console.log(error.message)
            }
            else
            {
                console.log('Email sent : ' + info.response)
            }
        })

        res.status(200).json({success:true ,message:'message sent'})
    }
    catch(error)
    {
        next(error)
    }

}