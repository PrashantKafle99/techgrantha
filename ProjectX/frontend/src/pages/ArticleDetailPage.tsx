import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout.tsx';
import Typography from '../components/ui/Typography.tsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.tsx';
import ArticleCardSimple from '../components/cards/ArticleCardSimple.tsx';
import { useArticles } from '../hooks/useArticles.ts';
import { usePageTracking } from '../hooks/usePageTracking';
import type { Article } from '../types/index.ts';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { articles, loading, error } = useArticles();
  const [article, setArticle] = useState<Article | null>(null);
  
  // Track page view
  usePageTracking('article-detail', id);

  useEffect(() => {
    if (!loading && articles.length > 0 && id) {
      const foundArticle = articles.find((a) => a.id === id);
      if (foundArticle) {
        setArticle(foundArticle);
      }
    }
  }, [id, articles, loading]);

  // Scroll to top when article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Get 3 related articles (excluding current article)
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return articles
      .filter((a) => a.id !== article.id)
      .slice(0, 3);
  }, [article, articles]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Typography variant="body" className="text-accent-red">
            {error}
          </Typography>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Typography variant="h2" className="mb-4">
            Article Not Found
          </Typography>
          <button
            onClick={() => navigate('/article')}
            className="btn-primary inline-flex items-center px-6 py-3 text-base font-medium rounded-md"
          >
            Back to Articles
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Back Button */}
        <button
          onClick={() => navigate('/article')}
          className="btn-primary inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-md mb-6 sm:mb-8"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
           Back
        </button>

        {/* Banner Image */}
        <div className="mb-6 sm:mb-8">
          <div className="overflow-hidden bg-gray-100 rounded-lg sm:rounded-xl" style={{ aspectRatio: '16/9' }}>
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjwvc3ZnPgo=';
              }}
            />
          </div>
          {article.image_source && (
            <p className="text-xs text-gray-500 italic mt-2 text-right">
              Image: {article.image_source}
            </p>
          )}
        </div>

        {/* Meta Information - Below Image */}
        <div className="mb-6 sm:mb-8">
          <time className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide block mb-2">
            {formatDate(article.created_at)}
          </time>
          {article.author && (
            <span className="text-sm text-gray-700 font-medium block">
              {article.author}
            </span>
          )}
        </div>

        {/* Article Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="font-serif text-gray-900 text-2xl sm:text-3xl lg:text-4xl leading-tight font-normal">
            {article.title}
          </h1>
        </header>

        {/* Article Body */}
        <div className="prose prose-base sm:prose-lg max-w-none text-gray-700">
          {(article.content || article.body || '').split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed text-left"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-12 sm:mt-16 lg:mt-20">
            <h2 className="font-serif text-gray-900 text-2xl sm:text-3xl font-normal mb-8 sm:mb-12">
              More Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCardSimple
                  key={relatedArticle.id}
                  article={relatedArticle}
                  onClick={() => navigate(`/article/${relatedArticle.id}`)}
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
};

export default ArticleDetailPage;
