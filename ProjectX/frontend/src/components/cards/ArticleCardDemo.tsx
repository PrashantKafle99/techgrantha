import React from 'react';
import ArticleCard from './ArticleCard.tsx';
import type { Article } from '../../types/index.ts';

// Demo data for testing
const demoArticles: Article[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence: Beyond Machine Learning',
    body: 'As we stand at the precipice of a new technological era, artificial intelligence continues to evolve at an unprecedented pace. From neural networks that can generate human-like text to computer vision systems that surpass human accuracy, AI is reshaping every industry. This comprehensive analysis explores the current state of AI technology, emerging trends, and the profound implications for society, business, and human creativity. We examine breakthrough developments in large language models, the rise of multimodal AI systems, and the ongoing debate about artificial general intelligence. Through interviews with leading researchers and industry pioneers, we uncover the challenges and opportunities that lie ahead in our AI-driven future.',
    type: 'article' as const,
    banner_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center',
    author: 'Dr. Sarah Chen',
    published_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Case Study: How Netflix Revolutionized Content Delivery with Edge Computing',
    body: 'In this detailed case study, we examine how Netflix transformed from a DVD-by-mail service to the world\'s leading streaming platform through innovative edge computing strategies. The company\'s journey reveals crucial insights about scalability, user experience optimization, and global content distribution. We analyze their Open Connect CDN, the strategic placement of edge servers worldwide, and the sophisticated algorithms that predict and pre-position content. This case study demonstrates how technical innovation can drive business transformation and create competitive advantages in the digital economy. Through exclusive interviews with Netflix engineers and detailed technical analysis, we uncover the architectural decisions that enabled Netflix to serve over 230 million subscribers across 190 countries.',
    type: 'case-study' as const,
    banner_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop&crop=center',
    author: 'Michael Rodriguez',
    published_at: '2024-01-14T14:20:00Z',
  },
  {
    id: '3',
    title: 'Quantum Computing: The Next Frontier in Computational Power',
    body: 'Quantum computing represents one of the most significant technological leaps in modern history, promising to solve problems that are intractable for classical computers. This in-depth exploration examines the fundamental principles of quantum mechanics that make quantum computing possible, from superposition and entanglement to quantum interference. We investigate current quantum computing platforms, including superconducting qubits, trapped ions, and photonic systems, analyzing their strengths and limitations. The article covers breakthrough applications in cryptography, drug discovery, financial modeling, and optimization problems. We also address the challenges facing the quantum computing industry, including error correction, decoherence, and the quest for quantum advantage in practical applications.',
    type: 'article' as const,
    banner_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop&crop=center',
    author: 'Prof. James Wilson',
    published_at: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    title: 'Case Study: Spotify\'s Recommendation Engine - Personalization at Scale',
    body: 'Spotify\'s recommendation system serves as a masterclass in applied machine learning and user experience design. This comprehensive case study dissects the technology behind Discover Weekly, Daily Mix, and Release Radar, revealing how Spotify combines collaborative filtering, natural language processing, and audio analysis to create personalized music experiences for over 400 million users. We explore the company\'s innovative approach to the cold start problem, the integration of implicit and explicit feedback signals, and the sophisticated A/B testing framework that drives continuous improvement. The study includes detailed analysis of Spotify\'s data pipeline, real-time recommendation serving infrastructure, and the cultural impact of algorithmic music discovery on artist promotion and user behavior.',
    type: 'case-study' as const,
    banner_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop&crop=center',
    author: 'Emma Thompson',
    published_at: '2024-01-12T16:45:00Z',
  },
];

const ArticleCardDemo: React.FC = () => {
  const handleArticleClick = (article: Article) => {
    console.log('Article clicked:', article.title);
    // In a real app, this would navigate to the article detail page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="font-serif text-3xl font-normal mb-8 text-primary-black">
        Featured Articles & Case Studies
      </h2>
      
      {/* Featured Article */}
      <div className="mb-16">
        <h3 className="font-serif text-2xl font-normal mb-6 text-primary-black">
          Featured Article
        </h3>
        <ArticleCard
          article={demoArticles[0]}
          onClick={() => handleArticleClick(demoArticles[0])}
          featured={true}
        />
      </div>

      {/* Regular Articles Grid */}
      <div className="mb-8">
        <h3 className="font-serif text-2xl font-normal mb-6 text-primary-black">
          Recent Articles
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoArticles.slice(1).map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => handleArticleClick(article)}
          />
        ))}
      </div>
    </div>
  );
};

export default ArticleCardDemo;