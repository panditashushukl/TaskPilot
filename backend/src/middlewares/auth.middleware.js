import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async(req,res,next)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('No token provided');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new Error('Invalid access token');
  }
})

export const verifyAdmin = asyncHandler(async(req,res,next)=>{
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin privileges required.")
  }
  next()
})