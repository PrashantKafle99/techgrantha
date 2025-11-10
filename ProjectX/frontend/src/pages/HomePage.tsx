import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Typography, LoadingSpinner } from '../components/index.ts';
import DailyTechCard from '../components/cards/DailyTechCard.tsx';
import ArticleCardSimple from '../components/cards/ArticleCardSimple.tsx';
import { useUpdates } from '../hooks/useUpdates.ts';
import { useArticles } from '../hooks/useArticles.ts';
import usePageTracking from '@/hooks/usePageTracking.ts';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Track page view
  usePageTracking('home');
  const { updates, loading: updatesLoading } = useUpdates();
  const { articles, loading: articlesLoading } = useArticles();
  
  const loading = updatesLoading || articlesLoading;
  
  // Get latest 3 items from each
  const latestUpdates = updates.slice(0, 3);
  const latestArticles = articles.slice(0, 3);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <Typography variant="body" className="text-gray-600">
              Loading content...
            </Typography>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <div className="text-center px-4 sm:px-8" style={{ marginTop: '48px', marginBottom: '48px' }}>
        <Typography variant="h1" className="text-primary-black mb-4">
          Today's Mix
        </Typography>
        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto px-4">
          Discover the latest tech updates, insights, and innovations curated just for you.
        </Typography>
      </div>

      {/* Daily Tech Section */}
      <section style={{ marginBottom: '100px', paddingLeft: '48px', paddingRight: '48px' }}>
        <h2 className="font-serif text-gray-900" style={{ fontSize: '2rem', fontWeight: '400', marginBottom: '48px' }}>
          Daily Tech
        </h2>
        <div style={{ marginBottom: '48px' }}>
          {latestUpdates.map((update) => (
            <DailyTechCard
              key={update.id}
              update={update}
              onClick={() => console.log('Navigate to update:', update.id)}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/dailytech')}
            className="btn-primary inline-flex items-center px-6 py-3 text-base font-medium rounded-md"
          >
            View More
          </button>
        </div>
      </section>

      {/* Articles Section */}
      <section style={{ marginBottom: '100px', paddingLeft: '48px', paddingRight: '48px' }}>
        <h2 className="font-serif text-gray-900" style={{ fontSize: '2rem', fontWeight: '400', marginBottom: '48px' }}>
          Articles
        </h2>
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px',
            marginBottom: '48px'
          }}
        >
          {latestArticles.map((article) => (
            <ArticleCardSimple
              key={article.id}
              article={article}
              onClick={() => navigate(`/article/${article.id}`)}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/article')}
            className="btn-primary inline-flex items-center px-6 py-3 text-base font-medium rounded-md"
          >
            View More
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;