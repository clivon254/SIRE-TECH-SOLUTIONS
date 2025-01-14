


import express from "express"
import { verifyToken } from "../utils/verify.js"
import { addClient, deleteClient, getClient, getClients, updateClient } from "../controller/clientController.js"


const clientRoute = express.Router()



clientRoute.post('/add-client', verifyToken ,addClient)



clientRoute.get('/get-client/:clientId', getClient)



clientRoute.get('/get-clients', verifyToken , getClients)



clientRoute.put('/update-client/:clientId', verifyToken , updateClient)



clientRoute.delete('/delete-client/:clientId', verifyToken , deleteClient)




export default clientRoute