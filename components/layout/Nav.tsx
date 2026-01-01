"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
  Variants,
} from "framer-motion";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuLinks = [
    { href: "/", label: "Home" },
    { href: "/books", label: "Books" },
    { href: "/search", label: "Search" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  // 1. Track the scroll progress
  const { scrollY } = useScroll();

  // 2. Map scroll distance to background color and optional backdrop blur
  // At 0px: #ffffff (white)
  // By 50px: #fafafa (zinc-50)
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["#ffffff", "#fafafa"]
  );

  // Optional: Add a subtle border or shadow as you scroll
  const borderBottom = useTransform(
    scrollY,
    [0, 50],
    ["1px solid rgba(0,0,0,0)", "1px solid rgba(0,0,0,0.05)"]
  );

  const menuVariants: Variants = {
    closed: {
      clipPath: "circle(0px at calc(100% - 36px) 36px)",
      transition: {
        delay: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      clipPath: "circle(150% at calc(100% - 36px) 36px)",
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    },
  };

  const listVariants: Variants = {
    open: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants: Variants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

  const pathVariants: Variants = {
    closed: {
      d: "M 2 2.5 L 14 2.5",
      transition: { duration: 0.3 },
    },
    open: {
      d: "M 3 14 L 14 3",
      transition: { duration: 0.3 },
    },
  };

  const pathVariants2: Variants = {
    closed: {
      d: "M 2 8 L 14 8",
      opacity: 1,
      transition: { duration: 0.1 },
    },
    open: {
      d: "M 2 8 L 14 8",
      opacity: 0,
      transition: { duration: 0.1 },
    },
  };

  const pathVariants3: Variants = {
    closed: {
      d: "M 2 13.5 L 14 13.5",
      transition: { duration: 0.3 },
    },
    open: {
      d: "M 3 3 L 14 14",
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <motion.nav
        style={{ backgroundColor, borderBottom }}
        className="sticky top-0 px-4 py-3 flex items-center justify-between  z-50"
      >
        <div className="flex items-center gap-3">
          <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
          <hr className="border border-black h-10" />
          <div>
            <p className="text-lg font-bold text-black font-raleway">
              The{" "}
              <span className="font-instrument-serif italic text-primary">
                Legal{" "}
              </span>{" "}
              <br />{" "}
              <span className="font-instrument-serif italic text-primary">
                Eagle{" "}
              </span>{" "}
              Memoirs
            </p>
          </div>
        </div>

        <motion.button
          onClick={toggleMenu}
          animate={isOpen ? "open" : "closed"}
          className="size-9 rounded-full border border-black bg-transparent relative z-50"
          aria-label="menu"
          aria-expanded={isOpen}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <motion.path
              fill="transparent"
              strokeWidth="1.5"
              stroke="black"
              strokeLinecap="round"
              variants={pathVariants}
            />
            <motion.path
              fill="transparent"
              strokeWidth="1.5"
              stroke="black"
              strokeLinecap="round"
              variants={pathVariants2}
            />
            <motion.path
              fill="transparent"
              strokeWidth="1.5"
              stroke="black"
              strokeLinecap="round"
              variants={pathVariants3}
            />
          </svg>
        </motion.button>
      </motion.nav>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 bg-primary z-50"
          >
            <div className="absolute top-4 right-4">
              <motion.button
                onClick={toggleMenu}
                animate={isOpen ? "open" : "closed"}
                className={
                  "size-9 rounded-full border  bg-transparent relative z-50" +
                  (isOpen ? " border-white" : " border-black")
                }
                aria-label="menu"
                aria-expanded={isOpen}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <motion.path
                    fill="transparent"
                    strokeWidth="1.5"
                    stroke={isOpen ? "white" : "black"}
                    strokeLinecap="round"
                    variants={pathVariants}
                  />
                  <motion.path
                    fill="transparent"
                    strokeWidth="1.5"
                    stroke={isOpen ? "white" : "black"}
                    strokeLinecap="round"
                    variants={pathVariants2}
                  />
                  <motion.path
                    fill="transparent"
                    strokeWidth="1.5"
                    stroke={isOpen ? "white" : "black"}
                    strokeLinecap="round"
                    variants={pathVariants3}
                  />
                </svg>
              </motion.button>
            </div>

            <div className="h-full overflow-y-auto pb-12 px-8">
              <motion.div
                variants={listVariants}
                className="flex flex-col items-center justify-center min-h-full gap-8"
              >
                {menuLinks.map((link, i) => (
                  <motion.div key={link.href} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={toggleMenu}
                      className={`text-4xl md:text-5xl font-bold hover:opacity-70 transition-opacity font-raleway ${
                        pathname === link.href
                          ? "text-accent italic"
                          : "text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
