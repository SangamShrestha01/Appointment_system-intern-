import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();
export const generateToken=(data)=>{
    const token= jwt.sign(data,process.env.JWT_SECERT,{
        expiresIn:"1D"
    })
    return token;
}