export interface IPortfolio {
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  liveLink?: string;
  github?: string;
  technologies: string[];
  isFeatured: boolean;
}
