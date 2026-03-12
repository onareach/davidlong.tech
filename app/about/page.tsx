import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "About David Long — teaching interests, Lingua Formula, and educational technology.",
};

const linkClass = "text-zinc-900 dark:text-zinc-100 hover:underline";

export default function AboutPage() {
  return (
    <article className="space-y-5 text-zinc-700 dark:text-zinc-300">
      <PageHeader title="About" />
      <p>
        &ldquo;I don&rsquo;t know. It&rsquo;s a mystery!&rdquo;
        <br />
        — Philip Henslowe, <i>Shakespeare in Love</i>
      </p>
      <p>
        That line captures something I&rsquo;ve come to appreciate about learning: the most interesting things usually begin in mystery.
      </p>
      <p>
        Across mathematics, statistics, and the sciences, we repeatedly encounter patterns that seem to hint at deeper order. Part of the joy of studying these subjects is the growing suspicion that nature is saying something through those patterns—something coherent, elegant, and not always easy to see at first.
      </p>
      <p>
        My work as a teacher grows out of that curiosity. I&rsquo;m interested in how people come to recognize patterns, connect ideas, and turn scattered information into understanding.
      </p>
      <p>
        This semester I have been teaching at two very different scales.
      </p>
      <p>
        On one hand, I am developing{" "}
        <Link
          href="https://www.linguaformula.com"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <strong>Lingua Formula</strong>
        </Link>
        , a web-based learning project that explores how students can organize and navigate the language of technical subjects—terms, formulas, and the conceptual relationships that link them together. The goal is simple: to make the structure of a subject easier to see so that learning becomes faster and more meaningful.
      </p>
      <p>
        On the other hand, I also teach in a small private class with two students. In that setting the pace is slower and the method is conversational. We spend most of our time asking questions, testing explanations, and examining ideas carefully from different angles. Some of the best moments in learning happen in exactly that kind of setting—when a concept finally &ldquo;clicks&rdquo; because someone asked the right question.
      </p>
      <p>
        More broadly, I am interested in:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>the role of analogy in understanding everything</li>
        <li>how educational technology can either sharpen thinking or quietly replace it</li>
        <li>and how students can learn to see relationships between ideas instead of treating knowledge as a pile of disconnected facts</li>
      </ul>
      <p>
        The tools may change—whiteboards, books, or software—but the goal remains the same: helping students become thoughtful investigators of ideas.
      </p>
      <p>
        In my teaching, I value curiosity, clarity, and intellectual honesty. I want students not only to remember information, but to develop the ability to question it, connect it, and judge it well.
      </p>
      <p>
        If you&rsquo;d like to learn more about how I approach teaching, visit the{" "}
        <Link href="/philosophy" className={linkClass}>
          <strong>Teaching Philosophy</strong>
        </Link>{" "}
        page.
      </p>
      <p>
        If you&rsquo;d like to see one example of the educational technology work I&rsquo;ve been building this semester, visit the{" "}
        <Link href="/implementation" className={linkClass}>
          <strong>Teaching with Technology Example</strong>
        </Link>{" "}
        page.
      </p>
    </article>
  );
}
