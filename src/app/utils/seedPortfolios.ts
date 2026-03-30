/* eslint-disable no-console */
import { Portfolio } from '../modules/Portfolio/Portfolio.model';

const portfoliosData = [
  {
    title: 'Modern E-commerce Platform',
    slug: 'modern-e-commerce-platform',
    description: 'A full-featured e-commerce solution with real-time inventory, secure payments (Stripe), and a high-performance dashboard for admins.',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2000&auto=format&fit=crop',
    link: 'https://ecommerce.example.com',
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Stripe'],
    isFeatured: true,
  },
  {
    title: 'AI Analytics Dashboard',
    slug: 'ai-analytics-dashboard',
    description: 'Intelligent business analytics platform that uses machine learning to provide predictive insights and automated reporting for SaaS companies.',
    image: 'https://images.unsplash.com/photo-1551288049-bbdac8626ad1?q=80&w=2000&auto=format&fit=crop',
    link: 'https://analytics.example.com',
    technologies: ['React', 'Python', 'FastAPI', 'TensorFlow', 'PostgreSQL'],
    isFeatured: true,
  },
  {
    title: 'Financial Portfolio Tracker',
    slug: 'financial-portfolio-tracker',
    description: 'Track and analyze your investments in real-time. Supports stocks, crypto, and traditional assets with deep historical analysis and performance metrics.',
    image: 'https://images.unsplash.com/photo-1611974714851-129083375a02?q=80&w=2000&auto=format&fit=crop',
    link: 'https://finance.example.com',
    technologies: ['Next.js', 'GraphQL', 'Prisma', 'Tailwind CSS'],
    isFeatured: false,
  },
  {
    title: 'Real Estate Marketplace',
    slug: 'real-estate-marketplace',
    description: 'Immersive property search experience with 3D tours, interactive maps, and automated communication between buyers and agents.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000&auto=format&fit=crop',
    link: 'https://homes.example.com',
    technologies: ['React Native', 'Google Maps API', 'Firebase', 'Express'],
    isFeatured: false,
  },
];

const seedPortfolios = async () => {
  try {
    const portfolioCount = await Portfolio.countDocuments();
    if (portfolioCount > 0) {
      console.log('ℹ️ Portfolios already exist. Skipping seed.');
      return;
    }

    await Portfolio.insertMany(portfoliosData);
    console.log('✅ Portfolios seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding portfolios:', error);
  }
};

export default seedPortfolios;
