import express from 'express';
import { supabase } from '../utils/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/articles
 * Get all articles (public endpoint)
 * Optional query params: limit, offset, published
 */
router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0, published = 'true' } = req.query;

    let query = supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    // Filter by published status if specified
    if (published === 'true') {
      query = query.not('published_at', 'is', null);
    }

    // Apply pagination
    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: articles, error, count } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch articles'
      });
    }

    res.json({
      success: true,
      articles: articles || [],
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: count
      }
    });

  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching articles'
    });
  }
});

/**
 * GET /api/articles/:id
 * Get single article by ID (public endpoint)
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    res.json({
      success: true,
      article
    });

  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching the article'
    });
  }
});

/**
 * POST /api/articles
 * Create new article (requires authentication)
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      featured_image,
      image_public_id,
      author,
      published = false
    } = req.body;

    // Validate required fields
    if (!title || !content || !excerpt) {
      return res.status(400).json({
        success: false,
        error: 'Title, content, and excerpt are required'
      });
    }

    // Prepare article data
    const articleData = {
      title,
      content,
      excerpt,
      featured_image: featured_image || null,
      image_public_id: image_public_id || null,
      image_source: req.body.image_source || null,
      author: author || null,
      published_at: published ? new Date().toISOString() : null
    };

    const { data: article, error } = await supabase
      .from('articles')
      .insert(articleData)
      .select()
      .single();

    if (error) {
      console.error('Error creating article:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create article'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      article
    });

  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while creating the article'
    });
  }
});

/**
 * PUT /api/articles/:id
 * Update article (requires authentication)
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      featured_image,
      image_public_id,
      author,
      published
    } = req.body;

    // Check if article exists
    const { data: existingArticle, error: checkError } = await supabase
      .from('articles')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingArticle) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Prepare update data (only include provided fields)
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (featured_image !== undefined) updateData.featured_image = featured_image;
    if (image_public_id !== undefined) updateData.image_public_id = image_public_id;
    if (req.body.image_source !== undefined) updateData.image_source = req.body.image_source;
    if (author !== undefined) updateData.author = author;
    
    // Handle published status
    if (published !== undefined) {
      updateData.published_at = published ? new Date().toISOString() : null;
    }

    updateData.updated_at = new Date().toISOString();

    const { data: article, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating article:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update article'
      });
    }

    res.json({
      success: true,
      message: 'Article updated successfully',
      article
    });

  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while updating the article'
    });
  }
});

/**
 * DELETE /api/articles/:id
 * Delete article (requires authentication)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if article exists
    const { data: existingArticle, error: checkError } = await supabase
      .from('articles')
      .select('id, image_public_id')
      .eq('id', id)
      .single();

    if (checkError || !existingArticle) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Delete the article
    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting article:', deleteError);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete article'
      });
    }

    // TODO: Optionally delete the image from Cloudinary
    // if (existingArticle.image_public_id) {
    //   await deleteImage(existingArticle.image_public_id);
    // }

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });

  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while deleting the article'
    });
  }
});

/**
 * PATCH /api/articles/:id/publish
 * Publish/unpublish article (requires authentication)
 */
router.patch('/:id/publish', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { published } = req.body;

    const { data: article, error } = await supabase
      .from('articles')
      .update({
        published_at: published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating article status:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update article status'
      });
    }

    res.json({
      success: true,
      message: `Article ${published ? 'published' : 'unpublished'} successfully`,
      article
    });

  } catch (error) {
    console.error('Publish article error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while updating article status'
    });
  }
});

export default router;
