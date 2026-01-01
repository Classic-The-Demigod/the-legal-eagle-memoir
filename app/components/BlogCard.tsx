import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { motion } from "motion/react"; // ensure motion/react is correct import for v12, else framer-motion

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage?: string;
  excerpt?: string;
  estimatedReadingTime?: number;
  tags?: string[];
}

export default function BlogCard({
  post,
  index,
}: {
  post: Post;
  index: number;
}) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(400).height(250).url()
    : null;

  return (
    <div className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <Link
        href={`/${post.slug.current}`}
        className="block overflow-hidden relative aspect-[16/10]"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            <span className="text-sm">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-3">
          <span className="text-accent">{post.tags?.[0] || "Article"}</span>
          <span className="text-gray-400">
            {new Date(post.publishedAt).toLocaleDateString()}
          </span>
        </div>

        <Link href={`/${post.slug.current}`} className="block mb-3">
          <h2 className="text-xl font-playfair-display font-bold text-primary leading-tight group-hover:text-accent transition-colors duration-300">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-sm text-black/80 font-lato leading-relaxed line-clamp-3 mb-4 flex-grow">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <span className="text-xs font-medium text-accent">
            {post.estimatedReadingTime
              ? `${post.estimatedReadingTime} min read`
              : "Read more"}
          </span>
          <Link
            href={`/${post.slug.current}`}
            className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
          >
            READ MORE &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
