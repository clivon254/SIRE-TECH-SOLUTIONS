
import Project from "../model/projectModel.js"
import { errorHandler } from "../utils/error.js"


 export const addProject = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403, "You are not allowed to add projects"))
    }

    const {title,description,client,status,tools,startDate,dueDate,url} = req.body

    const newProject = new Project({
        title,description,client,status,tools,startDate,dueDate,url
    })

    try
    {
        await newProject.save()

        res.status(200).json({success:true , newProject})

    }
    catch(error)
    {
        next(error)
    }

 }


 export const getProject = async (req,res,next) => {

    const {projectId} = req.params

    const project = await Project.findById(projectId)

    if(!project)
    {
        return next(errorHandler(404, "project not found"))
    }

    try
    {
        res.status(200).json({success:true , project})
    }
    catch(error)
    {
        next(error)
    }

 }


 export const getProjects = async (req,res,next) => {

    try
    {

        const projects = await Project.find().sort({_id:-1})

        res.status(200).json({success:true , projects})

    }
    catch(error)
    {
        next(error)
    }

 }


 export const updateProject = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403, "You are not allowed to add projects"))
    }

    const {projectId} = req.params

    const project = await Project.findById(projectId)

    if(!project)
    {
        return next(errorHandler(404, "project not found"))
    }

    try
    {
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            {
                $set:{
                    title:req.body.title,
                    description:req.body.description,
                    client:req.body.client,
                    startDate:req.body.startDate,
                    dueDate:req.body.dueDate,
                    status:req.body.status,
                    tools:req.body.tools,
                    url:req.body.url,
                }
            },
            {new:true}
        )

        res.status(200).json({success:true , updatedProject})
    }
    catch(error)
    {
        next(error)
    }

 }


 export const deleteProject = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403, "You are not allowed to add projects"))
    }

    const {projectId} = req.params

    const project = await Project.findById(projectId)

    if(!project)
    {
        return next(errorHandler(404, "project not found"))
    }

    try
    {
        await Project.findByIdAndDelete(projectId)

        res.status(200).json({success:true , message:`${project.title} deleted`})
    }
    catch(error)
    {
        next(error)
    }

 }