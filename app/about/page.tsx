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
        &mdash; Philip Henslowe, <i>Shakespeare in Love</i>
      </p>
      <p>
        That line captures something I&rsquo;ve come to appreciate about learning: understanding often begins with mystery—and sometimes a little humor.
      </p>
      <p>
        Across mathematics, statistics, and the physical and cognitive sciences, we repeatedly encounter patterns that seem to hint at deeper order. Part of the joy of studying these subjects is the growing suspicion that nature is saying something through those patterns—something coherent, elegant, and not always easy to see at first.
      </p>
      <p>
        My work as a teacher grows out of that curiosity. I&rsquo;m interested in how people come to recognize patterns, connect ideas, and turn scattered information into understanding.
      </p>
      <p>Recently I have been teaching in two very different ways: by building a learning tool that can reach many students at once, and by working closely with a small number of students in conversation. Both approaches aim to present ideas so crisply that students find themselves thinking, <em>“Of course. I’ve always known that.”</em> Like beautiful melodies, true knowledge and brilliant explanations combine inevitable patterns with surprising variations.
      </p>
      <p>
      <strong>The first approach—teaching through a digital tool—has taken shape in</strong>{" "}
        <Link
          href="https://www.linguaformula.com"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <strong>Lingua Formula</strong>
        </Link>
        , a web-based “teaching assistant” designed to streamline how students organize and navigate the language of technical subjects—terms, formulas, and the “big ideas” linking them together. The aim is simple: make the structure of a subject easier to see so that learning becomes faster and more meaningful.</p>

        <p>Many of the ideas that appear intimidating in textbooks are actually familiar ones. In everyday life we constantly weigh possibilities, judge likelihoods, and compare outcomes—activities that lie at the heart of subjects like statistics. What often makes these ideas seem difficult is the moment when we try to give them precise names, definitions, and symbols. Lingua Formula is designed to reduce that friction, helping students move more naturally from intuitive understanding to clear formal language.
</p>
      <p>
      <strong>The second approach—teaching through direct conversation—is much smaller and more personal.</strong> I teach a private class with two students where the method is largely conversational. Discussions often begin with provocative questions—such as, “Is there a chamber in our consciousness where we encounter self-evident truths that we then build upon?” From there we examine ideas carefully from different angles and think about how they might apply to fields like software development or psychological therapy.
      </p>
      <p>
      Some of the best moments in learning happen in exactly that kind of setting—when an old belief quietly falls away and a better one replaces it because someone asked the right question or dared to say what they actually think.
      </p>
      <p>
        More broadly, my work explores:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>the role of analogy in how we come to understand new ideas</li>
        <li>the ways educational technology can either sharpen thinking, or quietly replace and mislead it</li>
        <li>how students can learn to see relationships between ideas instead of treating knowledge as a pile of disconnected facts</li>
      </ul>
      <p>
        The tools will change—from blackboards to software, from libraries to artificial intelligence—but the goal remains the same: helping students become thoughtful investigators of ideas and skilled practitioners in their fields.
      </p>
      <p>
        Above all, I value curiosity, clarity, and intellectual honesty. I want students not only to remember ideas, but to test their limits, and propose larger ones.
      </p>
      <p>
        If you&rsquo;d like to learn more about how I approach teaching, please visit the{" "}
        <Link href="/philosophy" className={linkClass}>
          <strong>Teaching Philosophy</strong>
        </Link>{" "}
        page.
      </p>
      <p>
        If you&rsquo;d like to see examples of the educational technology work I&rsquo;m building currently, please visit the{" "}
        <Link href="/implementation" className={linkClass}>
          <strong>Teaching with Technology Example</strong>
        </Link>{" "}
        page.
      </p>
    </article>
  );
}
