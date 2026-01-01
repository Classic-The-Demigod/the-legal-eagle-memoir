import Link from 'next/link';
import Image from 'next/image';
import { PortableTextComponents } from 'next-sanity';
import { urlFor } from '@/sanity/image';

export const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-playfair-display font-bold text-primary mt-12 mb-6 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-playfair-display font-bold text-primary mt-10 mb-5 leading-snug">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-playfair-display font-semibold text-primary mt-8 mb-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-playfair-display font-medium text-primary mt-6 mb-3">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-lg text-black leading-relaxed mb-6 font-lato">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent pl-4 py-2 my-8 italic text-xl text-gray-800 bg-gray-50 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-black font-lato text-lg marker:text-accent">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2 text-black font-lato text-lg marker:text-accent">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/')
        ? 'noreferrer noopener'
        : undefined;
      return (
        <Link
          href={value.href}
          rel={rel}
          className="text-accent hover:underline font-medium transition-colors"
        >
          {children}
        </Link>
      );
    },
    strong: ({ children }) => (
      <strong className="font-bold text-black">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-black">{children}</em>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <figure className="my-10 relative group">
          <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
            <Image
              src={urlFor(value).width(800).height(450).url()}
              alt={value.alt || 'Blog Post Image'}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2 italic font-sans">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};
