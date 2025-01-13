


import express from "express"
import { verifyToken } from "../utils/verify.js"
import { addClient, deleteClient, getClient, getClients, updateClient } from "../controller/clientController"


const clientRoute = express.Router()



clientRoute.post('/add-client', verifyToken ,addClient)



clientRoute.post('/get-client/:clientId', getClient)



clientRoute.post('/get-clients', verifyToken , getClients)



clientRoute.post('/update-client/:clientId', verifyToken , updateClient)



clientRoute.post('/delete-client/:clientId', verifyToken , deleteClient)




export default clientRoute