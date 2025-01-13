

import express from "express"
import { addTestimonial, deleteTestimonial, getTestimonial, getTestimonials, updateTestimonial } from "../controller/testimonialController.js"
import { verifyToken } from "../utils/verify.js"


const testimonialRouter = express.Router()


testimonialRouter.post('/add-test' , addTestimonial)


testimonialRouter.get('/get-testId/testId', getTestimonial)


testimonialRouter.get('/get-tests/testId', getTestimonials)


testimonialRouter.put('/update-test/testId',verifyToken, updateTestimonial)


testimonialRouter.delete('/delete-test/testId' , verifyToken, deleteTestimonial)


export default testimonialRouter