import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { uploadSingle, uploadMultiple, handleUploadError } from '../middleware/upload.js';
import {
  uploadArticleImage,
  uploadDailyTechImage,
  deleteImage,
  uploadImage
} from '../utils/cloudinary.js';

const router = express.Router();

/**
 * POST /api/upload/article-image
 * Upload image for article
 * Requires: Authorization header with Bearer token
 * Requires: multipart/form-data with 'image' field
 */
router.post('/article-image', authenticateToken, uploadSingle, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    // Convert buffer to base64 data URI
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await uploadArticleImage(base64Image);

    res.json({
      success: true,
      message: 'Article image uploaded successfully',
      image: {
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes
      }
    });

  } catch (error) {
    console.error('Article image upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload article image',
      details: error.message
    });
  }
});

/**
 * POST /api/upload/daily-tech-image
 * Upload image for daily tech update
 * Requires: Authorization header with Bearer token
 * Requires: multipart/form-data with 'image' field
 */
router.post('/daily-tech-image', authenticateToken, uploadSingle, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    // Convert buffer to base64 data URI
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await uploadDailyTechImage(base64Image);

    res.json({
      success: true,
      message: 'Daily tech image uploaded successfully',
      image: {
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes
      }
    });

  } catch (error) {
    console.error('Daily tech image upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload daily tech image',
      details: error.message
    });
  }
});

/**
 * POST /api/upload/image
 * Generic image upload endpoint
 * Requires: Authorization header with Bearer token
 * Requires: multipart/form-data with 'image' field
 * Optional: folder query parameter
 */
router.post('/image', authenticateToken, uploadSingle, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    const folder = req.query.folder || 'tech-grantha/general';

    // Convert buffer to base64 data URI
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await uploadImage(base64Image, {
      folder,
      tags: ['tech-grantha']
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      image: {
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes
      }
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image',
      details: error.message
    });
  }
});

/**
 * POST /api/upload/multiple-images
 * Upload multiple images at once
 * Requires: Authorization header with Bearer token
 * Requires: multipart/form-data with 'images' field (array)
 * Optional: folder query parameter
 */
router.post('/multiple-images', authenticateToken, uploadMultiple, handleUploadError, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No image files provided'
      });
    }

    const folder = req.query.folder || 'tech-grantha/general';

    // Upload all images
    const uploadPromises = req.files.map(async (file) => {
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      return await uploadImage(base64Image, {
        folder,
        tags: ['tech-grantha']
      });
    });

    const results = await Promise.all(uploadPromises);

    const images = results.map(result => ({
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    }));

    res.json({
      success: true,
      message: `${images.length} images uploaded successfully`,
      images
    });

  } catch (error) {
    console.error('Multiple images upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload images',
      details: error.message
    });
  }
});

/**
 * DELETE /api/upload/image/:publicId
 * Delete image from Cloudinary
 * Requires: Authorization header with Bearer token
 * Note: publicId should be URL encoded (replace / with %2F)
 */
router.delete('/image/:publicId(*)', authenticateToken, async (req, res) => {
  try {
    const publicId = req.params.publicId;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        error: 'Public ID is required'
      });
    }

    const result = await deleteImage(publicId);

    if (result.success) {
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.message
      });
    }

  } catch (error) {
    console.error('Image delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete image',
      details: error.message
    });
  }
});

/**
 * GET /api/upload/test
 * Test endpoint to verify upload routes are working
 */
router.get('/test', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Upload routes are working!',
    endpoints: {
      articleImage: 'POST /api/upload/article-image',
      dailyTechImage: 'POST /api/upload/daily-tech-image',
      genericImage: 'POST /api/upload/image',
      multipleImages: 'POST /api/upload/multiple-images',
      deleteImage: 'DELETE /api/upload/image/:publicId'
    }
  });
});

export default router;
