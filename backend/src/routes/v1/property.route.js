// backend/src/routes/v1/property.route.js
const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const propertyController = require('../../controllers/property.controller');
const { uploadProperty } = require('../../utils/uploadHelper');

// Public routes (no authentication required)
router.get('/search', propertyController.searchProperties);
router.get('/nearby', propertyController.getNearbyProperties);
router.get('/', propertyController.getAllProperties);
//router.get('/:id', propertyController.getPropertyById);

// Protected routes (authentication required)
router.use(auth()); // Apply auth middleware to all routes below

router.get('/my-properties', propertyController.getMyProperties);
router.get('/favorites', propertyController.getFavorites);
router.post('/', propertyController.createProperty);
router.put('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);
router.post('/:id/favorite', propertyController.addToFavorites);
router.delete('/:id/favorite', propertyController.removeFromFavorites);
router.get('/:id', propertyController.getPropertyById);

// Thêm route upload property images (cần auth)
router.post('/upload', uploadProperty.array('images', 5), propertyController.uploadPropertyImages);

module.exports = router;