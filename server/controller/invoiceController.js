
import Invoice from "../model/invoiceModel.js"
import { errorHandler } from "../utils/error.js"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";


export const createInvoice = async (req,res,next) => {

    if(req.user.isAdmin)
    {
        return next(errorHandler(403,"You are not allowed to add an invoice"))
    }

    try
    {

        const {client,project,dueDate,items,taxRate,notes,status} = req.body

        // calculate
        const subtotal = items.reduce((acc,item) => acc + (item.quantity * item.unitPrice), 0)

        const tax = subtotal * (taxRate || 0)

        const total = subtotal + tax


        // Generate a unique invoice number
        const invoiceNumber = `INV-${Date.now()}`;


        // create invoice
        const invoice = new Invoice({
            invoiceNumber,
            invoiceDate: new Date(),
            dueDate,
            client,
            project,
            items,
            subtotal,
            tax,
            total,notes,status
        })

        
        // Generate PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);


        // Set up fonts and styling
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        const fontSize = 12;
        
        const textColor = rgb(0, 0, 0);


        // Load company logo
        const logoPath = path.join(__dirname, '../assets/logo.png'); // Replace with the actual path to your logo image
        
        const logo = await pdfDoc.embedPng(await fs.readFileSync(logoPath));

        
        // Add company logo to the PDF
        page.drawImage(logo, 50, 20, { width: 100 });


        // Add invoice header
        page.drawText('SIRE TECH SOLUTIONS', {
            x: 50,
            y: 50,
            size: 18,
            font,
        });

        page.drawText(`Invoice Number: ${invoiceNumber}`, {
            x: 50,
            y: 70,
            size: fontSize,
            font,
          });

        page.drawText(`Invoice Date: ${new Date().toLocaleDateString()}`, {
            x: 50,
            y: 80,
            size: fontSize,
            font,
        });
      
        page.drawText(`Due Date: ${invoice.dueDate.toLocaleDateString()}`, {
            x: 50,
            y: 90,
            size: fontSize,
            font,
        });

        // Add client information
        page.drawText(`Client: ${client.name}`, {
            x: 50,
            y: 110,
            size: fontSize,
            font,
        });

        page.drawText(`Address: ${client.email}`, {
            x: 50,
            y: 120,
            size: fontSize,
            font,
        });
      
        page.drawText(`Phone: ${client.phone}`, {
            x: 50,
            y: 130,
            size: fontSize,
            font,
        });


        // Add invoice items table
        let y = 150;

        page.drawText('Description', { x: 50, y: y, size: 10, font });

        page.drawText('Quantity', { x: 200, y: y, size: 10, font });

        page.drawText('Unit Price', { x: 280, y: y, size: 10, font });

        page.drawText('Amount', { x: 360, y: y, size: 10, font });

        y += 15;


        items.forEach((item) => {
            
            page.drawText(item.description, { x: 50, y: y, size: 10, font });
           
            page.drawText(item.quantity.toString(), { x: 200, y: y, size: 10, font });
            
            page.drawText(`$${item.unitPrice.toFixed(2)}`, { x: 280, y: y, size: 10, font });
            
            page.drawText(`$${(item.quantity * item.unitPrice).toFixed(2)}`, { x: 360, y: y, size: 10, font });

            y += 15;
        });
        

        // Add subtotal, tax, and total
        page.drawText(`Subtotal: $${subtotal.toFixed(2)}`, { x: 360, y: y, size: 12, font });

        y += 15;

        page.drawText(`Tax (${taxRate * 100}%): $${tax.toFixed(2)}`, { x: 360, y: y, size: 12, font });

        y += 15;

        page.drawText(`Total: $${total.toFixed(2)}`, { x: 360, y: y, size: 14, font });


        // Add Invoice Status (if needed)
        y += 25;
        page.drawText(`Status: ${invoice.status}`, { x: 50, y: y, size: 12, font });


        // Add Notes (if available)
        if (invoice.notes) 
        {
            y += 15;

            page.drawText('Notes:', { x: 50, y: y, size: 12, font });

            y += 10;

            page.drawText(invoice.notes, { x: 50, y: y, size: 10, font }); 

        }


        // Get PDF buffer
        const pdfBytes = await pdfDoc.save();

        invoice.pdf = pdfBytes; 



        // save the invoice
        const newInvoice = await invoice.save()


        res.status(200).json({success:true , newInvoice})

    }
    catch(error)
    {
        next()
    }

}


