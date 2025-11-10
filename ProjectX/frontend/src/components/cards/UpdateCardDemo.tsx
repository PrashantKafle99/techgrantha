import React from 'react';
import UpdateCard from './UpdateCard.tsx';
import type { Update } from '../../types/index.ts';

// Demo data for testing
const demoUpdates: Update[] = [
  {
    id: '1',
    title: 'AI Revolution: GPT-4 Turbo Transforms Software Development',
    summary: 'OpenAI\'s latest model brings unprecedented capabilities to code generation and debugging, promising to reshape how developers work. Early adopters report 40% faster development cycles.',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Quantum Computing Breakthrough: IBM Unveils 1000-Qubit Processor',
    summary: 'The new quantum processor represents a significant leap forward in quantum computing power, potentially solving complex problems in cryptography, drug discovery, and financial modeling.',
    thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop&crop=center',
    created_at: '2024-01-14T14:20:00Z',
  },
  {
    id: '3',
    title: 'Web3 Evolution: Ethereum 2.0 Reduces Energy Consumption by 99%',
    summary: 'The successful transition to proof-of-stake consensus mechanism marks a new era for sustainable blockchain technology, addressing long-standing environmental concerns.',
    thumbnail_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop&crop=center',
    created_at: '2024-01-13T09:15:00Z',
  },
];

const UpdateCardDemo: React.FC = () => {
  const handleUpdateClick = (update: Update) => {
    console.log('Update clicked:', update.title);
    // In a real app, this would navigate to the update detail page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="font-serif text-3xl font-normal mb-8 text-primary-black">
        Latest Tech Updates
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoUpdates.map((update) => (
          <UpdateCard
            key={update.id}
            update={update}
            onClick={() => handleUpdateClick(update)}
          />
        ))}
      </div>
    </div>
  );
};

export default UpdateCardDemo;