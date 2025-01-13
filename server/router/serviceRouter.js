

import express from "express"
import { addService, deleteService, getService, getServices, updateService } from "../controller/serviceController.js"
import { verifyToken } from "../utils/verify.js"

const serviceRouter = express.Router()


serviceRouter.post('/add-service',verifyToken, addService)


serviceRouter.get('/get-service/:serviceId', getService)


serviceRouter.get('/get-services', getServices)


serviceRouter.put('/update-service/:serviceId', verifyToken ,updateService)


serviceRouter.delete('/delete-service/:serviceId', verifyToken , deleteService)



export default serviceRouter