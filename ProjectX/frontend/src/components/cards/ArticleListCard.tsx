import React from 'react';
import Typography from '../ui/Typography.tsx';
import type { Article } from '../../types/index.ts';

interface ArticleListCardProps {
  article: Article;
  onClick?: () => void;
}

const ArticleListCard: React.FC<ArticleListCardProps> = ({ article, onClick }) => {
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
    return type === 'case-study' ? 'bg-accent-red' : 'bg-primary-black';
  };

  return (
    <article
      className={`group bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer transition-all duration-300 ${
        onClick ? 'hover:shadow-xl hover:-translate-y-1' : ''
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Read article: ${article.title}` : undefined}
    >
      {/* Banner Image */}
      <div 
        className="relative overflow-hidden w-full" 
        style={{
          aspectRatio: '16/9',
        }}
      >
        <img
          src={article.featured_image}
          alt={article.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          className="transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjwvc3ZnPgo=';
          }}
        />
        
        {/* Type Badge Overlay */}
        <div className="absolute top-4 left-4">
          <span className={`${getTypeColor(article.type)} text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full`}>
            {getTypeLabel(article.type)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <Typography 
          variant="h3" 
          className="text-primary-black mb-3 line-clamp-2 group-hover:text-accent-red transition-colors"
        >
          {article.title}
        </Typography>

        {/* Excerpt */}
        <Typography 
          variant="body" 
          className="text-gray-600 line-clamp-3 leading-relaxed mb-4"
        >
          {article.excerpt || article.content?.substring(0, 180)}
        </Typography>

        {/* Meta Information */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {article.author && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-gray-600">
                  {article.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <Typography variant="body" className="text-primary-black font-medium text-sm">
                {article.author}
              </Typography>
            </div>
          )}
          <Typography variant="caption" className="text-gray-500">
            {formatDate(article.created_at)}
          </Typography>
        </div>
      </div>
    </article>
  );
};

export default ArticleListCard;
