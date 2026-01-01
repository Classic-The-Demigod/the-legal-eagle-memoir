import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import BlogCard from "@/app/components/BlogCard";
import PageTransition from "@/app/components/PageTransition";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Post extends SanityDocument {
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage?: string;
  excerpt?: string;
  estimatedReadingTime?: number;
  tags?: string[];
}

const POSTS_PER_PAGE = 6;

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[$start...$end]{
  _id, 
  title, 
  slug, 
  publishedAt,
  mainImage,
  excerpt,
  estimatedReadingTime,
  "tags": categories[]->title
}`;

const TOTAL_POSTS_QUERY = `count(*[_type == "post" && defined(slug.current)])`;

const options = { next: { revalidate: 30 } };

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  const [posts, totalPosts] = await Promise.all([
    client.fetch<Post[]>(POSTS_QUERY, { start, end }, options),
    client.fetch<number>(TOTAL_POSTS_QUERY, {}, options),
  ]);

  const hasNextPage = end < totalPosts;
  const hasPrevPage = start > 0;

  return (
    <PageTransition className="min-h-screen bg-gray-50/50 font-sans">
      <header className="bg-white border-b border-gray-100 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-playfair-display font-bold text-primary mb-6">
                The Legal <span className="text-accent italic">Eagle</span>
                <span className="block text-2xl md:text-3xl font-raleway font-light text-black mt-4 tracking-widest uppercase">
                    Memoirs
                </span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg font-lato">
                Insights, analysis, and stories from the frontlines of international law and justice.
            </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex items-center justify-between mb-12">
             <h2 className="text-3xl font-playfair-display font-bold text-black border-l-4 border-primary pl-4">
                Latest <span className="text-accent italic">
                  Reads </span>
             </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
                <BlogCard key={post._id} post={post} index={index} />
            ))}
        </div>
        
        {posts.length === 0 && (
             <div className="text-center py-20 text-gray-400">
                <p>No posts found.</p>
             </div>
        )}

        <div className="flex justify-center gap-4 mt-16">
          {hasPrevPage && (
            <Link
              href={`/?page=${page - 1}`}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-black hover:border-primary hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft size={18} />
              Previous
            </Link>
          )}
          {hasNextPage && (
            <Link
              href={`/?page=${page + 1}`}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-black hover:border-primary hover:text-primary transition-colors font-medium"
            >
              Next
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
