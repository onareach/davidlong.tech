import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Teaching Philosophy",
  description:
    "How I think about teaching: connections, clarity, and the role of technology.",
};

export default function PhilosophyPage() {
  return (
    <article className="space-y-5 text-zinc-700 dark:text-zinc-300">
      <PageHeader title="Teaching Philosophy" />
      <p>
        My interest in teaching centers on a simple question:{" "}
        <strong>how do people come to understand things clearly?</strong> In my
        experience, understanding rarely comes from memorizing isolated facts.
        It usually appears when students begin to see relationships between
        ideas, symbols, and problems that once seemed unrelated.
      </p>
      <p>
        For that reason, I try to organize teaching around connections. When
        students see how concepts fit together, a subject becomes easier to
        navigate and more interesting to study. My role as a teacher is to help
        make those relationships visible and to ask questions that push students
        to explain their own reasoning. I want students to do more than repeat
        correct answers. I want them to see why an idea makes sense and how it
        connects to a larger structure.
      </p>
      <p>
        I am currently exploring this work in two different ways. One is through
        small-group teaching using a conversational approach. In a private
        class I teach with two students, we examine topics related to cognitive
        science, perception, and metaphysics through sustained discussion. My
        approach there is close to the Socratic method: rather than simply
        presenting conclusions, I ask questions that help students examine
        assumptions, define terms carefully, and follow ideas to their
        consequences. In that setting, the goal is not just to cover material,
        but to strengthen habits of inquiry.
      </p>
      <p>
        At the same time, I am also exploring teaching at a broader scale through{" "}
        <strong>Lingua Formula</strong>, a web-based project designed to help
        students organize and study terms, formulas, and explanations in
        mathematics and science. The central idea is that formulas function like
        a language. Students often struggle because they meet formulas and
        definitions as isolated fragments. I am interested in whether a better
        organized digital structure can help students see the relationships
        between concepts more clearly and learn them more efficiently.
      </p>
      <p>
        Technology plays a supporting role in this philosophy. Digital tools are
        very good at storing information, searching large collections of
        material, and presenting content in flexible ways. Used well, they can
        help students compare ideas, revisit difficult material, and make
        patterns more visible. But the central work of learning remains human.
        Students still have to ask questions, interpret meaning, and exercise
        judgment. My aim is to use technology to extend and support those
        activities, not replace them.
      </p>
      <p>
        In short, my philosophy is that teaching should help students make
        connections, ask better questions, and grow in clarity. Technology is
        valuable when it strengthens that process.
      </p>
      <p>
        For background on my teaching roles this semester, visit the{" "}
        <Link href="/about" className="text-blue-600 underline dark:text-blue-400">
          About
        </Link>{" "}
        page. For a concrete example of how I have tried to put these ideas
        into practice, visit the{" "}
        <Link href="/implementation" className="text-blue-600 underline dark:text-blue-400">
          Teaching with Technology Example
        </Link>{" "}
        page.
      </p>
    </article>
  );
}
