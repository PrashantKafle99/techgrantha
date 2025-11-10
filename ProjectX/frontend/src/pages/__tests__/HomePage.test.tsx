import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../HomePage.tsx';

// Mock the useUpdates hook
vi.mock('../../hooks/useUpdates.ts', () => ({
  useUpdates: vi.fn(),
}));

// Mock the supabase client
vi.mock('../../lib/supabase.ts', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const mockUseUpdates = vi.mocked(await import('../../hooks/useUpdates.ts')).useUpdates;

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    mockUseUpdates.mockReturnValue({
      updates: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('Loading latest tech updates...')).toBeInTheDocument();
  });

  it('shows error state when there is an error', () => {
    mockUseUpdates.mockReturnValue({
      updates: [],
      loading: false,
      error: 'Failed to fetch updates',
      refetch: vi.fn(),
    });

    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('Unable to Load Updates')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('shows empty state when no updates are available', () => {
    mockUseUpdates.mockReturnValue({
      updates: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('No Updates Available')).toBeInTheDocument();
    expect(screen.getByText('Check back soon for the latest tech insights and updates.')).toBeInTheDocument();
  });

  it('renders updates when data is available', () => {
    const mockUpdates = [
      {
        id: '1',
        title: 'Test Update 1',
        summary: 'Test summary 1',
        thumbnail_url: 'https://example.com/image1.jpg',
        created_at: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        title: 'Test Update 2',
        summary: 'Test summary 2',
        thumbnail_url: 'https://example.com/image2.jpg',
        created_at: '2024-01-14T10:30:00Z',
      },
    ];

    mockUseUpdates.mockReturnValue({
      updates: mockUpdates,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('Tech Insights')).toBeInTheDocument();
    expect(screen.getByText('Latest Updates')).toBeInTheDocument();
    expect(screen.getByText('2 recent updates')).toBeInTheDocument();
    expect(screen.getByText('Test Update 1')).toBeInTheDocument();
    expect(screen.getByText('Test Update 2')).toBeInTheDocument();
  });

  it('shows call to action when updates are available', () => {
    const mockUpdates = [
      {
        id: '1',
        title: 'Test Update',
        summary: 'Test summary',
        thumbnail_url: 'https://example.com/image.jpg',
        created_at: '2024-01-15T10:30:00Z',
      },
    ];

    mockUseUpdates.mockReturnValue({
      updates: mockUpdates,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('Stay Updated')).toBeInTheDocument();
    expect(screen.getByText('Subscribe to Updates')).toBeInTheDocument();
  });
});