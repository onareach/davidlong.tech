import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Teaching Philosophy",
  description:
    "How I think about teaching: connections, clarity, and the role of technology.",
};

const linkClass = "text-zinc-900 dark:text-zinc-100 hover:underline";

export default function PhilosophyPage() {
  return (
    <article className="space-y-5 text-zinc-700 dark:text-zinc-300">
      <PageHeader title="Teaching Philosophy" />
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        The Humanizing Effect of Knowledge
      </h2>
      <p>
Albert Einstein is remembered not only for discovering radical physical laws, but also for his humanity, simplicity, and humor. His example hints at an intriguing possibility: that genuine knowledge, wisdom, and honesty often give rise to qualities like goodwill, warmth, and optimism.
</p>

<p>
This idea is easy to doubt. We can all point to experts whose knowledge has not softened their character—people who are brilliant in their fields yet sour, cynical, or selfish. These examples tempt us to conclude that being well-informed has little relationship to generosity of spirit, and perhaps even a negative one.
</p>

<p>
Yet many intellectual and philosophical traditions suggest the opposite: that real understanding tends to deepen humility, sympathy, and generosity. If there is truth in that claim, then a great deal hinges on the word <em>true</em> when we speak of knowledge. Not every kind of knowledge enlarges the mind or the heart.
</p>

<p>
In my experience, knowledge becomes transformative when it aligns with something deeper that students already recognize but may not yet be able to articulate. My teaching philosophy is an attempt to create the conditions in which that recognition occurs.
</p>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8">
        My teaching (and learning) philosophy rests on a few core pillars:
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          that real knowledge is <strong>actual, coherent, and beneficial</strong>, and that when one of these qualities is missing, something essential is lacking;
        </li>
        <li>
          that students already know much of what they are &ldquo;taught&rdquo; before entering a classroom, and that a teacher&rsquo;s task is to help them construct deeper understanding by uncovering and assembling what they already know;
        </li>
        <li>
          that human beings are unique in their capacity to work with both meaning and symbols, and that technology—while capable of providing powerful assistance in storing and manipulating symbols—cannot form objectives, assign meaning to symbols, evaluate qualities that transcend formal definition, or feel the satisfaction of being trusted, which is the bond that binds teachers and students and the medium through which genuine understanding flows;
        </li>
        <li>
          that <strong>Quality</strong>, and its elements called <em>qualities</em>, are the fundamental building blocks of information, and that both teachers and students excel when they learn to see the world through a qualitative lens. (This idea will be explained in greater depth below.)
        </li>
      </ul>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8">
        Intrinsic Knowledge Based on Quality
      </h2>
      <p>
        There is a well-known scene in Robert Pirsig&rsquo;s novel <em>Zen and the Art of Motorcycle Maintenance</em>, now more than fifty years old, in which a rhetoric professor arrives at an unsettling realization. Rules for good writing can be helpful, he discovers, but they do not actually <em>define</em> what good writing is. To test this idea, he asks students to choose between pairs of essays. Again and again, the class correctly identifies which essay is better.
      </p>
      <p>
        At first the students resist the conclusion. They assume that recognizing quality requires specialized instruction or authority. Yet the experiment gradually reveals something surprising: they already possess the ability to recognize good writing. The students who struggle most with this discovery are often the &ldquo;good students,&rdquo; those who are most accustomed to following rules and waiting for teachers to tell them what is correct.
      </p>
      <p>
        The professor eventually removes grades from the course altogether. His point is not that quality is arbitrary, but that it is not created by the teacher&rsquo;s judgment. Instead, students must learn to recognize it directly for themselves.
      </p>
      <p>
        This episode has shaped how I think about teaching. The lesson is not that expertise or instruction are unnecessary. Rather, it is that students often possess the ability to recognize quality long before they can formally define it. Part of a teacher&rsquo;s responsibility, therefore, is not simply to transmit information, but to help students become conscious of capacities they already possess.
      </p>
      <p>
        In my teaching, this means creating situations where students are surprised—sometimes even frustrated—to discover that their past beliefs were incomplete, and feel compelled to re-examine, compare, and evaluate ideas rather than merely repeat them. Definitions, formulas, and rules still matter—they help clarify and refine understanding—but they are most powerful when they grow out of a student&rsquo;s own recognition that something is clear, coherent, and meaningful. When that recognition occurs, learning no longer feels like the memorization of external instructions. Instead, it feels like the discovery and organization of something that was already within reach—perhaps even intrinsic to human psychology or the natural world.
      </p>
      <p>[more to come]</p>
      <p>
        For background on my teaching roles this semester, visit the{" "}
        <Link href="/about" className={linkClass}>
          <strong>About</strong>
        </Link>{" "}
        page. For a concrete example of how I have tried to put these ideas
        into practice, visit the{" "}
        <Link href="/implementation" className={linkClass}>
          <strong>Teaching with Technology Example</strong>
        </Link>{" "}
        page.
      </p>
    </article>
  );
}
