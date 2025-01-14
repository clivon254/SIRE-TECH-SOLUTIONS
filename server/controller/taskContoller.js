
import Task from "../model/taskModel.js"
import { errorHandler } from "../utils/error.js"


export const createTask = async (req,res,next)=> {
    
    if(!req.user.isAdmin)
    {
        return next(errorHandler(403,"You are not allowed to create task"))
    }

    const userId = req.user.id

    const {title,team,stage,date,priority} = req.body

    try
    {
        let text = 'New task has been assigned to you'

        if(team?.length > 1)
        {
            text = text + `and ${team?.length - 1} ,so check and act accordingly .
            The task date is ${new Date(date).toDateString()}.Thank you !!!`
        }

        const activity = {
            type:"assigned",
            activity:text,
            by:userId
        }

        const task = new Task({
            title,
            team,
            stage:stage.toLowerCase(),
            priority:priority.toLowerCase(),
            date,
            activities:activity
        })

        await task.save()

        res.status(200).json({success:true , task})

    }
    catch(error)
    {
        next(error)
    }
}


export const getTask = async (req,res,next)=> {

    const {taskId} = req.params

    const task = await Task.findById(taskId)
                    .populate({
                        path:"team",
                        select:"username"
                    })
                    .populate({
                        path:"activities.by"
                    })

    if(!task)
    {
        return next(errorHandler(404, "Task not found"))
    }

    try
    {
        res.status(200).json({success:true , task})
    }
    catch(error)
    {
        next(error)
    }
}


export const getTasks = async (req,res,next)=> {

    try
    {
        const tasks = await Task.find({
            ...(req.query.stage && {stage:req.query.stage})
        })
        .populate({
            path:"team",
            select:"username"
        })

        res.status(200).json({success:true , tasks})
    }
    catch(error)
    {
        next(error)
    }
}


export const postTaskActivity = async (req,res,next)=> {

    const userId = req.user.id

    const {type ,activity} = req.body

    const {taskId} = req.params

    const task = await Task.findById(taskId)

    if(!task)
    {
        return next(errorHandler(404,"Task not found"))
    }

    try
    {
        const data = {
            type,
            activity,
            by:userId
        }

        task.activities.push(data)

        await task.save()

        res.status(200).json({success:true ,message:"Activity posted"})
    }
    catch(error)
    {
        next(error)
    }
}


export const createSubTask = async (req,res,next)=> {

    const {title,tag,date} = req.body 

    const {taskId} = req.params

    const task = await Task.findById(taskId)

    if(!task)
    {
        return next(errorHandler(404,"Task not found"))
    }

    try
    {

        const newSubTask = {
            title,date,tag
        }

        task.subTasks.push(newSubTask)

        await task.save()

        res.status(200).json({success:true , message:"Subtask added"})

    }
    catch(error)
    {
        next(error)
    }
}


export const updateTask = async (req,res,next)=> {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403,"You are not allowed to create task"))
    }

    const {taskId} = req.params

    const task = await Task.findById(taskId)

    if(!task)
    {
        return next(errorHandler(404,"Task not found"))
    }

    try
    {

        const updatedTask = await Task.findByIdAndUpdate(taskId,
            {
                $set:{
                    title:req.body.title,
                    date:req.body.date,
                    priority:req.body.priority,
                    team:req.body.team,
                }
            }
        )

        res.status(200).json({success:true , updatedTask})

    }
    catch(error)
    {
        next(error)
    }
}


export const deleteTask = async (req,res,next)=> {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403,"You are not allowed to create task"))
    }

    const {taskId} = req.params

    const task = await Task.findById(taskId)

    if(!task)
    {
        return next(errorHandler(404,"Task not found"))
    }
     
    try
    {
        await Task.findByIdAndDelete(taskId)

        res.status(200).json({success:true , message:`Task deleted`})
    }
    catch(error)
    {
        next(error)
    }
}