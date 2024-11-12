const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, propertyService } = require('../services');
const User = require('../models/user.model');
const Property = require('../models/property.model');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
// const register = catchAsync(async (req, res) => {
//   const user = await userService.createUser(req.body);
//   const tokens = await tokenService.generateAuthTokens(user);
//   res.status(httpStatus.CREATED).send({ user, tokens });
// });

const createProperty = async (req, res) => {
  console.log(req.body);
  const { title, description, price, location, status, imageUrl } = req.body;
  try {
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

    return res.status(201).json({
      message: 'Property created successfully',
      property: newProperty,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while creating the property' });
  }
};

const deleteProperty = async (req, res) => {
  const { propertyId } = req.body;
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
      return res.status(403).json({ message: 'Only advertiser users can delete properties' });
    }

    // Create the property with userId as both advertiserId and userId
    const property = await Property.findOne({ where: { id: propertyId } });

    // Check if the property exists
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Delete the property
    await property.destroy();

    return res.status(201).json({
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while creating the property' });
  }
};

const disableProperty = async (req, res) => {
  const { propertyId } = req.body;
  try {
    // Get token from the Authorization header
    // const token = req.headers.Authorization?.split(' ')[1];
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Decode the token
    const decoded = jwt.verify(token, config.jwt.secret);
    // console.log(decoded); //decoded.sub
    // const { sub: userId, role } = decoded;

    // Check if user exists and is an admin
    const data = await User.findOne({ where: { id: decoded.sub } });
    let user = data.dataValues;
    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only advertiser and admins can disable properties' });
    }

    // Create the property with userId as both advertiserId and userId
    const [updatedRows] = await Property.update(
      { status: 'disabled' },
      { where: { id: propertyId, status: 'active' } } // Only update if the current status is "active"
    );

    return res.status(201).json({
      message: 'Property disabled successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while creating the property' });
  }
};

const enableProperty = async (req, res) => {
  const { propertyId } = req.body;
  try {
    // Get token from the Authorization header
    // const token = req.headers.Authorization?.split(' ')[1];
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Decode the token
    const decoded = jwt.verify(token, config.jwt.secret);
    // console.log(decoded); //decoded.sub
    // const { sub: userId, role } = decoded;

    // Check if user exists and is an admin
    const data = await User.findOne({ where: { id: decoded.sub } });
    let user = data.dataValues;
    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only advertiser and admins can enable properties' });
    }

    // Create the property with userId as both advertiserId and userId
    const [updatedRows] = await Property.update(
      { status: 'active' },
      { where: { id: propertyId, status: 'disabled' } } // Only update if the current status is "active"
    );

    return res.status(201).json({
      message: 'Property enabled successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while enabling the property' });
  }
};

async function getSeekerProperties(req, res) {
  try {
    // Retrieve token from Authorization header
    const token = req.header('Authorization');
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Decode and verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
    // Check if the user role is 'Seeker'
    const user = await User.findByPk(decoded.sub);
    if (!user || user.role !== 'Seeker') {
      return res.status(403).json({ message: 'Access forbidden: Requires Seeker role.' });
    }

    // Fetch all properties with status 'active'
    const activeProperties = await Property.findAll({
      where: { status: 'active' },
    });

    res.status(200).json(activeProperties);
  } catch (error) {
    console.error('Error fetching active properties:', error);
    res.status(500).json({ message: 'Server error.' });
  }
}

async function getAdminProperties(req, res) {
  try {
    // Retrieve token from Authorization header
    const token = req.header('Authorization');
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Decode and verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
    // Check if the user role is 'Seeker'
    const user = await User.findByPk(decoded.sub);
    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access forbidden: Requires Admin role.' });
    }

    // Fetch all properties with status 'active'
    const activeProperties = await Property.findAll();

    res.status(200).json(activeProperties);
  } catch (error) {
    console.error('Error fetching active properties:', error);
    res.status(500).json({ message: 'Server error.' });
  }
}

async function getAdvertiserProperties(req, res) {
  try {
    // Retrieve token from Authorization header
    const token = req.header('Authorization');
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Decode and verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
    // Check if the user role is 'Seeker'
    const user = await User.findByPk(decoded.sub);
    if (!user || user.role !== 'Advertiser') {
      return res.status(403).json({ message: 'Access forbidden: Requires Advertiser role.' });
    }

    // Fetch all properties with status 'active'
    const activeProperties = await Property.findAll({
      where: {
        advertiserId: user.id,
      },
    });

    res.status(200).json(activeProperties);
  } catch (error) {
    console.error('Error fetching active properties:', error);
    res.status(500).json({ message: 'Server error.' });
  }
}

async function getSingleProperty(req, res) {
  try {
    // Retrieve token from Authorization header
    const token = req.header('Authorization');
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Decode and verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
    let userId = decoded.sub;

    const propertyId = req.header('PropertyId');

    // Fetch all properties with status 'active'
    const singleProperty = await Property.findByPk(propertyId);

    let advertiserId = singleProperty.advertiserId;

    const advertiser = await User.findByPk(advertiserId);

    res.status(200).json({ property: singleProperty, advertiser });
  } catch (error) {
    console.error('Error fetching active properties:', error);
    res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = {
  createProperty,
  deleteProperty,
  disableProperty,
  enableProperty,
  getSeekerProperties,
  getAdminProperties,
  getAdvertiserProperties,
  getSingleProperty,
};
