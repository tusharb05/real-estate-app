const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');
const propertyController = require('../../controllers/property.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, propertyController.createProperty);
router.post('/delete', authMiddleware, propertyController.deleteProperty);
router.post('/disable', authMiddleware, propertyController.disableProperty);
router.post('/enable', authMiddleware, propertyController.enableProperty);
router.get('/get-seeker-properties', authMiddleware, propertyController.getSeekerProperties);
router.get('/get-admin-properties', authMiddleware, propertyController.getAdminProperties);
router.get('/get-advertiser-properties', authMiddleware, propertyController.getAdvertiserProperties);
router.get('/get-property-detail', authMiddleware, propertyController.getSingleProperty);

module.exports = router;
