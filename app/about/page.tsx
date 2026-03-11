import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "About David Long — teaching interests, Lingua Formula, and educational technology.",
};

export default function AboutPage() {
  return (
    <article className="space-y-5 text-zinc-700 dark:text-zinc-300">
      <PageHeader title="About" />
      <p>
        I am interested in how people learn difficult ideas clearly, especially
        in mathematics, science, philosophy, and cognitive science. Much of my
        work centers on a question that feels both practical and philosophical:{" "}
        <strong>what helps understanding happen?</strong>
      </p>
      <p>
        This semester, I have been exploring teaching at two different scales.
        On one hand, I am developing <strong>Lingua Formula</strong>, a
        web-based educational project that explores how students can better
        organize and learn terms, formulas, and conceptual relationships across
        technical subjects. On the other hand, I am also teaching in a small
        private class setting, where I work closely with two students using a
        discussion-based approach shaped by probing questions and careful
        examination of ideas.
      </p>
      <p>
        My broader interests include educational technology, the structure of
        explanation, the role of analogy in understanding, and the ways digital
        tools can either assist or weaken real thought. I am especially
        interested in building learning tools that help students see
        relationships between ideas instead of treating knowledge as a pile of
        disconnected facts.
      </p>
      <p>
        In teaching, I value curiosity, clarity, and intellectual honesty. I want
        students not only to remember information, but to develop the ability
        to question, connect, and judge ideas well.
      </p>
      <p>
        To learn more about how I think about teaching, visit the{" "}
        <Link href="/philosophy" className="text-blue-600 underline dark:text-blue-400">
          Teaching Philosophy
        </Link>{" "}
        page. To see one example of my work with educational technology this
        semester, visit the{" "}
        <Link href="/implementation" className="text-blue-600 underline dark:text-blue-400">
          Teaching with Technology Example
        </Link>{" "}
        page.
      </p>
    </article>
  );
}
