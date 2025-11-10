import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout.tsx';
import ArticleCardSimple from '../components/cards/ArticleCardSimple.tsx';
import Typography from '../components/ui/Typography.tsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.tsx';
import { useArticles } from '../hooks/useArticles.ts';

const ITEMS_PER_PAGE = 6;

const ArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  const { articles, loading, error } = useArticles();
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return articles.slice(startIndex, endIndex);
  }, [articles, currentPage]);

  return (
    <Layout>
      {/* Page Header */}
      <div className="text-center" style={{ marginTop: '64px', marginBottom: '64px', paddingLeft: '32px', paddingRight: '32px' }}>
        <Typography variant="h1" className="text-primary-black mb-4">
          Articles & Case Studies
        </Typography>
        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
          Explore in-depth articles, case studies, and expert insights on technology trends and innovations.
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

      {/* Articles Grid */}
      {!loading && !error && articles.length > 0 && (
        <>
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-8"
            style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '40px',
              margin: '0 48px',
              marginBottom: '48px'
            }}
          >
            {paginatedArticles.map((article) => (
              <ArticleCardSimple
                key={article.id}
                article={article}
                onClick={() => navigate(`/article/${article.id}`)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center" style={{ marginTop: '32px', marginBottom: '64px', gap: '12px' }}>
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
      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-12">
          <Typography variant="body" className="text-gray-600">
            No articles available at the moment.
          </Typography>
        </div>
      )}
    </Layout>
  );
};

export default ArticlesPage;
