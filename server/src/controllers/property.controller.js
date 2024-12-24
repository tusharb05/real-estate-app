const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, propertyService } = require('../services');
const User = require('../models/user.model');
const Property = require('../models/property.model');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

const createProperty = async (req, res) => {
  // console.log(req.user);
  const { title, description, price, location, status, imageUrl } = req.body;
  try {
    const user = req.user;

    const newProperty = await Property.create({
      title,
      description,
      price,
      location,
      status,
      imageUrl,
      advertiserId: user.id,
      UserId: user.id,
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
    const user = req.user;

    const property = await Property.findOne({ where: { id: propertyId } });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

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
    const data = req.user;

    const [updatedRows] = await Property.update({ status: 'disabled' }, { where: { id: propertyId, status: 'active' } });

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
    const data = req.user;

    const [updatedRows] = await Property.update({ status: 'active' }, { where: { id: propertyId, status: 'disabled' } });

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
    const user = req.user;

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

    // Check if the user role is 'Seeker'
    const user = req.user;

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
