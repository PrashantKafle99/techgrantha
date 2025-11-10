import multer from 'multer';
import { validateImageFile } from '../utils/cloudinary.js';

// Configure multer to use memory storage (files stored in memory as Buffer)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  const validation = validateImageFile(file);
  
  if (validation.isValid) {
    cb(null, true);
  } else {
    cb(new Error(validation.errors.join(', ')), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
    files: 5 // Max 5 files per request
  }
});

// Single file upload middleware
export const uploadSingle = upload.single('image');

// Multiple files upload middleware (max 5)
export const uploadMultiple = upload.array('images', 5);

// Error handling middleware for multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 10 MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Maximum is 5 files'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Unexpected field name. Use "image" for single or "images" for multiple'
      });
    }
    
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`
    });
  }
  
  if (err) {
    // Other errors (like file validation errors)
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  
  next();
};

export default {
  uploadSingle,
  uploadMultiple,
  handleUploadError
};
