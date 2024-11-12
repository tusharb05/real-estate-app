const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

const createProperty = async (data) => {
  const { title, description, price, location, status, imageUrl } = data;
  // check if user is admin. header: Authorization will have a token. decode it, check in User table and see if "role" is Admin
  // if he is, set advertiserId and UserId to id from the token, and create the Property and return success message
  try {
    // Get token from the Authorization header
    // const token = req.headers.Authorization?.split(' ')[1];
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Decode the token
    const decoded = jwt.verify(token, config.jwt.secret);
    console.log(decoded); //decoded.sub
    // const { sub: userId, role } = decoded;

    // Check if user exists and is an admin
    const user = await User.findOne({ where: { id: decoded.sub } });
    if (!user || user.role !== 'Advertiser') {
      return res.status(403).json({ message: 'Only advertiser users can create properties' });
    }

    // Create the property with userId as both advertiserId and userId
    const newProperty = await Property.create({
      title,
      description,
      price,
      location,
      status,
      imageUrl,
      advertiserId: decoded.sub,
      UserId: decoded.sub,
    });

    return newProperty;
    // return res.status(201).json({
    //   message: 'Property created successfully',
    //   property: newProperty,
    // });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while creating the property' });
  }
};
