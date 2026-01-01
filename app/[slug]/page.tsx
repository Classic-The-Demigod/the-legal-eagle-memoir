import { PortableText } from "next-sanity";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import Link from "next/link";
import Image from "next/image";
import { components } from "@/app/components/PortableTextComponents";
import PageTransition from "@/app/components/PageTransition";
import BlogCard from "@/app/components/BlogCard";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage?: any;
  excerpt?: string;
  estimatedReadingTime?: number;
  author?: {
    name: string;
    image?: any;
  };
  categories?: { _ref: string; title: string; slug: { current: string } }[];
  tags?: string[];
  body?: any[];
}

// Updated query to fetch related posts
const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  ...,
  author->{name, image},
  "categories": categories[]->{title, slug, _ref},
  "tags": categories[]->title, 
  categories
}`;

// Query to fetch posts with matching categories, excluding current
const RELATED_POSTS_QUERY = `*[
  _type == "post" 
  && slug.current != $slug 
  && count(categories[]._ref[@ in $categoryIds]) > 0
] | order(publishedAt desc)[0...3] {
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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Await params correctly
  const post = await client.fetch<
    | (Post & {
        categories: {
          title: string;
          slug: { current: string };
          _ref: string;
        }[];
      })
    | null
  >(POST_QUERY, { slug }, options);

  console.log("Fetched post:", post);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
      </div>
    );
  }

  // Fetch related posts if categories exist
  let relatedPosts: Post[] = [];
  if (post.categories?.length) {
    const categoryIds = post.categories.map((c) => c._ref);
    relatedPosts = await client.fetch(
      RELATED_POSTS_QUERY,
      { slug, categoryIds: categoryIds },
      options
    );
    console.log("Fetched relatedPosts:", relatedPosts.length);
  }

  const postImageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(675).url()
    : null;

  return (
    <PageTransition className="min-h-screen bg-white text-black font-sans selection:bg-accent/20">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Back to Articles</span>
        </Link>

        <header className="mb-12 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {post.tags?.map((tag, i) => (
              <p
                key={i}
                className="px-3 py-1 rounded-full bg-accent/5 text-accent text-xs font-bold uppercase tracking-wider hover:bg-accent/10 transition-colors"
              >
                {tag}
              </p>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair-display font-bold text-primary mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-sans border-y border-gray-100 py-4 max-w-2xl mx-auto">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.image && (
                  <Image
                    src={urlFor(post.author.image).width(40).height(40).url()}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="font-medium text-black">
                  {post.author.name}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-accent" />
              <span>
                {new Date(post.publishedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {post.estimatedReadingTime && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-accent" />
                <span className="text-accent font-semibold">
                  {post.estimatedReadingTime} min read
                </span>
              </div>
            )}
          </div>
        </header>

        {postImageUrl && (
          <div className="relative aspect-video w-full mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={postImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <article className="prose prose-lg max-w-none prose-headings:font-playfair-display prose-headings:text-primary prose-a:text-accent prose-strong:text-black hover:prose-a:text-primary transition-colors">
          {Array.isArray(post.body) && (
            <PortableText value={post.body} components={components} />
          )}
        </article>

        <hr className="my-16 border-gray-100" />

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section>
            <h3 className="text-2xl font-playfair-display font-bold text-black mb-8">
              Read <span className="text-accent italic">Next</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost: any, index: number) => (
                <BlogCard
                  key={relatedPost._id}
                  post={relatedPost}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
}
