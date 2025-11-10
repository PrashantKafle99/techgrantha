import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ImageUpload } from '../components/ImageUpload';
import { AIImageGenerator } from '../components/AIImageGenerator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  image_public_id: string;
  image_source: string | null;
  author: string;
  published_at: string;
  created_at: string;
}

export function ArticleManagementPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    image_public_id: '',
    image_source: '',
    author: user?.email || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/articles?published=false`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      featured_image: '',
      image_public_id: '',
      image_source: '',
      author: '' // Start empty, will use user email if left empty
    });
    setEditingArticle(null);
    setError(null);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (article: Article) => {
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      featured_image: article.featured_image,
      image_public_id: article.image_public_id,
      image_source: article.image_source || '',
      author: article.author
    });
    setEditingArticle(article);
    setError(null);
    setShowCreateModal(true);
  };

  const handleImageUpload = (url: string, publicId: string) => {
    setFormData(prev => ({
      ...prev,
      featured_image: url,
      image_public_id: publicId
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Allow null author if not provided
      const articleData = {
        ...formData,
        author: formData.author.trim() || null
      };

      const url = editingArticle 
        ? `${API_URL}/api/articles/${editingArticle.id}`
        : `${API_URL}/api/articles`;
      
      const method = editingArticle ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save article');
      }
      
      // Close modal and refresh list
      setShowCreateModal(false);
      fetchArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setArticleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/articles/${articleToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete article');
      }

      fetchArticles();
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    } catch (err) {
      console.error('Error deleting article:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-4 sm:h-16 sm:py-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-900 shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="font-serif text-xl sm:text-2xl text-gray-900">Tech Grantha</h1>
                <p className="text-xs sm:text-sm text-gray-500">Article Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="text-left sm:text-right flex-1 sm:flex-none">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="shrink-0">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <CardTitle>Articles</CardTitle>
                <CardDescription>Manage your blog articles</CardDescription>
              </div>
              <Button onClick={handleOpenCreate} className="w-full sm:w-auto">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Article
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">Loading articles...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No articles</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new article.</p>
                <div className="mt-6">
                  <Button onClick={handleOpenCreate}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Article
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div key={article.id} className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    {article.featured_image && (
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="w-full sm:w-32 h-auto sm:h-18 object-cover rounded"
                        style={{ aspectRatio: '16/9' }}
                      />
                    )}
                    <div className="flex-1 min-w-0 w-full">
                      <h3 className="font-medium text-gray-900 line-clamp-2 sm:line-clamp-1">{article.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{article.excerpt}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        {article.author && <span>{article.author}</span>}
                        {article.author && <span>•</span>}
                        <span>{new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto sm:flex-shrink-0">
                      <Button size="sm" variant="outline" onClick={() => handleOpenEdit(article)} className="flex-1 sm:flex-none">
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                        onClick={() => handleDeleteClick(article.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle>{editingArticle ? 'Edit Article' : 'Create New Article'}</DialogTitle>
            <DialogDescription>
              {editingArticle ? 'Update your article details' : 'Add a new article to your blog'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                  {error}
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter article title"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the article"
                  rows={2}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Featured Image */}
              <div className="space-y-4">
                <Label>Featured Image *</Label>
                
                {/* AI Image Generator */}
                <AIImageGenerator
                  title={formData.title}
                  content={formData.content}
                  type="article"
                  onImageGenerated={handleImageUpload}
                />

                {/* Manual Upload */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or upload manually</span>
                  </div>
                </div>

                <ImageUpload
                  type="article"
                  currentImage={formData.featured_image}
                  onUploadSuccess={handleImageUpload}
                  onUploadError={(err) => setError(err)}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your article content here..."
                  rows={10}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Image Source */}
              <div className="space-y-2">
                <Label htmlFor="image_source">Image Source/Credit (Optional)</Label>
                <Input
                  id="image_source"
                  value={formData.image_source}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_source: e.target.value }))}
                  placeholder="e.g., Unsplash, Photographer name, Stock photo site"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">
                  Add image attribution or source for manually uploaded images
                </p>
              </div>

              {/* Author */}
              <div className="space-y-2">
                <Label htmlFor="author">Author (Optional)</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Leave empty for no author"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">
                  Enter a custom author name or leave empty
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.content || !formData.featured_image}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  editingArticle ? 'Update Article' : 'Create Article'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setArticleToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ArticleManagementPage;
