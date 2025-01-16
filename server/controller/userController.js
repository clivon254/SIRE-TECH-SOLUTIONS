

import User from "../model/userModel.js"
import { errorHandler } from "../utils/error.js"



export const getUser = async (req,res,next) => {
    
    const {userId} = req.params 

    const user = await User.findById(userId)

    if(!user)
    {

        return next(errorHandler(404,"User is not found"))
    }

    try
    {
        const {password, ...rest} = await user._doc

        res.status(200).json({success:true , rest}) 

    }
    catch(error)
    {
        next(error)
    }

}


export const getUsers = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403,"You are not allowed to access the users"))
    }

    try
    {
        const users = await User.find({}).sort({_id:-1})

        const usersWithOutPasswords = users.map((user) => {

            const {password , ...rest} = user._doc

            return rest

        })

        res.status(200).json({success:true , usersWithOutPasswords})

    }
    catch(error)
    {
        next(error)
    }

}


export const updateUser = async (req,res,next) => {

    const {userId} = req.params

    if(!req.user.id && !req.user.isAdmin)
    {
        return next(errorHandler(403,"You are not allowed to update "))
    }

    const user = await User.findById(userId)

    if(!user)
    {
        return next(errorHandler(404,"User is not found"))
    }

    try
    {

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set:
                {
                    username:req.body.username,
                    email:req.body.email,
                    password:req.body.password,
                    profilePicture:req.body.profilePicture,
                    isAdmin:req.body.isAdmin
                }
            },
            {new:true}
        )

        const {password , ...rest} = await updatedUser._doc

        res.status(200).json({success:true , rest})
    }
    catch(error)
    {
        next(error)
    }

}


export const deleteUser = async (req,res,next) => {

    const {userId} = req.params

    if(!req.user.id && !req.user.isAdmin)
    {
        return next(errorHandler(403,"You are not allowed to delete the User"))
    }

    const user = await User.findById(userId)

    if(!user)
    {
        return next(errorHandler(404,"User is not found"))
    }

    try
    {

        await User.findByIdAndDelete(userId)

        res.status(200).json({success:true , message:`${user.username} has been deleted`})

    }
    catch(error)
    {
        next(error)
    }

}