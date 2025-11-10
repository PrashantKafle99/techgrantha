import React from 'react';
import type { Update } from '../../types/index.ts';

interface DailyTechCardProps {
  update: Update;
  onClick?: () => void;
}

const DailyTechCard: React.FC<DailyTechCardProps> = ({ update, onClick }) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <article
      className={`flex gap-6 p-8 bg-white cursor-pointer transition-all duration-200 ${
        onClick ? 'hover:bg-gray-50' : ''
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Read update: ${update.title}` : undefined}
      style={{ marginBottom: '20px', border: '1px solid #e5e5e5', borderRadius: '8px' }}
    >
      {/* Thumbnail - Larger Size */}
      <div 
        className="flex-shrink-0 overflow-hidden" 
        style={{ 
          borderRadius: '8px',
          width: '240px',
          height: '160px',
          minWidth: '240px',
          minHeight: '160px',
          maxWidth: '240px',
          maxHeight: '160px',
        }}
      >
        <img
          src={update.thumbnail_url}
          alt={update.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          className="transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDE4MCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+Cjwvc3ZnPgo=';
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0" style={{ paddingLeft: '20px' }}>
        {/* Date Badge */}
        <div className="mb-3">
          <span className="text-xs font-medium text-accent-red uppercase tracking-wide">
            {formatDate(update.created_at)}
          </span>
        </div>

        {/* Title */}
        <h4 
          className="text-primary-black mb-3 line-clamp-2 hover:text-accent-red transition-colors font-serif"
          style={{ fontSize: '1.125rem', fontWeight: '400' }}
        >
          {update.title}
        </h4>

        {/* Summary */}
        <p 
          className="text-gray-600 line-clamp-2"
          style={{ fontSize: '0.9375rem', lineHeight: '1.6' }}
        >
          {update.summary}
        </p>
      </div>
    </article>
  );
};

export default DailyTechCard;
