# Frontend Image Upload - Complete Guide

## ✅ What's Been Implemented

### 1. **ImageUpload Component** (`frontend/src/components/ImageUpload.tsx`)

A fully-featured, reusable image upload component with:

#### Features:
- ✅ **Drag & Drop Support** - Drag images directly onto the upload area
- ✅ **Click to Upload** - Traditional file picker
- ✅ **Image Preview** - See images before and after upload
- ✅ **Progress Indicator** - Visual feedback during upload
- ✅ **File Validation** - Automatic type and size checking
- ✅ **Error Handling** - Clear error messages
- ✅ **Replace/Remove** - Easy image management
- ✅ **TypeScript Support** - Full type safety
- ✅ **Responsive Design** - Works on all screen sizes

#### Props:
```typescript
interface ImageUploadProps {
  onUploadSuccess: (imageUrl: string, publicId: string) => void;
  onUploadError?: (error: string) => void;
  type?: 'article' | 'daily-tech' | 'generic';
  currentImage?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}
```

### 2. **Test Page** (`frontend/src/pages/ImageUploadTestPage.tsx`)

A demo page to test the upload functionality with:
- Side-by-side article and daily tech upload demos
- Success feedback with URL and Public ID
- Feature list showcase
- Full admin panel integration

### 3. **Routes Added**
- `/admin/test-upload` - Image upload test page (protected route)

## 🎨 Usage Examples

### Basic Usage

```typescript
import { ImageUpload } from '../components/ImageUpload';

function MyComponent() {
  const handleUploadSuccess = (url: string, publicId: string) => {
    console.log('Image uploaded:', url);
    // Save to your form state
  };

  return (
    <ImageUpload
      type="article"
      onUploadSuccess={handleUploadSuccess}
    />
  );
}
```

### With Current Image

```typescript
<ImageUpload
  type="article"
  currentImage="https://res.cloudinary.com/..."
  onUploadSuccess={handleUploadSuccess}
  onUploadError={(error) => console.error(error)}
/>
```

### Custom Configuration

```typescript
<ImageUpload
  type="generic"
  maxSizeMB={5}
  acceptedFormats={['image/jpeg', 'image/png']}
  onUploadSuccess={handleUploadSuccess}
/>
```

## 🚀 How to Test

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend dev server:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Login to admin panel:**
   - Go to `http://localhost:5173/admin/login`
   - Email: `admin@techgrantha.com`
   - Password: `certificate@123`

4. **Test the upload:**
   - Click "Test Upload" button on dashboard
   - Or navigate to `/admin/test-upload`
   - Try both drag-and-drop and click-to-upload
   - Test with different image types and sizes

## 📝 Integration with Forms

### Article Creation Form Example

```typescript
import { useState } from 'react';
import { ImageUpload } from '../components/ImageUpload';

function CreateArticleForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featuredImage: '',
    featuredImagePublicId: ''
  });

  const handleImageUpload = (url: string, publicId: string) => {
    setFormData(prev => ({
      ...prev,
      featuredImage: url,
      featuredImagePublicId: publicId
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit formData to your API
    console.log('Submitting:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>

      <div>
        <label>Featured Image</label>
        <ImageUpload
          type="article"
          currentImage={formData.featuredImage}
          onUploadSuccess={handleImageUpload}
        />
      </div>

      <div>
        <label>Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
        />
      </div>

      <button type="submit">Create Article</button>
    </form>
  );
}
```

## 🎯 Next Steps

### 1. **Integrate with Article Management**
- Create article creation form
- Add image upload to article editor
- Store image URLs in database

### 2. **Integrate with Daily Tech Management**
- Create daily tech creation form
- Add image upload
- Store image URLs in database

### 3. **Add Image Gallery**
- View all uploaded images
- Delete/manage images
- Image search and filter

### 4. **Optional Enhancements**
- Image cropping tool
- Multiple image upload for galleries
- Image compression options
- Thumbnail generation

## 🔧 Component Customization

### Styling
The component uses Tailwind CSS and shadcn/ui components. You can customize:
- Colors via Tailwind classes
- Card styling
- Button variants
- Upload area design

### Behavior
You can customize:
- Max file size (default: 10 MB)
- Accepted formats (default: JPG, PNG, WebP, GIF)
- Upload endpoint (article, daily-tech, generic)
- Error handling
- Success callbacks

## 📊 Component States

The ImageUpload component handles these states:
- **Idle** - Waiting for file selection
- **Drag Active** - User is dragging a file over the component
- **Uploading** - File is being uploaded (shows progress)
- **Success** - Upload complete (shows preview with actions)
- **Error** - Upload failed (shows error message)

## 🐛 Troubleshooting

### Upload fails with "Unauthorized"
- Check that you're logged in
- Verify the auth token is valid
- Check backend server is running

### Image doesn't appear after upload
- Check browser console for errors
- Verify Cloudinary credentials in backend
- Check network tab for API response

### Drag and drop doesn't work
- Ensure you're using a modern browser
- Check for JavaScript errors
- Try click-to-upload as fallback

## 📚 Resources

- **Component**: `frontend/src/components/ImageUpload.tsx`
- **Test Page**: `frontend/src/pages/ImageUploadTestPage.tsx`
- **Backend API**: `backend/IMAGE_UPLOAD_GUIDE.md`
- **Cloudinary Setup**: `backend/CLOUDINARY_SETUP.md`

---

**Status**: ✅ Frontend image upload system is complete and ready to use!

**Test it now**: Login to admin panel → Click "Test Upload" button → Try uploading images!
