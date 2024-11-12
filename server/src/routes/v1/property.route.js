const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');
const propertyController = require('../../controllers/property.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const router = express.Router();

router.post('/create', propertyController.createProperty);
router.post('/delete', propertyController.deleteProperty);
router.post('/disable', propertyController.disableProperty);
router.post('/enable', propertyController.enableProperty);
router.get('/get-seeker-properties', propertyController.getSeekerProperties);
router.get('/get-admin-properties', propertyController.getAdminProperties);
router.get('/get-advertiser-properties', propertyController.getAdvertiserProperties);
router.get('/get-property-detail', propertyController.getSingleProperty);

module.exports = router;
