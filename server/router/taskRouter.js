

import express from "express"
import { createSubTask, createTask, deleteTask, getTask, getTasks, postTaskActivity, updateTask } from "../controller/taskContoller.js"
import { verifyToken } from "../utils/verify.js"


const taskRouter = express.Router()


taskRouter.post('/create-task' , verifyToken, createTask)


taskRouter.get('/get-task/:taskId' , getTask)


taskRouter.get('/get-tasks' , getTasks)


taskRouter.post('/create-postActivity/:taskId' , verifyToken, postTaskActivity)


taskRouter.post('/create-subtask/:taskId' , verifyToken, createSubTask)


taskRouter.put('/update-task/:taskId' , verifyToken, updateTask)


taskRouter.delete('/delete-task/:taskId' , verifyToken, deleteTask)



export default taskRouter