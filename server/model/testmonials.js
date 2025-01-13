

import mongoose from "mongoose"

const testimonialSchema = new mongoose.Schema(
    {
        name:{type:String , required:true},
        
        email:{type:String , required:true},

        content:{type:String , required:true},

        rate:{type:Number , required:true}
    },
    {timestamps:true}
)


const Testimonial = mongoose.model('Testmonial', testimonialSchema)


export default Testimonial