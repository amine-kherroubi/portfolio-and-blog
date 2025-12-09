export const SITE = {
    name: 'Your Name',
    title: 'Your Name — Designer & Developer',
    description: 'A minimalist portfolio showcasing creative work and technical expertise',
    url: 'https://yoursite.com',
    author: 'Your Name',
    email: 'your.email@example.com',
  } as const;
  
  export const SOCIAL = {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    twitter: 'https://twitter.com/yourusername',
  } as const;
  
  export const NAVIGATION = [
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/#contact' },
  ] as const;
  
  export const DESIGN_TOKENS = {
    colors: {
      accent: '#FFD700',
      black: '#000000',
      white: '#FFFFFF',
      gray: '#F5F5F5',
    },
    spacing: {
      unit: 8,
    },
  } as const;