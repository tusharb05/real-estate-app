const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');
const propertyController = require('../../controllers/property.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const router = express.Router();

// router.post('/create', authMiddleware, propertyController.createProperty);
router.post('/create', auth('createProperty'), propertyController.createProperty);
router.post('/delete', auth('deleteProperty'), propertyController.deleteProperty);
router.post('/disable', auth('manageProperty'), propertyController.disableProperty);
router.post('/enable', auth('manageProperty'), propertyController.enableProperty);
// router.get('/get-seeker-properties', authMiddleware, propertyController.getSeekerProperties);
router.get('/get-seeker-properties', auth('getProperty'), propertyController.getSeekerProperties);
router.get('/get-admin-properties', auth('getProperty'), propertyController.getAdminProperties);
router.get('/get-advertiser-properties', auth('getProperty'), propertyController.getAdvertiserProperties);
router.get('/get-property-detail', auth('getProperty'), propertyController.getSingleProperty);

module.exports = router;
