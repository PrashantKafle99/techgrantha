import React from 'react';
import Typography from '../ui/Typography.tsx';
import type { Article } from '../../types/index.ts';

interface ArticleCardProps {
  article: Article;
  onClick?: () => void;
  featured?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, featured = false }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTypeLabel = (type: Article['type']) => {
    return type === 'case-study' ? 'Case Study' : 'Article';
  };

  const getTypeColor = (type: Article['type']) => {
    return type === 'case-study' ? 'text-accent-red' : 'text-primary-black';
  };

  // Featured articles have a different layout
  if (featured) {
    return (
      <article
        className={`group cursor-pointer transition-all duration-300 ${
          onClick ? 'hover:transform hover:scale-[1.02]' : ''
        }`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={onClick ? `Read article: ${article.title}` : undefined}
      >
        {/* Large Banner Image */}
        <div className="mb-6 overflow-hidden rounded-lg w-full" style={{ aspectRatio: '16/9' }}>
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ display: 'block' }}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zNzUgMTc1SDM2MFYxOTBIMzc1VjE3NVoiIGZpbGw9IiNENEQ0RDQiLz4KPHBhdGggZD0iTTQyNSAxNzVINDQwVjE5MEg0MjVWMTc1WiIgZmlsbD0iI0Q0RDRENSIvPgo8cGF0aCBkPSJNNDAwIDE1MEg0MDBWMTI1SDM3NUwzNzUgMjAwSDM2MFYyMjVINDQwVjIwMEg0MjVWMjI1SDQwMFYxNTBaIiBmaWxsPSIjRDRENEQ0Ii8+Cjx0ZXh0IHg9IjQwMCIgeT0iMjUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPkFydGljbGUgaW1hZ2Ugbm90IGF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+Cg==';
            }}
          />
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Type Badge */}
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium uppercase tracking-wide ${getTypeColor(article.type)}`}>
              {getTypeLabel(article.type)}
            </span>
            <span className="text-gray-300">•</span>
            <Typography variant="caption" className="text-gray-500">
              {formatDate(article.created_at)}
            </Typography>
          </div>

          {/* Title */}
          <Typography 
            variant="h2" 
            className="text-primary-black group-hover:text-accent-red transition-colors leading-tight"
          >
            {article.title}
          </Typography>

          {/* Excerpt */}
          <Typography 
            variant="body" 
            className="text-gray-600 leading-relaxed line-clamp-3 text-lg"
          >
            {article.excerpt || article.content?.substring(0, 200)}
          </Typography>

          {/* Author */}
          {article.author && (
            <div className="pt-4 border-t border-gray-100">
              <Typography variant="body" className="text-primary-black font-medium">
                {article.author}
              </Typography>
            </div>
          )}
        </div>
      </article>
    );
  }

  // Regular article card layout
  return (
    <article
      className={`update-card p-6 cursor-pointer transition-all duration-200 ${
        onClick ? 'hover:shadow-lg' : ''
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Read article: ${article.title}` : undefined}
    >
      {/* Banner Image */}
      <div className="mb-4 overflow-hidden rounded-lg w-full" style={{ aspectRatio: '16/9' }}>
        <img
          src={article.featured_image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          style={{ display: 'block' }}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE2MFYxNDBIMTc1VjEyNVoiIGZpbGw9IiNENEQ0RDQiLz4KPHBhdGggZD0iTTIyNSAxMjVIMjQwVjE0MEgyMjVWMTI1WiIgZmlsbD0iI0Q0RDRENSIvPgo8cGF0aCBkPSJNMjAwIDEwMEgyMDBWMTc1SDE3NUwxNzUgMTUwSDE2MFYxNzVIMjQwVjE1MEgyMjVWMTc1SDIwMFYxMDBaIiBmaWxsPSIjRDRENEQ0Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkFydGljbGUgaW1hZ2Ugbm90IGF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+Cg==';
          }}
        />
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Type Badge */}
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-medium uppercase tracking-wide ${getTypeColor(article.type)}`}>
            {getTypeLabel(article.type)}
          </span>
        </div>

        {/* Title */}
        <Typography 
          variant="h4" 
          className="text-primary-black hover:text-accent-red transition-colors line-clamp-2"
        >
          {article.title}
        </Typography>

        {/* Excerpt */}
        <Typography 
          variant="body" 
          className="text-gray-600 line-clamp-3 leading-relaxed"
        >
          {article.excerpt || article.content?.substring(0, 150)}
        </Typography>

        {/* Meta Information */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          {article.author && (
            <Typography variant="caption" className="text-primary-black font-medium">
              {article.author}
            </Typography>
          )}
          <Typography variant="caption" className="text-gray-500">
            {formatDate(article.created_at)}
          </Typography>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;