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
        In science, mathematics, and many other fields, we encounter patterns that point to deeper levels of order. The joy of studying these subjects lies in the growing sense that nature is "saying something" through them—something coherent, elegant, and continuously unfolding.
      </p>
      <p>
        My work as a teacher grows out of the curiosity these patterns naturally stimulate. I’m curious—mystified, but admiringly so—about how people recognize patterns, connect ideas, and derive benefit from them.
      </p>
      <p>
        Recently, I have been teaching in two very different ways: by building a learning tool that can reach many students at once, and by working closely with a small number of students in conversation. Both approaches aim to present ideas clearly, so that students experience that familiar sensation: <em>“Of course—I’ve always known that.”</em> Like beautiful melodies, good explanations combine inevitable patterns with surprising variations.
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
          , a web-based teaching assistant designed to streamline how students organize and navigate the “foreign language” of technical subjects—terms, formulas, and the overarching ideas that link them together. The aim is simple: remove barriers to understanding subjects that are, at their core, governed by common sense.
      </p>
      <p>
        Many ideas that appear intimidating in textbooks are, in fact, familiar. Consider a subject often seen as dry and imposing—<em>probability and statistics</em>. In everyday life, we constantly weigh possibilities, judge likelihoods, and compare outcomes. What makes these ideas seem difficult is not their substance, but their presentation: they are rarely built up from familiar experiences and are often packaged in formulas—a virtual foreign language compared to natural speech. Lingua Formula is designed to reduce that friction, helping students move more naturally from intuitive understanding to clear formal expression.
      </p>
      <p>
        <strong>The second approach—teaching through direct conversation—is much smaller and more personal.</strong> I teach a private class with two students, focused on cognitive science and its applications, where the method is largely conversational. Discussions often begin with provocative questions—such as, “Is there a chamber in our consciousness where we encounter self-evident truths that we then build upon?” From there we examine ideas carefully from different angles and think about how they might apply to fields like software development, artificial intelligence, and psychology.
      </p>
      <p>
        The best moments in teaching and learning happen when an old belief gives way to a better one because someone asked the right question or dared to say what they actually think.
      </p>
      <p>
        More broadly, my work explores:
      </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>the role of analogy in understanding new ideas</li>
          <li>how educational technology can either sharpen thinking or quietly distort it</li>
          <li>how emerging models in cognitive science (e.g., analytical idealism) might reshape our approaches to teaching and learning</li>
        </ul>  
      <p>
        Over time, the tools of research, teaching, and learning will change—from blackboards to software, from libraries to artificial intelligence—but the goal remains the same: to help us become thoughtful investigators of ideas and skilled practitioners in our fields.
      </p>
      <p>
        Above all, I value curiosity, clarity, and intellectual honesty. I want students not only to remember ideas, but to test the limits of those ideas, and propose larger ones.
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
