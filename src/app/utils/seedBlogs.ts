/* eslint-disable no-console */
import { Blog } from '../modules/Blog/Blog.model';
import { User } from '../modules/User/User.model';

const blogsData = [
  {
    title: 'How to Build a Modern Brand Identity',
    slug: 'how-to-build-a-modern-brand-identity',
    content: `
      <p>Building a modern brand identity is more than just designing a logo. It is about creating a consistent and compelling narrative that resonates with your audience across all touchpoints.</p>
      <h2>Why Brand Identity Matters</h2>
      <p>In today's crowded digital landscape, a strong brand identity helps you stand out and build trust with your customers.</p>
      <ul>
        <li>Consistency</li>
        <li>Trust</li>
        <li>Recognition</li>
      </ul>
      <blockquote>"Design is the silent ambassador of your brand." - Paul Rand</blockquote>
      <p>Start by defining your brand's core values and personality. What do you want people to feel when they interact with your brand?</p>
    `,
    category: 'Branding',
    tags: ['Branding', 'Design', 'Strategy'],
    featuredImage:
      'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop',
    status: 'PUBLISHED' as const,
  },
  {
    title: 'The Future of AI in Web Development',
    slug: 'the-future-of-ai-in-web-development',
    content: `
      <p>AI is transforming the way we build and interact with websites. From automated coding assistants to personalized user experiences, the possibilities are endless.</p>
      <h2>Key AI Trends</h2>
      <p>1. Conversational Interfaces: Chatbots and voice assistants are becoming more sophisticated.</p>
      <p>2. Automated Testing: AI tools can identify and fix bugs faster than ever.</p>
      <p>3. Dynamic Content: Websites can now adapt their layout and content based on individual user behavior.</p>
    `,
    category: 'Technology',
    tags: ['AI', 'Web Dev', 'Innovation'],
    featuredImage:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop',
    status: 'PUBLISHED' as const,
  },
  {
    title: 'Optimizing Your Workflow with Modern Tools',
    slug: 'optimizing-your-workflow-with-modern-tools',
    content: `
      <p>In the fast-paced world of tech, using the right tools can make all the difference. Discover how modern software can help you stay organized and productive.</p>
      <h2>Top Tools for 2026</h2>
      <ul>
        <li>Antigravity: The ultimate AI coding assistant.</li>
        <li>Linear: Efficient task management for engineering teams.</li>
        <li>Figma: Collaborative design built for the web.</li>
      </ul>
    `,
    category: 'Productivity',
    tags: ['Tools', 'Workflow', 'Productivity'],
    featuredImage:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2000&auto=format&fit=crop',
    status: 'PUBLISHED' as const,
  },
];

const seedBlogs = async () => {
  try {
    const user =
      (await User.findOne({ role: 'SUPER_ADMIN' })) || (await User.findOne());

    if (!user) {
      console.warn('⚠️ No user found for blog seeding. Skipping.');
      return;
    }

    const blogCount = await Blog.countDocuments();
    if (blogCount > 0) {
      console.log('ℹ️ Blogs already exist. Skipping seed.');
      return;
    }

    const payload = blogsData.map((blog) => ({
      ...blog,
      author: user._id,
      views: Math.floor(Math.random() * 1000),
    }));

    await Blog.insertMany(payload);
    console.log('✅ Blogs seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding blogs:', error);
  }
};

export default seedBlogs;
