import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import BlogCard from "@/app/components/BlogCard";
import PageTransition from "@/app/components/PageTransition";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage?: string;
  excerpt?: string;
  estimatedReadingTime?: number;
  tags?: string[];
};

// Initial query to find the category ID from the slug
const CATEGORY_ID_QUERY = `*[_type == "category" && slug.current == $slug][0]._id`;

// Query to fetch posts that reference this category ID
const POSTS_BY_TAG_QUERY = `*[
  _type == "post"
  && defined(slug.current)
  && references($categoryId)
]|order(publishedAt desc){
  _id, 
  title, 
  slug, 
  publishedAt,
  mainImage,
  excerpt,
  estimatedReadingTime,
  "tags": categories[]->title
}`;

const options = { next: { revalidate: 30 } };

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // 1. Get Category ID
  const categoryId = await client.fetch<string>(CATEGORY_ID_QUERY, { slug }, options);

  // 2. Get Posts
  const posts = categoryId 
    ? await client.fetch<Post[]>(POSTS_BY_TAG_QUERY, { categoryId }, options)
    : [];

  return (
    <PageTransition className="min-h-screen bg-gray-50/50 font-sans">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
        
        <div className="max-w-2xl mx-auto mb-12 text-center">
            <h1 className="text-4xl font-playfair-display font-bold text-primary mb-2 capitalize">
                {slug.replace(/-/g, ' ')}
            </h1>
            <p className="text-gray-500">
                {posts.length} article{posts.length !== 1 ? 's' : ''} tagged
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
                <BlogCard key={post._id} post={post} index={index} />
            ))}
        </div>
        
        {posts.length === 0 && (
             <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-lg">No posts found for this tag.</p>
             </div>
        )}
      </main>
    </PageTransition>
  );
}
