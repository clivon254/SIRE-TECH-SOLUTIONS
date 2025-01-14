

import express from "esxpress"
import { createInvoice, deleteInvoice, getInvoice, getInvoices, updateInvoice } from "../controller/invoiceController.js"
import { verifyToken } from "../utils/verify.js"

const invoiceRouter = express.Router()


invoiceRouter.post('/create-invoice',verifyToken, createInvoice)


invoiceRouter.get('/get-invoice/:invoiceId', getInvoice)


invoiceRouter.get('/get-invoices', getInvoices)


invoiceRouter.put('/update-invoice',verifyToken, updateInvoice)


invoiceRouter.delete('/delete-invoice',verifyToken, deleteInvoice)



export default invoiceRouter