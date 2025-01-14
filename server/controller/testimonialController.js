
import Client from "../model/clientModel.js"
import Testimonial from "../model/testmonials.js"
import { errorHandler } from "../utils/error.js"



export const addTestimonial = async (req,res,next) => {
    
    const {name,email,content,rate} = req.body

    const isClient = await Client.findOne({email})

    if(!isClient)
    {
        return next(errorHandler(401, "You are not allowed to add testimonies ,since you are not our client"))
    }

    const newTestimonial = new Testimonial({
        name,email,content,rate
    })

    try
    {
        await newTestimonial.save()

        res.status(200).json({success:true , newTestimonial})

    }
    catch(error)
    {
        next(error)
    }

}


export const getTestimonial = async (req,res,next) => {

    const {testId} = req.params

    const testimonial = await Testimonial.findById(testId)

    if(!testimonial)
    {
        return next(errorHandler(404 ,"testimonial not found"))
    }

    try
    {
        res.status(200).json({success:true , testimonial})
    }
    catch(error)
    {
        next(error)
    }

}


export const getTestimonials = async (req,res,next) => {

    
    try
    {

        const testimonials = await Testimonial.find({}).sort({_id:-1})

        res.status(200).json({success:true , testimonials})

    }
    catch(error)
    {
        next(error)
    }

}


export const updateTestimonial = async (req,res,next) => {

    if(!req.user.id && !req.user.isAdmin)
    {
        return next(errorHandler(401 ,"You are not allowed to update"))
    }

    const {testId} = req.params

    const testimonial = await Testimonial.findById(testId)

    if(!testimonial)
    {
        return next(errorHandler(404 ,"testimonial not found"))
    }

    try
    {

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            testId ,
            {
                $set:{
                    name:req.body.name,
                    email:req.body.email,
                    content:req.body.content,
                    rate:req.body.rate,
                }
            },
            {new:true}
        )

        res.status(200).json({success:true , updatedTestimonial})

    }
    catch(error)
    {
        next(error)
    }

}


export const deleteTestimonial = async (req,res,next) => {

    if(!req.user.id && !req.user.isAdmin)
    {
        return next(errorHandler(401 ,"You are not allowed to update"))
    }

    const {testId} = req.params

    const testimonial = await Testimonial.findById(testId)

    if(!testimonial)
    {
        return next(errorHandler(404 ,"testimonial not found"))
    }

    try
    {
        await Testimonial.findByIdAndDelete(testId)

        res.status(200).json({success:true , message:"Testimonial is delete"})
    }
    catch(error)
    {
        next(error)
    }

}

