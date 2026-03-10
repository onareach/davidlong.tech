import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ArtifactPlaceholder } from "@/components/ArtifactPlaceholder";

export const metadata: Metadata = {
  title: "Teaching with Technology Example",
  description:
    "Lingua Formula — a web-based educational tool for organizing and studying technical material.",
};

export default function ImplementationPage() {
  return (
    <article className="space-y-5 text-zinc-700 dark:text-zinc-300">
      <PageHeader title="Teaching with Technology Example" />

      <h2 className="mt-10 text-xl font-semibold">Example: Lingua Formula</h2>
      <p>
        One of my main teaching with technology projects this semester has been
        the development of <strong>Lingua Formula</strong>, a web-based
        educational tool designed to help students study technical material more
        coherently. The project grew out of a practical problem: in subjects
        such as mathematics and statistics, students are often asked to learn
        many terms, formulas, and definitions, but those items are frequently
        encountered as disconnected pieces of information. This makes study feel
        fragmented and harder than it needs to be.
      </p>

      <h3 className="mt-8 text-lg font-semibold">Plan for the approach</h3>
      <p>
        My goal was to build a tool that would help students organize course
        material in a way that reveals relationships between concepts. I wanted
        students to be able to work with the same body of material in more than
        one mode: reviewing, self-testing, and preparing exam reference sheets.
        The learning problem I was trying to address was not simply lack of
        information, but lack of structure. If students can see how terms and
        formulas fit together, they are better positioned to understand and
        remember them.
      </p>
      <p>The learning outcomes I had in mind were these:</p>
      <ul className="list-inside list-disc space-y-1">
        <li>students would be able to organize important course material more clearly</li>
        <li>students would better recognize relationships between terms and formulas</li>
        <li>students would be able to use self-testing to identify gaps in understanding</li>
        <li>
          students would prepare for exams using materials that are structured
          rather than improvised
        </li>
      </ul>

      <h3 className="mt-8 text-lg font-semibold">
        Description of the implementation
      </h3>
      <p>
        To implement this idea, I worked on a website that allows course
        content to be displayed and reused in several ways. Students can review
        terms and formulas, generate a printable exam reference sheet, and test
        themselves on the same material. One feature I have focused on is the
        connection between the self-testing flow and the exam-sheet flow. The
        aim is to let students verify whether the content and order of their
        study materials actually support recall and understanding.
      </p>
      <p>
        This project is still under active development, but it already serves
        as a concrete example of my interest in using technology to improve how
        students interact with technical knowledge. Instead of treating
        definitions and formulas as static content, the system is designed to
        let students revisit the same ideas from multiple angles.
      </p>

      <h3 className="mt-8 text-lg font-semibold">Multimedia artifacts</h3>
      <p>
        The portfolio version of this page will include one or more artifacts
        such as:
      </p>
      <ul className="list-inside list-disc space-y-1">
        <li>a screenshot of the Lingua Formula interface</li>
        <li>a screenshot of the exam-sheet view</li>
        <li>a screenshot of the self-testing interface</li>
        <li>
          optionally, a short screen recording showing the workflow from review
          to self-test to printable reference sheet
        </li>
      </ul>

      <ArtifactPlaceholder label="Screenshot of Lingua Formula main study interface" />
      <ArtifactPlaceholder label="Screenshot of exam-sheet or print-preview page" />
      <ArtifactPlaceholder label="Optional short demo video placeholder" />

      <h3 className="mt-8 text-lg font-semibold">Analysis of outcomes</h3>
      <p>
        Because this project is still in an early stage, my analysis is
        necessarily preliminary. Even so, the work has already clarified
        several things for me. First, students benefit when study materials are
        structured around relationships rather than presented as loose
        fragments. Second, self-testing becomes more meaningful when it is tied
        directly to the materials the student has prepared for review. Third,
        educational technology is most promising when it helps students see
        what they do and do not yet understand.
      </p>
      <p>
        What has worked well so far is the central concept of linking study
        organization and self-testing. What has been more challenging is
        interface design: the tool has to remain simple enough to use easily
        while still supporting several different learning tasks. As the
        project develops, I would like to improve usability, expand the range of
        course content, and gather more structured feedback from learners.
      </p>
      <p>
        If I continue this work, I would like to expand it in at least three
        ways: better artifact collection for the portfolio, stronger student
        feedback loops, and broader support for additional courses and
        learning activities. More generally, I want to keep testing the idea
        that technology is most useful when it helps learners see structure.
      </p>

      <p className="mt-10">
        For the broader ideas behind this project, visit the{" "}
        <Link href="/philosophy" className="text-blue-600 underline dark:text-blue-400">
          Teaching Philosophy
        </Link>{" "}
        page. For context about my current teaching roles and interests, visit
        the{" "}
        <Link href="/about" className="text-blue-600 underline dark:text-blue-400">
          About
        </Link>{" "}
        page.
      </p>
    </article>
  );
}
