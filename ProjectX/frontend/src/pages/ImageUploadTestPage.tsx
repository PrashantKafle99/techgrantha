import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '../components/ImageUpload';

export function ImageUploadTestPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [articleImage, setArticleImage] = useState<{ url: string; publicId: string } | null>(null);
  const [dailyTechImage, setDailyTechImage] = useState<{ url: string; publicId: string } | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleArticleUpload = (url: string, publicId: string) => {
    setArticleImage({ url, publicId });
    console.log('Article image uploaded:', { url, publicId });
  };

  const handleDailyTechUpload = (url: string, publicId: string) => {
    setDailyTechImage({ url, publicId });
    console.log('Daily tech image uploaded:', { url, publicId });
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="font-serif text-2xl text-gray-900">Tech Grantha</h1>
                <p className="text-sm text-gray-500">Image Upload Test</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-serif text-gray-900 mb-2">
            Image Upload Component Test
          </h2>
          <p className="text-gray-600">
            Test the image upload functionality with drag-and-drop support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Article Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Article Image Upload</CardTitle>
              <CardDescription>
                Upload images for articles (max 1920x1080)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                type="article"
                onUploadSuccess={handleArticleUpload}
                onUploadError={handleUploadError}
              />
              
              {articleImage && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm font-medium text-green-900 mb-2">Upload Successful!</p>
                  <div className="text-xs text-green-700 space-y-1">
                    <p><strong>URL:</strong> {articleImage.url}</p>
                    <p><strong>Public ID:</strong> {articleImage.publicId}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Tech Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Tech Image Upload</CardTitle>
              <CardDescription>
                Upload images for daily tech updates (max 1200x630)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                type="daily-tech"
                onUploadSuccess={handleDailyTechUpload}
                onUploadError={handleUploadError}
              />
              
              {dailyTechImage && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm font-medium text-green-900 mb-2">Upload Successful!</p>
                  <div className="text-xs text-green-700 space-y-1">
                    <p><strong>URL:</strong> {dailyTechImage.url}</p>
                    <p><strong>Public ID:</strong> {dailyTechImage.publicId}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features List */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Component Features</CardTitle>
            <CardDescription>What's included in the ImageUpload component</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Drag & Drop</p>
                  <p className="text-sm text-gray-600">Drag images directly onto the upload area</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Image Preview</p>
                  <p className="text-sm text-gray-600">See your image before uploading</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">File Validation</p>
                  <p className="text-sm text-gray-600">Automatic type and size validation</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Progress Indicator</p>
                  <p className="text-sm text-gray-600">Visual feedback during upload</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Replace/Remove</p>
                  <p className="text-sm text-gray-600">Easy image management</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Error Handling</p>
                  <p className="text-sm text-gray-600">Clear error messages</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default ImageUploadTestPage;
