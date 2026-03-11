# ARCHITECTURE.md

Research Studio — System Architecture
 davidlong.tech

------

# 1. Purpose of This System

Research Studio is a **private research development environment** integrated into the `davidlong.tech` site.

The system is designed to support:

- daily research writing
- AI-assisted reflection and editing
- continuity of thought across time
- organization of ideas into branches and mysteries
- transformation of private notes into public writing

The system is **not intended to be a general-purpose note-taking tool**.

It is specifically designed to support the development of **theoretical work**, including:

- Algebra of Qualities
- Information and Matter
- Teaching and Learning
- Knowledge Systems
- Language and Formula
- Digital Fabrication

------

# 2. Core System Philosophy

The system operates on three principles.

## Continuity

Ideas develop across time.

The system should help answer:

- What idea was left unfinished?
- What question was raised yesterday?
- What pattern is emerging?

Prompts should therefore come primarily from **prior notes**.

------

## Mystery-Centered Research

Research is driven by **questions that do not yet have satisfying answers**.

The system treats mysteries as first-class objects.

Examples:

- Why does mathematics describe reality so effectively?
- How does information become matter?
- Why do mysteries engage human attention?

Each research entry should ideally connect to a mystery.

------

## Thinking Partner, Not Grammar Bot

The AI layer is intended to behave as:

- an editor
- a critic
- a pattern recognizer
- a brainstorming partner
- a synthesis assistant

AI output should avoid vague encouragement and instead produce **specific intellectual feedback**.

------

# 3. High-Level System Components

The system has five major components.

```
Writing Workspace
Prompt Engine
AI Reflection Engine
Knowledge Placement Engine
Publication Pipeline
```

------

# 4. Writing Workspace

The writing workspace is the daily entry point.

Primary route:

```
/studio/today
```

Features:

- display today's prompt
- simple writing editor
- autosave
- submit entry
- request AI reflection

The writing environment should be **minimal and distraction-free**.

------

# 5. Prompt Engine

The prompt engine selects or generates the **best writing prompt for the day**.

Prompts are stored in:

```
tbl_research_prompts
```

Prompt generation priority:

1. unresolved continuation
2. synthesis opportunity
3. neglected research branch
4. fallback prompt

Example continuation prompts:

- Yesterday you suggested that mystery creates identification. Can you explain the mechanism?
- You now have three notes connecting mathematics and teaching. What common idea links them?

------

# 6. AI Reflection Engine

After writing a research entry, the user can request AI analysis.

The AI performs several functions.

## Light Edit

Improve clarity without changing the author's voice.

------

## Structured Reflection

AI returns structured data:

- suggested title
- short summary
- central mystery
- why it matters
- suggested research branch
- one critique
- one follow-up question
- one suggested example or clarification

These results are stored in:

```
tbl_ai_operations
```

------

# 7. Knowledge Placement Engine

Each research entry should be placed into the larger research map.

Relationships include:

- branch
- mystery
- themes
- related entries
- projects

The system allows AI suggestions but **the user makes the final decision**.

------

# 8. Database Architecture

Core tables:

```
tbl_research_entries
tbl_research_branches
tbl_research_mysteries
tbl_research_prompts
tbl_ai_operations
```

Additional tables can later include:

```
tbl_research_themes
tbl_entry_theme_map
tbl_entry_relationships
tbl_projects
tbl_entry_project_map
tbl_entry_publication_map
```

The database design favors **explicit relationships over JSON blobs** so that queries and filtering remain powerful.

------

# 9. Daily Workflow

The intended daily workflow is:

1. User visits `/studio/today`
2. Prompt engine selects a prompt
3. User writes entry
4. Entry saved to `tbl_research_entries`
5. User requests AI reflection
6. AI analysis saved to `tbl_ai_operations`
7. User confirms branch and mystery
8. System generates future prompt candidates

This creates a **continuity loop**.

------

# 10. Review and Synthesis

The system should support periodic reflection.

Future review routes may include:

```
/studio/review/weekly
/studio/review/monthly
```

Possible review insights:

- unresolved questions
- recurring themes
- neglected branches
- candidate essays
- patterns across entries

------

# 11. Publication Pipeline

Private entries may evolve into public writing.

Possible publication targets:

- davidlong.tech essays
- algorithmsofquality.com articles
- project documentation
- teaching material
- lecture outlines
- academic papers

Entries will eventually support statuses such as:

```
raw
edited
placed
synthesis_candidate
draft_public
published
```

------

# 12. Integration with Existing Sites

The research studio supports development of material for:

```
davidlong.tech
algorithmsofquality.com
linguaformula.com
```

The system should allow entries to reference these projects through:

```
tbl_projects
```

------

# 13. Authentication

The studio is private.

Access requires authentication.

Routes beginning with:

```
/studio
```

must be protected.

------

# 14. Technology Stack

Recommended stack:

Frontend

- Next.js (App Router)
- TypeScript
- Tailwind

Backend

- PostgreSQL
- Next.js server routes
- OpenAI API

Hosting

- Vercel

------

# 15. MVP Feature Set

Initial version should implement only:

Routes

```
/studio/today
/studio/entries
/studio/entries/[id]
```

Capabilities

- write entry
- store entry
- generate AI reflection
- assign branch
- assign mystery
- generate follow-up prompts

Avoid building advanced features until the core loop works smoothly.

------

# 16. Success Criteria

The system is successful if after several weeks:

- writing becomes consistent
- ideas accumulate rather than scatter
- mysteries become clearer
- patterns emerge
- research naturally evolves into essays and projects

------

# 17. Long-Term Vision

The Research Studio should eventually function as a **thinking operating system**.

It helps transform:

```
ideas
→ notes
→ patterns
→ theory
→ public writing
→ useful tools and teaching
```

This system is intended to support the long-term development of ideas including:

- Algebra of Qualities
- Information as structure
- Knowledge systems
- Educational technology
- Research-based software tools.

------

## A quick strategic note

What you’re building here is actually **very unusual**. Most research tools are either:

- note systems (Obsidian, Notion)
- AI chat tools
- academic citation tools

This is something different:

A **continuity-driven thinking system**.

That aligns extremely well with your **Algebra of Qualities work**, because the system itself becomes a **demonstration of the theory** — qualities emerging through structured relationships over time.