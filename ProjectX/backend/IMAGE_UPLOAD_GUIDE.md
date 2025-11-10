# Image Upload System - Complete Guide

## ✅ What's Been Implemented

Your image upload system is now fully functional with:

### 1. **Cloudinary Integration** ✅
- Cloud storage configured and tested
- Automatic image optimization
- CDN delivery for fast loading
- Organized folder structure

### 2. **Backend Upload Utilities** ✅
- `backend/utils/cloudinary.js` - Complete utility functions
- Image validation (type, size)
- Upload, delete, transform functions
- Specialized functions for articles and daily tech

### 3. **Upload Middleware** ✅
- `backend/middleware/upload.js` - Multer configuration
- File size limits (10 MB max)
- File type validation
- Error handling

### 4. **Upload API Endpoints** ✅
- `POST /api/upload/article-image` - Upload article images
- `POST /api/upload/daily-tech-image` - Upload daily tech images
- `POST /api/upload/image` - Generic image upload
- `POST /api/upload/multiple-images` - Batch upload
- `DELETE /api/upload/image/:publicId` - Delete images
- `GET /api/upload/test` - Test endpoint

## 📋 API Endpoints Reference

### Upload Article Image
```bash
POST /api/upload/article-image
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- image: (file) - Image file to upload

Response:
{
  "success": true,
  "message": "Article image uploaded successfully",
  "image": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "tech-grantha/articles/...",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "size": 245678
  }
}
```

### Upload Daily Tech Image
```bash
POST /api/upload/daily-tech-image
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- image: (file) - Image file to upload

Response: Same as article image
```

### Generic Image Upload
```bash
POST /api/upload/image?folder=custom-folder
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- image: (file) - Image file to upload

Query Parameters:
- folder (optional): Custom folder path (default: tech-grantha/general)
```

### Upload Multiple Images
```bash
POST /api/upload/multiple-images?folder=custom-folder
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- images: (files) - Multiple image files (max 5)

Response:
{
  "success": true,
  "message": "3 images uploaded successfully",
  "images": [
    { "url": "...", "publicId": "...", ... },
    { "url": "...", "publicId": "...", ... },
    { "url": "...", "publicId": "...", ... }
  ]
}
```

### Delete Image
```bash
DELETE /api/upload/image/{publicId}
Authorization: Bearer {token}

Example:
DELETE /api/upload/image/tech-grantha/articles/sample

Response:
{
  "success": true,
  "message": "Image deleted successfully"
}
```

## 🧪 Testing the Endpoints

### Using curl (Windows CMD)

1. **Login first:**
```cmd
curl -X POST http://localhost:3000/api/admin/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@techgrantha.com\",\"password\":\"certificate@123\"}"
```

2. **Upload an image:**
```cmd
curl -X POST http://localhost:3000/api/upload/article-image ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -F "image=@C:\path\to\your\image.jpg"
```

### Using Postman

1. **Login:**
   - Method: POST
   - URL: `http://localhost:3000/api/admin/login`
   - Body (JSON):
     ```json
     {
       "email": "admin@techgrantha.com",
       "password": "certificate@123"
     }
     ```
   - Copy the `token` from response

2. **Upload Image:**
   - Method: POST
   - URL: `http://localhost:3000/api/upload/article-image`
   - Headers:
     - `Authorization`: `Bearer {your-token}`
   - Body (form-data):
     - Key: `image`
     - Type: File
     - Value: Select your image file

## 🎨 Frontend Integration (Next Steps)

Now you need to create frontend components to use these endpoints:

### 1. Image Upload Component
Create a reusable upload component with:
- Drag-and-drop support
- File preview
- Progress indicator
- Error handling

### 2. Article Form Integration
Add image upload to article creation/editing:
- Featured image upload
- Multiple image gallery
- Image preview and management

### 3. Daily Tech Form Integration
Add image upload to daily tech updates:
- Single image upload
- Image preview
- Replace/delete options

## 📝 Example Frontend Code

### React Image Upload Component (Basic)

```typescript
import { useState } from 'react';

interface ImageUploadProps {
  onUploadSuccess: (imageUrl: string, publicId: string) => void;
  type: 'article' | 'daily-tech';
}

export function ImageUpload({ onUploadSuccess, type }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('admin_token');
      const endpoint = type === 'article' 
        ? '/api/upload/article-image'
        : '/api/upload/daily-tech-image';

      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        onUploadSuccess(data.image.url, data.image.publicId);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (error) {
      alert('Upload error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: '200px' }} />}
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
```

## 🔒 Security Features

- ✅ JWT authentication required for all uploads
- ✅ File type validation (images only)
- ✅ File size limits (10 MB max)
- ✅ Automatic image optimization
- ✅ Organized folder structure
- ✅ Public ID tracking for deletion

## 📊 Image Specifications

### Article Images
- **Folder**: `tech-grantha/articles`
- **Max Dimensions**: 1920x1080
- **Optimization**: Auto quality, auto format
- **Allowed Formats**: JPG, PNG, WebP, GIF

### Daily Tech Images
- **Folder**: `tech-grantha/daily-tech`
- **Max Dimensions**: 1200x630
- **Optimization**: Auto quality, auto format
- **Allowed Formats**: JPG, PNG, WebP, GIF

## 🚀 What's Next?

1. **Build Frontend Upload Components**
   - Create reusable ImageUpload component
   - Add drag-and-drop support
   - Implement image preview
   - Add progress indicators

2. **Integrate with Forms**
   - Add to article creation form
   - Add to daily tech creation form
   - Add image management UI

3. **Add Image Gallery**
   - View uploaded images
   - Delete/replace images
   - Image transformations (crop, resize)

4. **Optional Enhancements**
   - Image cropping tool
   - Multiple image upload
   - Image gallery management
   - Thumbnail generation

## 📚 Resources

- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Multer Docs**: https://github.com/expressjs/multer
- **React Dropzone**: https://react-dropzone.js.org/ (for drag-and-drop)

---

**Status**: ✅ Backend image upload system is complete and ready for frontend integration!
