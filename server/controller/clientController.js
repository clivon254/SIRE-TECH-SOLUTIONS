
import Client from "../model/clientModel.js"
import { errorHandler } from "../utils/error.js"



export const addClient = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403, "You are not allowed to add a client"))
    }

    const {name,email,phone,whatsapp,additionalInfo} = req.body

    const newClient = new Client({
        name,email,phone,whatsapp,additionalInfo
    })

    try
    {
        await newClient.save()

        res.status(200).json({success:true , newClient})

    }
    catch(error)
    {
        next(error)
    }

}



export const getClient = async (req,res,next) => {

    const {clientId} = req.params

    const client = await Client.findById(clientId)

    if(!client)
    {
        return next(errorHandler(404, 'Client not found'))
    }

    try
    {
        res.status(200).json({sucess:true , client})
    }
    catch(error)
    {
        next(error)
    }

}



export const getClients = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403,"Your are not allowed to see all the clients"))
    }

    try
    {
        const clients = await Client.find().sort({_id:-1})

        res.status(200).json({success:true , clients})

    }
    catch(error)
    {
        next(error)
    }

}



export const updateClient = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403,"Your are not allowed to update the clients"))
    }

    const {clientId} = req.params

    const client = await Client.findById(clientId)

    if(!client)
    {
        return next(errorHandler(404, 'Client not found'))
    }

    try
    {

        const updatedClient = await Client.findByIdAndUpdate(
            clientId ,
            {
                $set:{
                    name:req.body.name ,
                    status:req.body.status ,
                    email:req.body.email,
                    phone:req.body.phone ,
                    whatsapp:req.body.whatsapp ,
                    additionalInfo:req.body.additionalInfo ,
                }
            },
            {new:true}
        )

        res.status(200).json({success:true , updatedClient})

    }
    catch(error)
    {
        next(error)
    }

}



export const deleteClient = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403,"Your are not allowed to delete the clients"))
    }

    const {clientId} = req.params

    const client = await Client.findById(clientId)

    if(!client)
    {
        return next(errorHandler(404, 'Client not found'))
    }
    
    try
    {
        await Client.findByIdAndDelete(clientId)

        res.status(200).json({success:true , message:`${client.name} is deleted`})
    }
    catch(error)
    {
        next(error)
    }

}
