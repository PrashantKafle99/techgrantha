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
      <div className="text-center px-4 sm:px-8 mt-8 sm:mt-12 lg:mt-16 mb-8 sm:mb-12 lg:mb-16">
        <Typography variant="h1" className="text-primary-black mb-4">
          Articles & Case Studies
        </Typography>
        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto px-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-8 lg:px-12 mb-8 sm:mb-12">
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
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-8 mb-12 sm:mb-16 px-4">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 sm:px-4 py-2 border border-gray-200 rounded-md font-medium text-sm sm:text-base transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-900 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 sm:px-4 py-2 border border-gray-200 rounded-md font-medium text-sm sm:text-base min-w-[40px] transition-colors ${
                    currentPage === page
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 sm:px-4 py-2 border border-gray-200 rounded-md font-medium text-sm sm:text-base transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-900 hover:bg-gray-50 cursor-pointer'
                }`}
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
