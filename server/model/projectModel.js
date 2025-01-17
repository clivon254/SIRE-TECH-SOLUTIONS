

import mongoose from "mongoose"


const projectSchema = new mongoose.Schema(
    {
        title:{type:String ,required:true},

        description:{type:String ,required:true},

        image:{type:String ,required:true},

        client:{type:mongoose.Schema.Types.ObjectId , ref:'Client'},

        url:{type:String ,required:true},

        status:{type:String , default:"On Hold", enum:['Ongoing','On Hold','Completed']},

        startDate:{type:Date ,required:true},

        dueDate:{type:Date ,required:true},

        tools:{type:Array ,required:true},
    },
    {timestamps:true}
)


const Project = mongoose.model('Project', projectSchema)


export default Project