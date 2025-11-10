import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UpdateCard from '../UpdateCard.tsx';
import type { Update } from '../../../types/index.ts';

const mockUpdate: Update = {
  id: '1',
  title: 'Test Update Title',
  summary: 'This is a test summary for the update card component.',
  thumbnail_url: 'https://example.com/test-image.jpg',
  created_at: '2024-01-15T10:30:00Z',
};

describe('UpdateCard', () => {
  it('renders update information correctly', () => {
    render(<UpdateCard update={mockUpdate} />);
    
    expect(screen.getByText('Test Update Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test summary for the update card component.')).toBeInTheDocument();
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
  });

  it('renders image with correct alt text', () => {
    render(<UpdateCard update={mockUpdate} />);
    
    const image = screen.getByAltText('Test Update Title');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
  });

  it('calls onClick when card is clicked', () => {
    const mockOnClick = vi.fn();
    render(<UpdateCard update={mockUpdate} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard navigation', () => {
    const mockOnClick = vi.fn();
    render(<UpdateCard update={mockUpdate} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not render as button when onClick is not provided', () => {
    render(<UpdateCard update={mockUpdate} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});