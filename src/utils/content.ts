import { getCollection, type CollectionEntry } from 'astro:content';

export async function getAllBlogPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
}

export async function getFeaturedBlogPosts() {
  const posts = await getAllBlogPosts();
  return posts.filter(post => post.data.featured);
}

export async function getAllProjects() {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
}

export async function getFeaturedProjects() {
  const projects = await getAllProjects();
  return projects.filter(project => project.data.featured);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getRelatedProjects(
  currentSlug: string,
  allProjects: CollectionEntry<'projects'>[],
  limit = 2
): CollectionEntry<'projects'>[] {
  return allProjects
    .filter(project => project.slug !== currentSlug)
    .slice(0, limit);
}