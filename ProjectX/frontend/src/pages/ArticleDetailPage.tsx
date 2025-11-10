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
      <article className="max-w-5xl mx-auto" style={{ paddingTop: '32px', paddingBottom: '64px', paddingLeft: '48px', paddingRight: '48px' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/article')}
          className="btn-primary inline-flex items-center px-6 py-3 text-base font-medium rounded-md"
          style={{ marginBottom: '32px' }}
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
        <div className="mb-6">
          <div
            className="overflow-hidden bg-gray-100"
            style={{ borderRadius: '12px', height: '400px' }}
          >
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
        <div className="mb-8" style={{ paddingLeft: '4px' }}>
          <time className="text-sm text-gray-500 uppercase tracking-wide block mb-2">
            {formatDate(article.created_at)}
          </time>
          {article.author && (
            <span className="text-sm text-gray-700 font-medium block">
              {article.author}
            </span>
          )}
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <h1
            className="font-serif text-gray-900"
            style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '400', marginBottom: '24px' }}
          >
            {article.title}
          </h1>
        </header>

        {/* Article Body */}
        <div
          className="prose prose-lg max-w-none"
          style={{
            fontSize: '1.125rem',
            lineHeight: '1.8',
            color: '#374151',
          }}
        >
          {(article.content || article.body || '').split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              style={{
                marginBottom: '1.5rem',
                textAlign: 'justify',
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section style={{ marginTop: '80px' }}>
            <h2 
              className="font-serif text-gray-900"
              style={{ fontSize: '2rem', fontWeight: '400', marginBottom: '48px' }}
            >
              More Articles
            </h2>
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '32px'
              }}
            >
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
