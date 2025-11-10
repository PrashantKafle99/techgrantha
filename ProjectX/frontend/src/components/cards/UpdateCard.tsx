import React from "react";
import type { Update } from "../../types/index.ts";

interface UpdateCardProps {
  update: Update;
  onClick?: () => void;
}

const UpdateCard: React.FC<UpdateCardProps> = ({ update, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article
      className={`bg-white overflow-hidden cursor-pointer transition-all duration-300 group ${
        onClick ? "hover:shadow-xl" : ""
      }`}
      style={{ maxWidth: '100%', width: '100%' }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      aria-label={onClick ? `Read update: ${update.title}` : undefined}
    >
      {/* Thumbnail Image */}
      <div 
        className="overflow-hidden bg-gray-100"
        style={{ height: '220px' }}
      >
        <img
          src={update.thumbnail_url}
          alt={update.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE2MFYxNDBIMTc1VjEyNVoiIGZpbGw9IiNENEQ0RDQiLz4KPHBhdGggZD0iTTIyNSAxMjVIMjQwVjE0MEgyMjVWMTI1WiIgZmlsbD0iI0Q0RDRENSIvPgo8cGF0aCBkPSJNMjAwIDEwMEgyMDBWMTc1SDE3NUwxNzUgMTUwSDE2MFYxNzVIMjQwVjE1MEgyMjVWMTc1SDIwMFYxMDBaIiBmaWxsPSIjRDRENEQ0Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=";
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4" style={{ paddingTop: '16px' }}>
        {/* Title */}
        <h3 className="text-lg font-serif font-normal text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {update.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-3">
          {update.summary}
        </p>

        {/* Date */}
        <time className="text-xs text-gray-500 uppercase tracking-wide">
          {formatDate(update.created_at)}
        </time>
      </div>
    </article>
  );
};

export default UpdateCard;
