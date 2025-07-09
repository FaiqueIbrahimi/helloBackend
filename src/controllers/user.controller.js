import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation lagana hoga details ki 
  //check if user already exists username ya email se
  //check for images , avatar
  //if available  upload to cloudinary 
  //create user object - create entry in db
  //remove password and refresh token field from response 
  //check for user creation 
  //return response

  const {fullName,email , username,password}  = req.body
  console.log("Yeah h naam", fullName);
  console.log("Yeah h email", email);
  console.log("Yeah h password", password);

  if(fullName=="")
  {
    throw new ApiError(400, "Full name chahiye bhai");
  }
  if(email=="")
  {
    throw new ApiError(400, "Email chahiye bhai");
  }
  if(username=="")
  {
    throw new ApiError(400, "Username chahiye bhai");
  }
  if(password=="")
  {
    throw new ApiError(400, "Password chahiye bhai");
  }

  const existedUser =  User.findOne({$or: [{username}, {email}]})
  if (existedUser) {
    throw new ApiError(409, "Username ya email already exists");
  }

 const avatarLocalPath =  req.files?.avatar[0]?.path;
 const coverImageLocalPath =  req.files?.coverImage[0]?.path;

 if(!avatarLocalPath) {
    throw new ApiError(400, "Avatar image toh chahiye bhai");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar) {
    throw new ApiError(500, "Avatar image upload failed");
  }

  const user = await User.create({
    fullName,
    email,
    username : username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  })

   const createdUser = await User.findById(user._id).select("-password -refreshToken");

   if(!createdUser) {
    throw new ApiError(500, "User creation failed");
   }

   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully"))




});

export {registerUser};



