import React, { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout.tsx';
import DailyTechCard from '../components/cards/DailyTechCard.tsx';
import Typography from '../components/ui/Typography.tsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.tsx';
import { useUpdates } from '../hooks/useUpdates.ts';
import { usePageTracking } from '../hooks/usePageTracking';

const ITEMS_PER_PAGE = 4;

const DailyTechPage: React.FC = () => {
  const { updates, loading, error } = useUpdates();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Track page view
  usePageTracking('daily-tech');

  // Calculate pagination
  const totalPages = Math.ceil(updates.length / ITEMS_PER_PAGE);
  const paginatedUpdates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return updates.slice(startIndex, endIndex);
  }, [updates, currentPage]);

  return (
    <Layout>
      {/* Page Header */}
      <div className="text-center" style={{ marginTop: '64px', marginBottom: '64px', paddingLeft: '32px', paddingRight: '32px' }}>
        <Typography variant="h1" className="text-primary-black mb-4">
          Daily Tech Updates
        </Typography>
        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
          Stay informed with the latest technology news, updates, and insights delivered daily.
        </Typography>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <Typography variant="body" className="text-accent-red">
            {error}
          </Typography>
        </div>
      )}

      {/* Updates List */}
      {!loading && !error && updates.length > 0 && (
        <>
          <div className="px-4 sm:px-8 mb-8">
            {paginatedUpdates.map((update) => (
              <DailyTechCard
                key={update.id}
                update={update}
                onClick={() => console.log('Navigate to update:', update.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center" style={{ marginBottom: '48px', gap: '8px' }}>
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="transition-colors"
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  backgroundColor: currentPage === 1 ? '#f5f5f5' : '#ffffff',
                  color: currentPage === 1 ? '#a3a3a3' : '#1a1a1a',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                }}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="transition-colors"
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    backgroundColor: currentPage === page ? '#1a1a1a' : '#ffffff',
                    color: currentPage === page ? '#ffffff' : '#1a1a1a',
                    cursor: 'pointer',
                    fontWeight: currentPage === page ? '600' : '500',
                    minWidth: '40px',
                  }}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="transition-colors"
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  backgroundColor: currentPage === totalPages ? '#f5f5f5' : '#ffffff',
                  color: currentPage === totalPages ? '#a3a3a3' : '#1a1a1a',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !error && updates.length === 0 && (
        <div className="text-center py-12">
          <Typography variant="body" className="text-gray-600">
            No updates available at the moment.
          </Typography>
        </div>
      )}
    </Layout>
  );
};

export default DailyTechPage;
