import express from 'express';
import { supabase } from '../utils/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/updates
 * Get all updates (public endpoint)
 * Optional query params: limit, offset
 */
router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('updates')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply pagination
    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: updates, error, count } = await query;

    if (error) {
      console.error('Error fetching updates:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch updates'
      });
    }

    res.json({
      success: true,
      updates: updates || [],
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: count
      }
    });

  } catch (error) {
    console.error('Get updates error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching updates'
    });
  }
});

/**
 * GET /api/updates/:id
 * Get single update by ID (public endpoint)
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: update, error } = await supabase
      .from('updates')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !update) {
      return res.status(404).json({
        success: false,
        error: 'Update not found'
      });
    }

    res.json({
      success: true,
      update
    });

  } catch (error) {
    console.error('Get update error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching the update'
    });
  }
});

/**
 * POST /api/updates
 * Create new update (requires authentication)
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      summary,
      thumbnail_url
    } = req.body;

    // Validate required fields
    if (!title || !summary || !thumbnail_url) {
      return res.status(400).json({
        success: false,
        error: 'Title, summary, and thumbnail URL are required'
      });
    }

    // Prepare update data
    const updateData = {
      title,
      summary,
      thumbnail_url,
      image_source: req.body.image_source || null
    };

    const { data: update, error } = await supabase
      .from('updates')
      .insert(updateData)
      .select()
      .single();

    if (error) {
      console.error('Error creating update:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create update'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Update created successfully',
      update
    });

  } catch (error) {
    console.error('Create update error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while creating the update'
    });
  }
});

/**
 * PUT /api/updates/:id
 * Update an existing update (requires authentication)
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      summary,
      thumbnail_url
    } = req.body;

    // Check if update exists
    const { data: existingUpdate, error: checkError } = await supabase
      .from('updates')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingUpdate) {
      return res.status(404).json({
        success: false,
        error: 'Update not found'
      });
    }

    // Prepare update data (only include provided fields)
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (summary !== undefined) updateData.summary = summary;
    if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url;
    if (req.body.image_source !== undefined) updateData.image_source = req.body.image_source;

    const { data: update, error } = await supabase
      .from('updates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating update:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update'
      });
    }

    res.json({
      success: true,
      message: 'Update updated successfully',
      update
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while updating'
    });
  }
});

/**
 * DELETE /api/updates/:id
 * Delete update (requires authentication)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if update exists
    const { data: existingUpdate, error: checkError } = await supabase
      .from('updates')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingUpdate) {
      return res.status(404).json({
        success: false,
        error: 'Update not found'
      });
    }

    // Delete the update
    const { error: deleteError } = await supabase
      .from('updates')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting update:', deleteError);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete update'
      });
    }

    res.json({
      success: true,
      message: 'Update deleted successfully'
    });

  } catch (error) {
    console.error('Delete update error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while deleting the update'
    });
  }
});

export default router;
