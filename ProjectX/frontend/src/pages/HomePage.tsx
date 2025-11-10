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
      <div className="text-center px-4 sm:px-8 mt-8 sm:mt-12 lg:mt-16 mb-8 sm:mb-12 lg:mb-16">
        <Typography variant="h1" className="text-primary-black mb-4">
          Today's Mix
        </Typography>
        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto px-4">
          Discover the latest tech updates, insights, and innovations curated just for you.
        </Typography>
      </div>

      {/* Daily Tech Section */}
      <section className="mb-16 sm:mb-24 px-4 sm:px-8 lg:px-12">
        <h2 className="font-serif text-gray-900 text-2xl sm:text-3xl lg:text-4xl font-normal mb-8 sm:mb-12">
          Daily Tech
        </h2>
        <div className="mb-8 sm:mb-12">
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
      <section className="mb-16 sm:mb-24 px-4 sm:px-8 lg:px-12">
        <h2 className="font-serif text-gray-900 text-2xl sm:text-3xl lg:text-4xl font-normal mb-8 sm:mb-12">
          Articles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
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