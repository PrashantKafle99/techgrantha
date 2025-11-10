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
      className={`flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8 bg-white cursor-pointer transition-all duration-200 mb-4 sm:mb-5 border border-gray-200 rounded-lg ${
        onClick ? 'hover:bg-gray-50' : ''
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Read update: ${update.title}` : undefined}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 overflow-hidden rounded-lg w-full sm:w-48 lg:w-60" style={{ aspectRatio: '3/2' }}>
        <img
          src={update.thumbnail_url}
          alt={update.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDE4MCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+Cjwvc3ZnPgo=';
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Date Badge */}
        <div className="mb-2 sm:mb-3">
          <span className="text-xs font-medium text-accent-red uppercase tracking-wide">
            {formatDate(update.created_at)}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-primary-black text-base sm:text-lg mb-2 sm:mb-3 line-clamp-2 hover:text-accent-red transition-colors font-serif font-normal">
          {update.title}
        </h4>

        {/* Summary */}
        <p className="text-gray-600 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {update.summary}
        </p>
      </div>
    </article>
  );
};

export default DailyTechCard;
