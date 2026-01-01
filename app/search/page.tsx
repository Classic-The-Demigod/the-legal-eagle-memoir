import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import BlogCard from "@/app/components/BlogCard";
import PageTransition from "@/app/components/PageTransition";
import SearchInput from "@/app/components/SearchInput";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Post extends SanityDocument {
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage?: any;
  excerpt?: string;
  estimatedReadingTime?: number;
  tags?: string[];
}

const SEARCH_QUERY = `*[
  _type == "post"
  && defined(slug.current)
  && (
    title match $term + "*"
    || pt::text(body) match $term + "*"
    || $term in categories[]->title
  )
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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  
  const posts = query 
    ? await client.fetch<Post[]>(SEARCH_QUERY, { term: query }, options)
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
        
        <div className="max-w-2xl mx-auto mb-16 text-center">
            <h1 className="text-4xl font-playfair-display font-bold text-primary mb-6">
                Search the Archives
            </h1>
            <SearchInput initialQuery={query} />
        </div>

        {query && (
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-700">
                    {posts.length} result{posts.length !== 1 ? 's' : ''} for <span className="text-accent">"{query}"</span>
                </h2>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
                <BlogCard key={post._id} post={post} index={index} />
            ))}
        </div>
        
        {query && posts.length === 0 && (
             <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-lg">No matches found.</p>
                <p className="text-sm">Try searching for different keywords or categories.</p>
             </div>
        )}
      </main>
    </PageTransition>
  );
}
