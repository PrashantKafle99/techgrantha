import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ArticleCard from '../ArticleCard.tsx';
import type { Article } from '../../../types/index.ts';

const mockArticle: Article = {
  id: '1',
  title: 'Test Article Title',
  body: 'This is a test body for the article card component. It should be long enough to test the truncation functionality and ensure that the component handles longer content appropriately.',
  type: 'article',
  banner_url: 'https://example.com/test-banner.jpg',
  author: 'Test Author',
  published_at: '2024-01-15T10:30:00Z',
};

const mockCaseStudy: Article = {
  ...mockArticle,
  id: '2',
  title: 'Test Case Study Title',
  type: 'case-study',
};

describe('ArticleCard', () => {
  it('renders article information correctly', () => {
    render(<ArticleCard article={mockArticle} />);
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    expect(screen.getByText('Article')).toBeInTheDocument();
    expect(screen.getByText('By Test Author')).toBeInTheDocument();
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
  });

  it('renders case study with correct styling', () => {
    render(<ArticleCard article={mockCaseStudy} />);
    
    expect(screen.getByText('Case Study')).toBeInTheDocument();
    expect(screen.getByText('Case Study')).toHaveClass('text-accent-red');
  });

  it('renders banner image with correct alt text', () => {
    render(<ArticleCard article={mockArticle} />);
    
    const image = screen.getByAltText('Test Article Title');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test-banner.jpg');
  });

  it('truncates long body text', () => {
    render(<ArticleCard article={mockArticle} />);
    
    const bodyText = screen.getByText(/This is a test body for the article card component/);
    expect(bodyText).toBeInTheDocument();
    expect(bodyText.textContent).toMatch(/\.\.\.$/); // Should end with ellipsis
  });

  it('calls onClick when card is clicked', () => {
    const mockOnClick = vi.fn();
    render(<ArticleCard article={mockArticle} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard navigation', () => {
    const mockOnClick = vi.fn();
    render(<ArticleCard article={mockArticle} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not render as button when onClick is not provided', () => {
    render(<ArticleCard article={mockArticle} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  describe('Featured layout', () => {
    it('renders featured article with larger layout', () => {
      render(<ArticleCard article={mockArticle} featured={true} />);
      
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
      // Featured articles should have h2 variant for title
      const title = screen.getByText('Test Article Title');
      expect(title.tagName).toBe('H2');
    });

    it('shows longer excerpt in featured layout', () => {
      render(<ArticleCard article={mockArticle} featured={true} />);
      
      // Featured articles show more text (200 chars vs 150)
      const bodyText = screen.getByText(/This is a test body for the article card component/);
      expect(bodyText.textContent?.length).toBeGreaterThan(150);
    });

    it('has different image dimensions for featured articles', () => {
      render(<ArticleCard article={mockArticle} featured={true} />);
      
      const image = screen.getByAltText('Test Article Title');
      expect(image).toHaveClass('h-64', 'md:h-80', 'lg:h-96');
    });
  });

  it('handles image loading errors', () => {
    render(<ArticleCard article={mockArticle} />);
    
    const image = screen.getByAltText('Test Article Title');
    fireEvent.error(image);
    
    // Should fallback to base64 encoded SVG
    expect(image).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml;base64'));
  });
});