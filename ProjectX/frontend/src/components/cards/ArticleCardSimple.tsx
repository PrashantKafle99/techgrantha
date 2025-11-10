import React from 'react';
import type { Article } from '../../types/index.ts';

interface ArticleCardSimpleProps {
  article: Article;
  onClick?: () => void;
}

const ArticleCardSimple: React.FC<ArticleCardSimpleProps> = ({ article, onClick }) => {
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

  return (
    <article
      className={`update-card bg-white overflow-hidden cursor-pointer transition-all duration-300 group ${
        onClick ? 'hover:shadow-xl' : ''
      }`}
      style={{ maxWidth: '100%', width: '100%' }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Read article: ${article.title}` : undefined}
    >
      {/* Banner Image */}
      <div 
        className="overflow-hidden bg-gray-100 w-full"
        style={{ aspectRatio: '16/9', borderRadius: '8px 8px 0 0' }}
      >
        <img
          src={article.featured_image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          style={{ borderRadius: '8px 8px 0 0', display: 'block' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE2MFYxNDBIMTc1VjEyNVoiIGZpbGw9IiNENEQ0RDQiLz4KPHBhdGggZD0iTTIyNSAxMjVIMjQwVjE0MEgyMjVWMTI1WiIgZmlsbD0iI0Q0RDRENSIvPgo8cGF0aCBkPSJNMjAwIDEwMEgyMDBWMTc1SDE3NUwxNzUgMTUwSDE2MFYxNzVIMjQwVjE1MEgyMjVWMTc1SDIwMFYxMDBaIiBmaWxsPSIjRDRENEQ0Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=';
          }}
        />
      </div>

      {/* Content */}
      <div className="p-6" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        {/* Title */}
        <h3 
          className="text-xl font-serif font-normal text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors"
          style={{ padding: '2px' }}
        >
          {article.title}
        </h3>

        {/* Summary */}
        <p 
          className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4"
          style={{ padding: '2px' }}
        >
          {article.excerpt || article.content?.substring(0, 100)}
        </p>

        {/* Date and Author */}
        <div className="flex items-center justify-between" style={{ marginTop: '12px', paddingLeft: '8px', paddingRight: '8px' }}>
          <time 
            className="text-xs text-gray-500 uppercase tracking-wide"
            style={{ padding: '2px' }}
          >
            {formatDate(article.created_at)}
          </time>
          {article.author && (
            <span 
              className="text-xs text-gray-700 font-medium"
              style={{ padding: '2px' }}
            >
              {article.author}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ArticleCardSimple;
