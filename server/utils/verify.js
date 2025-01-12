

import jwt from "jsonwebtoken"
import { errorHandler } from "./error.js"


export const verifyToken = (req,res,next) => {

    const {token} = req.headers 

    if(!token)
    {
        return next(errorHandler(403 ,"There is no token"))
    }

    jwt.verify(token ,process.env.JWT_SECRETE ,(err,user) => {

        if(err)
        {
            return next(errorHandler(401,"Unauthorized"))
        }

        req.user = user

        next()

    })

}