

import express from "express"
import { verifyToken } from "../utils/verify.js"
import { addProject, deleteProject, getProject, getProjects, updateProject } from "../controller/projectController.js"


const projectRouter = express.Router()


projectRouter.post('/add-project', verifyToken, addProject)


projectRouter.get('/get-project/:projectId', getProject)


projectRouter.get('/get-projects' ,getProjects)


projectRouter.put('/update-project/:projectId', verifyToken ,updateProject)


projectRouter.delete('/delete-project/:projectId',verifyToken, deleteProject)


export default projectRouter