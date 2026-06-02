"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Flash, Code } from "iconsax-reactjs";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&";

function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [output, setOutput] = useState(text);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    let frame = 0;
    const frames = 24;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        frame++;
        setOutput(
          text
            .split("")
            .map((char, i) =>
              char === " " || char === "." || frame > (i / text.length) * frames
                ? char
                : SCRAMBLE_CHARS[
                    Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                  ],
            )
            .join(""),
        );
        if (frame >= frames) {
          setOutput(text);
          clearInterval(iv);
        }
      }, 40);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [delay, text]);

  return <>{output}</>;
}

const SQL_TOKENS = [
  { text: "SELECT *", x: "4%", y: "12%", rotate: -12, dur: 14, delay: 0.0 },
  { text: "WHERE", x: "78%", y: "8%", rotate: 8, dur: 18, delay: 2.0 },
  { text: "JOIN", x: "88%", y: "52%", rotate: -5, dur: 16, delay: 4.0 },
  { text: "GROUP BY", x: "6%", y: "72%", rotate: 14, dur: 20, delay: 1.0 },
  { text: "ORDER BY", x: "62%", y: "78%", rotate: -8, dur: 15, delay: 3.0 },
  { text: "HAVING", x: "42%", y: "4%", rotate: 6, dur: 12, delay: 5.0 },
  { text: "NULL", x: "18%", y: "42%", rotate: -15, dur: 17, delay: 2.5 },
  { text: "INDEX", x: "72%", y: "32%", rotate: 10, dur: 13, delay: 1.5 },
  { text: "DISTINCT", x: "50%", y: "88%", rotate: -6, dur: 19, delay: 3.5 },
  { text: "LIMIT 100", x: "28%", y: "90%", rotate: 8, dur: 11, delay: 0.5 },
  { text: "NOT IN", x: "92%", y: "80%", rotate: -10, dur: 16, delay: 2.2 },
  { text: "IS NULL", x: "2%", y: "88%", rotate: 5, dur: 14, delay: 4.5 },
] as const;

const HEADLINE_WORDS = ["Query", "anything."];

export function LandingHero() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-36 pb-20 text-center md:px-8">
      {/* Drifting SQL tokens */}
      {SQL_TOKENS.map((token, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="text-accent pointer-events-none absolute font-mono text-xs font-bold tracking-widest select-none"
          style={{
            left: token.x,
            top: token.y,
            rotate: token.rotate,
            opacity: 0.3,
          }}
          animate={{
            y: [0, -14, 8, 0],
            x: [0, 8, -6, 0],
            opacity: [0.2, 0.26, 0.2],
          }}
          transition={{
            duration: token.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: token.delay,
          }}
        >
          {token.text}
        </motion.span>
      ))}

      {/* Badge with sonar ring */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-border-default bg-bg-elevated relative mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
      >
        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
          <motion.span
            className="bg-accent absolute h-full w-full rounded-full"
            animate={{ scale: [1, 3], opacity: [0.7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
          <span className="bg-accent relative h-1.5 w-1.5 rounded-full" />
        </span>
        <span className="text-text-accent text-xs font-semibold tracking-widest">
          SQL without the syntax
        </span>
      </motion.div>

      {/* Headline — word by word, last word scrambles */}
      <h1 className="text-text-primary mb-6 text-6xl font-bold tracking-tight md:text-8xl">
        {HEADLINE_WORDS.map((word, i) => (
          <motion.span
            key={word}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            className="mr-[0.22em] inline-block"
          >
            {word}
          </motion.span>
        ))}{" "}
        <motion.span
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-accent inline-block"
          aria-label="Visually."
        >
          <span aria-hidden>
            <ScrambleText text="Visually." delay={0.4} />
          </span>
        </motion.span>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.44 }}
        className="text-text-muted mx-auto mb-10 max-w-2xl text-base md:text-lg"
      >
        Build complex nested database filters with an intuitive visual editor.
        NexusDB transforms visual logic into SQL, MongoDB, and GraphQL
        instantly.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.54 }}
        className="flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <Link
          href="/app"
          className="bg-accent hover:bg-accent-hover flex items-center gap-2 rounded-md px-6 py-3 text-base font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.97]"
        >
          <Flash size={16} variant="Bold" />
          Launch Explorer
        </Link>
        <Link
          href="https://github.com/codabytez/nexusdb-explorer"
          target="_blank"
          rel="noopener noreferrer"
          className="border-border-default bg-bg-elevated text-text-primary hover:bg-bg-overlay flex items-center gap-2 rounded-md border px-6 py-3 text-base font-semibold transition-all"
        >
          <Code size={16} />
          View on GitHub
        </Link>
      </motion.div>
    </section>
  );
}
