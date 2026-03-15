import type { BlogPost } from "@/lib/markdown/mdx";
import { getAllBlogPosts } from "@/lib/markdown/mdx";

/**
 * Get recent blog posts
 */
export function getRecentPosts(count = 4): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.slice(0, count);
}

/**
 * Search posts by title or description
 */
export function searchPosts(query: string): BlogPost[] {
  const allPosts = getAllBlogPosts();
  const lowerQuery = query.toLowerCase();

  return allPosts.filter((post) => {
    const title = post.frontmatter.title.toLowerCase();
    const description = post.frontmatter.description.toLowerCase();
    return title.includes(lowerQuery) || description.includes(lowerQuery);
  });
}
