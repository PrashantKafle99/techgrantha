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

interface Update {
  id: string;
  title: string;
  summary: string;
  thumbnail_url: string;
  image_source?: string | null;
  created_at: string;
}

export function UpdateManagementPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    thumbnail_url: '',
    image_source: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateToDelete, setUpdateToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/updates`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setUpdates(data.updates);
      }
    } catch (err) {
      console.error('Error fetching updates:', err);
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
      summary: '',
      thumbnail_url: '',
      image_source: ''
    });
    setEditingUpdate(null);
    setError(null);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (update: Update) => {
    setFormData({
      title: update.title,
      summary: update.summary,
      thumbnail_url: update.thumbnail_url,
      image_source: update.image_source || ''
    });
    setEditingUpdate(update);
    setError(null);
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = editingUpdate 
        ? `${API_URL}/api/updates/${editingUpdate.id}`
        : `${API_URL}/api/updates`;
      
      const method = editingUpdate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setShowCreateModal(false);
        fetchUpdates();
      } else {
        setError(data.error || 'Failed to save update');
      }
    } catch (err) {
      setError('An error occurred while saving the update');
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setUpdateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!updateToDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/updates/${updateToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        fetchUpdates();
        setDeleteDialogOpen(false);
        setUpdateToDelete(null);
      } else {
        alert('Failed to delete update');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting the update');
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, thumbnail_url: url }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Update Management</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage daily tech updates</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-600 truncate flex-1 sm:flex-none">
                {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/dashboard')} className="shrink-0">
                Dashboard
              </Button>
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
                <CardTitle>Daily Tech Updates</CardTitle>
                <CardDescription>Create and manage daily tech updates</CardDescription>
              </div>
              <Button onClick={handleOpenCreate} className="w-full sm:w-auto">
                Create New Update
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading updates...</p>
              </div>
            ) : updates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No updates yet. Create your first one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <img
                      src={update.thumbnail_url}
                      alt={update.title}
                      className="w-full sm:w-24 h-auto sm:h-16 object-cover rounded"
                      style={{ aspectRatio: '3/2' }}
                    />
                    <div className="flex-1 min-w-0 w-full">
                      <h3 className="font-medium text-gray-900 line-clamp-2 sm:line-clamp-1">{update.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{update.summary}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(update.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto sm:flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(update)}
                        className="flex-1 sm:flex-none"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                        onClick={() => handleDeleteClick(update.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUpdate ? 'Edit Update' : 'Create New Update'}
            </DialogTitle>
            <DialogDescription>
              {editingUpdate ? 'Update the details below' : 'Fill in the details for the new update'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
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
                  placeholder="Enter update title"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Label htmlFor="summary">Summary *</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Enter update summary"
                  required
                  disabled={isSubmitting}
                  rows={4}
                />
              </div>

              {/* Thumbnail Image */}
              <div className="space-y-4">
                <Label>Thumbnail Image *</Label>
                
                {/* AI Image Generator */}
                <AIImageGenerator
                  title={formData.title}
                  content={formData.summary}
                  type="daily-tech"
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
                  onUploadSuccess={handleImageUpload}
                  currentImage={formData.thumbnail_url}
                  type="daily-tech"
                />
                
                {formData.thumbnail_url && (
                  <div className="mt-2">
                    <img
                      src={formData.thumbnail_url}
                      alt="Thumbnail preview"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                )}
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingUpdate ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this update? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUpdateToDelete(null)}>Cancel</AlertDialogCancel>
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

export default UpdateManagementPage;
