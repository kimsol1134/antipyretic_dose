import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  dateModified?: string;
  category: string;
  keywords: string[];
  faqs?: BlogFAQ[];
  content: string;
}

const blogDirectory = path.join(process.cwd(), 'content/blog');

export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(blogDirectory);
  
  // Only process .md files, ignoring .en.md for the base list to avoid duplicates
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md') && !fileName.endsWith('.en.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const { data, content } = matter(fileContents);
      
      return {
        slug: data.slug || slug,
        title: data.title || '',
        description: data.description || '',
        author: data.author || '',
        date: data.date || '',
        dateModified: data.dateModified || undefined,
        category: data.category || '',
        keywords: data.keywords || [],
        faqs: data.faqs || undefined,
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getBlogPostBySlug(slug: string, locale: string = 'ko'): BlogPost | null {
  // Check for localized file first
  if (locale === 'en') {
    const enFileName = `${slug}.en.md`;
    const enFullPath = path.join(blogDirectory, enFileName);
    
    if (fs.existsSync(enFullPath)) {
      const fileContents = fs.readFileSync(enFullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        slug: slug, // Keep original slug
        title: data.title || '',
        description: data.description || '',
        author: data.author || '',
        date: data.date || '',
        dateModified: data.dateModified || undefined,
        category: data.category || '',
        keywords: data.keywords || [],
        faqs: data.faqs || undefined,
        content,
      };
    }
  }

  // Fallback to default (Korean)
  const posts = getAllBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export function getBlogPostsForLocale(locale: string): BlogPost[] {
  const allPosts = getAllBlogPosts();

  if (locale !== 'en') {
    return allPosts;
  }

  // For English, only return posts that have a .en.md translation file
  return allPosts.filter((post) => {
    const enFilePath = path.join(blogDirectory, `${post.slug}.en.md`);
    return fs.existsSync(enFilePath);
  });
}

export function getAllBlogSlugs(): string[] {
  const posts = getAllBlogPosts();
  return posts.map((post) => post.slug);
}
