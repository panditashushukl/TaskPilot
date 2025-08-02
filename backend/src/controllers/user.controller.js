import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId) =>{
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    
    // Always override the refresh token to ensure no old tokens remain
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken,refreshToken}
  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating refresh and access token")
  }
}

/*
  Steps to register User:
    1. Get user details from frontend.
    2. Validation - not empty
    3. Check if user already exists : username and email.
    4. Check for images and Check for Avtar
    5. Upload on cloudinary
    6. Create user object - create entry in DB
    7. Remove password and refresh token feild from response.
    8. Check for user creation
    9. Return Response else return error
*/

const registerUser = asyncHandler(
  async (req,res) => {
    const {fullName,email,username,password,role} = req.body
    console.log(fullName,email,username,password);
    if (
      [fullName,email,username,password].some((feild) => feild?.trim() === "")
    ) {
      throw new ApiError(400, "All feilds required")
    }

    if (!email.includes("@")) {
      throw new ApiError(400, "Invalid email address");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/;
    if (!passwordRegex.test(password)) {
      throw new ApiError(
        400,
        "Password must be 8-12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }]
    })

    if(existedUser){
      throw new ApiError(409, "User with email or Username already exists")
    }

    const avtarLocalPath = req.files?.avtar?.[0]?.path

    if (!avtarLocalPath) {
      throw new ApiError(400, "Avatar file is required")
    }

    const avtar = await uploadOnCloudinary(avtarLocalPath)

    if (!avtar){
      throw new ApiError(400, "Avatar file is corrupted or not uploaded")
    }

    const user = await User.create({
      fullName,
      avtar: avtar.url,
      email,
      password,
      username: username.toLowerCase(),
      role: role || "user"
    })

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user.")
    }

    return res.status(201).json(
      new ApiResponse(200,createdUser,"User Registered Successfully.")
    )
  }
)

/*
  Steps to Login User
    1. Take response from the frontend
    2. Check username or email exist in Database
    3. if username exist match the password
    4. if Password matches login the user else through error
    5. enerate access and refresh Token
    6. Send secure cookies
*/

const loginUser = asyncHandler(async (req, res) => {

  const {email,username,password} = req.body

  if (!username && !email) {
    throw new ApiError(400, "username or email is required")
  }

  if (!password) {
    throw new ApiError(400, "password is required")
  }

  const user = await User.findOne({
    $or: [{username},{email}]
  })

  if (!user) {
    throw new ApiError(400, "User not Found")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password")
  }

  // Always generate new tokens and override existing ones
  const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days for refresh token
  }

  const accessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutes for access token
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, accessTokenOptions)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      {
        user: loggedInUser
      },
      "User logged In Successfully"
    )
  )
  console.log("User is Looged in Successfully");
  
})

/*
  Steps to Logout User
    1. Delete the accessToken and the refreshToken from user side
    2. Also delete the refreshToken from the Database
*/
const loggedOutUser = asyncHandler(async (req,res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

// Get all users with filtering, sorting, and pagination
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc" } = req.query

  const query = {}
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { fullName: { $regex: search, $options: "i" } }
    ]
  }

  const sortOptions = {}
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1

  const skip = (parseInt(page) - 1) * parseInt(limit)

  const users = await User.find(query)
    .select("-password -refreshToken")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))

  const total = await User.countDocuments(query)

  return res.status(200).json(
    new ApiResponse(200, {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, "Users retrieved successfully")
  )
})

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params

  const user = await User.findById(userId).select("-password -refreshToken")

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User retrieved successfully")
  )
})

// Update user
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const { fullName, email, username, role } = req.body

  const user = await User.findById(userId)

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  // Check if user is admin or updating their own profile
  if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
    throw new ApiError(403, "You can only update your own profile")
  }

  const updateFields = {}
  if (fullName) updateFields.fullName = fullName
  if (email) updateFields.email = email
  if (username) updateFields.username = username
  if (role && req.user.role === "admin") updateFields.role = role

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateFields,
    { new: true }
  ).select("-password -refreshToken")

  return res.status(200).json(
    new ApiResponse(200, updatedUser, "User updated successfully")
  )
})

// Delete user (admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params

  const user = await User.findById(userId)

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  await User.findByIdAndDelete(userId)

  return res.status(200).json(
    new ApiResponse(200, {}, "User deleted successfully")
  )
})

// Refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used")
    }

    // Always generate new tokens and override existing ones
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days for refresh token
    }

    const accessTokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes for access token
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {},
          "Access token refreshed"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }
})

// Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken")

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  return res.status(200).json(
    new ApiResponse(200, user, "Current user retrieved successfully")
  )
})

export {
  registerUser,
  loginUser,
  loggedOutUser,
  refreshAccessToken,
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
}