

import mongoose from "mongoose"


const clientSchema = new mongoose.Schema(
    {
        name:{type:String ,required:true},

        status:{type:Boolean , default:false},

        email:{type:String , required:true},

        phone:{type:String , required:true},

        whatsapp:{type:String , required:true},

        additionalInfo:{type:String , required:true},
    },
    {timestamps:true}
)


const Client = mongoose.model('Client' , clientSchema)


export default Client

