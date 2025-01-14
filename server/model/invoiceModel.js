

import mongoose from "mongoose"

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber:{type:String , required:true , unique:true},

        client:{type:mongoose.Schema.Types.ObjectId , ref:'Client'},

        project:{type:mongoose.Schema.Types.ObjectId , ref:'Project'},

        invoiceDate:{type:Date , default:Date.now()},

        dueDate:{type:Date},

        items:[
            {
                description:{type:String , required:true},
                quantity:{type:Number , required:true},
                unitPrice:{type:Number , required:true},
            }
        ],
        subtotal:{type:Number , required:true},

        tax:{type:Number},

        total:{type:Number , required:true},

        paymentDate:{type:Number , required:true},

        status:{type:String ,enum:['Pending','Paid','Overdue']},

        notes:{type:Date , default:Date.now()}
    },
    {timestamps:true}
)


const Invoice = mongoose.model('Invoice' ,invoiceSchema)


export default Invoice