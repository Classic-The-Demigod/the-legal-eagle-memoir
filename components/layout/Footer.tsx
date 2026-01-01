"use client";
import { Facebook, Instagram, Linkedin, Twitter} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Footer = () => {
  const pathname = usePathname();
  return (
    <footer className="bg-accent py-8 px-4 space-y-8">
      <div className="flex  items-center gap-4">
        <Image src={"/logo.svg"} alt="logo" width={100} height={100} />

        <hr className="border border-black h-32" />
        <div className="text-center">
          <h1 className="text-xl md:text-3xl font-playfair-display font-bold  mb-6">
            The Legal <span className="text-white italic">Eagle</span>
            <span className="block text-xl md:text-2xl font-raleway font-light text-black mt-4 tracking-widest uppercase">
              Memoirs
            </span>
          </h1>
        </div>
      </div>

      <div className="flex gap-2 items-center justify-center">
        {menuLinks.map((link, i) => (
          <div key={link.href}>
            <Link
              href={link.href}
              className={`  hover:opacity-70 transition-opacity font-raleway ${
                pathname === link.href ? "text-primary " : "text-white"
              }`}
            >
              {link.label}
            </Link>
          </div>
        ))}
      </div>

      <hr className="border border-primary w-full" />

      <div className="flex items-center justify-center gap-6">
        <Facebook className="text-primary" />
        <Twitter className="text-primary" />
        <Instagram className="text-primary" />
        <Linkedin className="text-primary"/>
      </div>
    </footer>
  );
};

export default Footer;
