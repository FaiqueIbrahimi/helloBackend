import asyncHandler from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
  // Logic for registering a user
  res.status(200).json({ message: 'User register ho gya' });
});

export {registerUser};



