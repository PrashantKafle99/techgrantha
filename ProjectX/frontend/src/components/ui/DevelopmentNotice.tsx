import React from "react";
import Typography from "./Typography.tsx";

interface DevelopmentNoticeProps {
  show?: boolean;
}

const DevelopmentNotice: React.FC<DevelopmentNoticeProps> = ({
  show = false,
}) => {
  if (!show || !import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <Typography variant="body" className="text-yellow-800 font-medium">
            Development Mode
          </Typography>
          <Typography variant="caption" className="text-yellow-700 mt-1">
            Database tables not found. Showing demo data. Complete Task 2 to set
            up your Supabase database schema, or the app will continue using
            demo content.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentNotice;