export const getInvoice = async (req,res,next) => {

    const {invoiceId} = req.params

    const invoice = await Invoice.findById(invoiceId)

    if(!invoice)
    {
        return next(errorHandler(404 ,"invoice not found"))
    }

    try
    {

        res.status(200).json({success:true , invoice})

    }
    catch(error)
    {
        next()
    }

}


export const getInvoices = async (req,res,next) => {

    try
    {
        const invoices = await Invoice.find({})
                              .sort({_id:-1})
                              populate({
                                path: 'client',
                              }),
                              populate({
                                path: 'project',
                              })

        res.status(200).json({success:true , invoices})
    }
    catch(error)
    {
        next()
    }

}


export const updateInvoice = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403,"Yoe are not allowed"))
    }

    const {invoiceId} = req.params

    const invoice = await Invoice.findById(invoiceId)

    if(!invoice)
    {
        return next(errorHandler(404 ,"invoice not found"))
    }

    try
    {
       // Update invoice fields
        invoice.status = req.body.status || invoice.status;
        invoice.dueDate = req.body.dueDate || invoice.dueDate; 
        invoice.notes = req.body.notes || invoice.notes;


        // Handle changes that affect PDF content
        if 
        (
            req.body.items || 
            req.body.taxRate || 
            req.body.dueDate // If due date has changed
        ) 
        {

        // Regenerate PDF
        const pdfDoc = await PDFDocument.load(invoice.pdf);
        const page = pdfDoc.getPages()[0];

        // Update invoice items in the PDF 

        let y = 150; // Adjust starting y-coordinate as needed

        if(req.body.items) 
        {
            invoice.items = req.body.items; 
        }

        invoice.items.forEach((item) => {
            page.drawText(item.description, { x: 50, y: y, size: 10, font });
            page.drawText(item.quantity.toString(), { x: 200, y: y, size: 10, font });
            page.drawText(`$${item.unitPrice.toFixed(2)}`, { x: 280, y: y, size: 10, font });
            page.drawText(`$${(item.quantity * item.unitPrice).toFixed(2)}`, { x: 360, y: y, size: 10, font });
            y += 15;
        });

        // Update subtotal, tax, and total
        const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
        const tax = subtotal * (invoice.taxRate || 0);
        const total = subtotal + tax;

        invoice.subtotal = subtotal;
        invoice.tax = tax;
        invoice.total = total;

        page.drawText(`Subtotal: $${subtotal.toFixed(2)}`, { x: 360, y: y, size: 12, font });
        y += 15;
        page.drawText(`Tax (${invoice.taxRate * 100}%): $${tax.toFixed(2)}`, { x: 360, y: y, size: 12, font });
        y += 15;
        page.drawText(`Total: $${total.toFixed(2)}`, { x: 360, y: y, size: 14, font });

        // Update due date in PDF
        page.drawText(`Due Date: ${invoice.dueDate.toLocaleDateString()}`, {
            x: 50,
            y: 80,
            size: 12,
            font,
        });

        const updatedPdfBytes = await pdfDoc.save();
        invoice.pdf = updatedPdfBytes; 
        }

        const updatedInvoice = await invoice.save();

        res.status(200).json({success:true , updatedInvoice})
    }
    catch(error)
    {
        next()
    }

}


export const deleteInvoice = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403,"Yoe are not allowed"))
    }

    const {invoiceId} = req.params

    const invoice = await Invoice.findById(invoiceId)

    if(!invoice)
    {
        return next(errorHandler(404 ,"invoice not found"))
    }

    try
    {
        await Invoice.findByIdAndDelete(invoiceId)

        res.status(200).json({success:true , message:`The invoice has been deleted`})
    }
    catch(error)
    {
        next()
    }

}

