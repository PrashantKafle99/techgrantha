import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param {string} fileBuffer - Base64 encoded image or file path
 * @param {object} options - Upload options
 * @returns {Promise<object>} - Upload result with URL and public_id
 */
export async function uploadImage(fileBuffer, options = {}) {
  try {
    const {
      folder = 'tech-grantha',
      resourceType = 'image',
      transformation = {},
      tags = []
    } = options;

    const uploadOptions = {
      folder,
      resource_type: resourceType,
      tags,
      // Optimize images automatically
      quality: 'auto',
      fetch_format: 'auto',
      ...transformation
    };

    const result = await cloudinary.uploader.upload(fileBuffer, uploadOptions);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Array of file buffers
 * @param {object} options - Upload options
 * @returns {Promise<Array>} - Array of upload results
 */
export async function uploadMultipleImages(files, options = {}) {
  try {
    const uploadPromises = files.map(file => uploadImage(file, options));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw new Error(`Multiple image upload failed: ${error.message}`);
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<object>} - Deletion result
 */
export async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      return {
        success: true,
        message: 'Image deleted successfully'
      };
    } else {
      return {
        success: false,
        message: 'Image not found or already deleted'
      };
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Image deletion failed: ${error.message}`);
  }
}

/**
 * Delete multiple images from Cloudinary
 * @param {Array<string>} publicIds - Array of public IDs to delete
 * @returns {Promise<object>} - Deletion result
 */
export async function deleteMultipleImages(publicIds) {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return {
      success: true,
      deleted: result.deleted,
      message: `${Object.keys(result.deleted).length} images deleted successfully`
    };
  } catch (error) {
    console.error('Multiple delete error:', error);
    throw new Error(`Multiple image deletion failed: ${error.message}`);
  }
}

/**
 * Get image details from Cloudinary
 * @param {string} publicId - Public ID of the image
 * @returns {Promise<object>} - Image details
 */
export async function getImageDetails(publicId) {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      createdAt: result.created_at
    };
  } catch (error) {
    console.error('Get image details error:', error);
    throw new Error(`Failed to get image details: ${error.message}`);
  }
}

/**
 * Generate transformation URL for an image
 * @param {string} publicId - Public ID of the image
 * @param {object} transformations - Transformation options
 * @returns {string} - Transformed image URL
 */
export function getTransformedImageUrl(publicId, transformations = {}) {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = transformations;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: format,
    secure: true
  });
}

/**
 * Generate thumbnail URL
 * @param {string} publicId - Public ID of the image
 * @param {number} size - Thumbnail size (default: 200)
 * @returns {string} - Thumbnail URL
 */
export function getThumbnailUrl(publicId, size = 200) {
  return getTransformedImageUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill'
  });
}

/**
 * Validate image file
 * @param {object} file - File object with mimetype and size
 * @param {object} options - Validation options
 * @returns {object} - Validation result
 */
export function validateImageFile(file, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10 MB default
    allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  } = options;

  const errors = [];

  // Check file type
  if (!allowedFormats.includes(file.mimetype)) {
    errors.push(`Invalid file type. Allowed: ${allowedFormats.join(', ')}`);
  }

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File too large. Maximum size: ${maxSize / (1024 * 1024)} MB`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
export function extractPublicId(url) {
  try {
    // Example URL: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/image.jpg
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL');
    }

    // Get everything after 'upload/'
    let pathParts = parts.slice(uploadIndex + 1);
    
    // Skip version number if present (starts with 'v' followed by digits)
    if (pathParts[0] && /^v\d+$/.test(pathParts[0])) {
      pathParts = pathParts.slice(1);
    }
    
    const publicIdWithExtension = pathParts.join('/');
    
    // Remove file extension
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '');
    
    return publicId;
  } catch (error) {
    console.error('Extract public ID error:', error);
    return null;
  }
}

/**
 * Upload image for articles
 * @param {string} fileBuffer - Base64 encoded image
 * @returns {Promise<object>} - Upload result
 */
export async function uploadArticleImage(fileBuffer) {
  return uploadImage(fileBuffer, {
    folder: 'tech-grantha/articles',
    tags: ['article', 'tech-grantha'],
    transformation: {
      width: 1920,
      height: 1080,
      crop: 'limit' // Don't upscale, only downscale if larger
    }
  });
}

/**
 * Upload image for daily tech updates
 * @param {string} fileBuffer - Base64 encoded image
 * @returns {Promise<object>} - Upload result
 */
export async function uploadDailyTechImage(fileBuffer) {
  return uploadImage(fileBuffer, {
    folder: 'tech-grantha/daily-tech',
    tags: ['daily-tech', 'tech-grantha'],
    transformation: {
      width: 1200,
      height: 630,
      crop: 'limit'
    }
  });
}

/**
 * Get Cloudinary configuration status
 * @returns {object} - Configuration status
 */
export function getCloudinaryStatus() {
  return {
    configured: !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'Not configured'
  };
}

export default {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  getImageDetails,
  getTransformedImageUrl,
  getThumbnailUrl,
  validateImageFile,
  extractPublicId,
  uploadArticleImage,
  uploadDailyTechImage,
  getCloudinaryStatus
};
