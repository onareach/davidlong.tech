# 00_RESEARCH_STUDIO_SPEC.md

## Project Name

**Research Studio**
 Private research-writing application to be integrated into `davidlong.tech`.

------

# Project Purpose

Build a private writing and research-development system inside `davidlong.tech`.

This is **not** a generic journaling tool and **not** a simple note-taking app.

It is a **continuity-driven research-writing engine** whose purpose is to help the site owner:

1. write briefly and consistently
2. refine raw thought into clearer prose
3. identify the mystery or question driving each note
4. connect each note to prior notes, themes, branches, projects, and emerging essays
5. generate intelligent follow-up prompts based on unresolved ideas
6. support long-term synthesis into public writing, project documentation, teaching material, and theory development

The app should behave more like a **research interlocutor and structural thinking partner** than a grammar checker.

------

# Core Product Idea

The app should support the following flow:

```
daily prompt
→ short writing session
→ AI-assisted reflection and editing
→ structured placement into research map
→ follow-up question generation
→ long-term synthesis and publication
```

The system should help transform fragmented thought into **organized, cumulative, reusable knowledge**.

------

# Key Design Principles

## 1. Continuity Over Randomness

Daily prompts should come primarily from **prior writing**, not from generic prompt lists.

The system should ask:

- what was left unresolved?
- what tension emerged?
- what idea begged for extension?
- what claim needs an example, challenge, clarification, or application?

------

## 2. Thinking Partner Over Grammar Bot

The AI should not act merely as an editor. It should function as a:

- brainstormer
- critical reader
- pattern detector
- theme perceiver
- structural organizer
- follow-up question generator
- synthesis assistant

------

## 3. Preserve Original Thought

Never overwrite the raw draft.

Preserve:

- original draft
- edited draft
- structured interpretation

------

## 4. Mystery-Centered Research

Each entry should help answer:

- What mystery is this helping to solve?
- Why is this question compelling?
- Why might this matter to other people?

------

## 5. Private-First, Publication-Capable

The studio is **private by default**, but should support gradual promotion of material into public writing on:

- `davidlong.tech`
- `algorithmsofquality.com`
- project pages and documentation

------

## 6. Structure Should Emerge From Use

The app should impose enough structure to be useful, but not so much that writing becomes burdensome.

------

# Site Integration

The app should be built into the existing `davidlong.tech` site as a **private authenticated section**.

## Public Site Routes

Examples:

```
/
about
research
projects
writing
teaching/...
```

## Private Studio Routes

```
/studio
/studio/today
/studio/entries
/studio/entries/[id]
/studio/branches
/studio/mysteries
/studio/review
/studio/publication
```

The private studio should **not appear in the public navigation**.

------

# Primary Users

## Primary User

The site owner (researcher/writer).

## Future Possibility

Reusable for other researchers later, but version 1 should optimize for a **single user workflow**.

------

# Product Goals

The system should help the user:

- maintain daily writing practice
- deepen lines of thought over time
- prevent notes from becoming an unstructured pile
- identify recurring themes and mysteries
- support theoretical development
- feed public writing and project explanations
- clarify intellectual and professional direction

------

# Out of Scope for MVP

Do **not** build these first:

- multi-user collaboration
- social features
- comments
- rich publishing CMS
- complex graph visualizations
- mobile apps
- voice input
- full markdown publishing engine

These can come later.

------

# Functional Modules

------

# Module 1 — Continuity Prompt Engine

## Purpose

Generate the best daily writing prompt based on prior notes and unresolved lines of thought.

## Core Rule

Prompt generation prioritizes **continuity-based prompts**.

------

## Prompt Priority Order

### Priority 1 — Unresolved Continuations

Generate prompts from:

- unfinished arguments
- unanswered questions
- contradictions
- vague claims needing examples
- promising fragments
- notes marked for expansion
- entries with strong mystery but weak articulation
- entries with unclear “why it matters”

------

### Priority 2 — Synthesis Opportunities

When multiple notes orbit the same theme or mystery:

- prompt synthesis
- ask for common principle
- ask for distinctions or refinement
- detect emerging essay topics

------

### Priority 3 — Branch Balancing

If a branch has been neglected:

- prompt re-engagement

------

### Priority 4 — Generic Prompts

Used only when continuity prompts are weak.

------

## Example Prompts

- “Yesterday you suggested that mystery creates identification but didn’t explain the mechanism. Can you clarify that mechanism?”
- “You now have three notes connecting mathematics, mystery, and teaching. What principle connects them?”
- “You claimed information becomes matter through fabrication. What is the strongest example you know?”

------

## Prompt Object Structure

```
{
  "prompt_id": "uuid",
  "prompt_type": "continuation",
  "is_fallback": false,
  "generated_from_entry_id": "uuid-123",
  "generated_from_reason": "unresolved_tension",
  "prompt_text": "Explain the mechanism behind mystery-driven identification.",
  "target_branch_handle": "teaching_and_learning",
  "target_mystery_handle": "why_mystery_pulls_attention",
  "priority_score": 0.92,
  "status": "pending"
}
```

**Schema:** `tbl_research_prompts` includes `is_fallback BOOLEAN DEFAULT FALSE`. Entries in `tbl_research_entries` include `research_prompt_id` (FK to `tbl_research_prompts`).

------

# Module 2 — Writing Workspace

## Purpose

Provide a low-friction writing environment.

## Requirements

- simple editor
- autosave
- preserve raw draft
- word count
- timestamp
- optional timer
- prompt displayed above editor
- minimal UI clutter

------

# Module 3 — AI Reflection Engine

## Purpose

Interpret a new entry and produce structured insight.

------

## Required AI Modes

### Light Edit

Improve clarity while preserving voice.

### Structured Reflection

Return:

- suggested title
- summary
- central mystery
- why it matters
- suggested branch
- themes/tags
- one critique
- one follow-up question
- one example suggestion

### Placement Suggestion

Suggest:

- branch
- mystery
- related entries
- related projects
- publication potential

------

## Quality Rules

AI must avoid vague filler like:

- “interesting idea”
- “consider expanding”

Instead produce:

- one criticism
- one hidden assumption
- one example
- one next question

------

# Module 4 — Knowledge Placement Engine

Each note should connect to:

- branch
- mystery
- themes
- related notes
- related projects
- publication targets

------

## Relationship Types

```
extends
clarifies
contradicts
applies_to
parallels
supports
gives_example_for
raises_question_about
```

------

# Module 5 — Research Navigation

Required views:

### Entries

Filter by date, branch, mystery, theme, project.

### Branch View

Show entries within a branch.

### Mystery View

Show entries around a central question.

### Entry Detail

Display:

- raw draft
- edited draft
- summary
- why it matters
- tags
- related notes
- project links
- follow-up prompts

------

# Module 6 — Review and Synthesis

## Weekly Review

Show:

- unresolved questions
- recurring mysteries
- neglected branches
- promising entries

## Monthly Review

Prompt questions like:

- what patterns are emerging?
- which mystery dominates?
- which entries form an essay?

------

# Module 7 — Publication Pipeline

Possible statuses:

```
raw
edited
placed
follow_up_needed
synthesis_candidate
draft_public
published
```

Possible targets:

- davidlong.tech
- algorithmsofquality.com
- project documentation
- lecture material

------

# Core Domain Model

Entities:

- Research Entry
- Branch
- Mystery
- Theme
- Project
- Prompt
- Publication Target
- Entry Relationship
- AI Operation

------

# Initial Branch Set

```
algebra_of_qualities
information_and_matter
knowledge_systems
teaching_and_learning
language_and_formula
intelligence_and_harmony
digital_fabrication
product_and_value_creation
```

------

# Initial Mystery Examples

- Why does mathematics describe reality so effectively?
- How does information become matter?
- Why do mysteries capture human attention?
- How can knowledge structures improve learning?
- What makes qualities universally valuable?

------

# Suggested Database Tables

```
tbl_research_entries
tbl_research_branches
tbl_research_mysteries
tbl_research_themes
tbl_entry_theme_map
tbl_research_prompts
tbl_entry_relationships
tbl_projects
tbl_entry_project_map
tbl_publication_targets
tbl_ai_operations
```

------

# MVP Routes

```
/studio/today
/studio/entries
/studio/entries/[id]
/studio/branches
/studio/mysteries
```

------

# MVP Capabilities

User can:

- view daily prompt
- write entry
- save raw draft
- run AI reflection
- confirm branch and mystery
- browse entries
- generate follow-up prompts

------

# Daily Writing Cycle

```
prompt generated
→ user writes
→ AI reflection
→ user confirms structure
→ entry saved
→ follow-up prompt created
```

------

# Prompt Engine Logic

Priority order:

1. unresolved follow-up
2. mystery continuation
3. synthesis opportunity
4. neglected branch
5. fallback prompt

------

# Fallback Prompt Examples

- What mystery feels most alive today?
- What idea has become clearer recently?
- What pattern are you noticing?
- What insight would help someone else most?

**Design decisions (March 2026):**

- Fallback prompts are stored in `tbl_research_prompts` with `is_fallback = true`.
- Fallback prompts are presented in random order when selected (no fixed sequence).
- Each entry stores `research_prompt_id` (FK to `tbl_research_prompts`) to record which prompt inspired that entry.

------

# Tech Stack

```
Next.js App Router
TypeScript
Tailwind
PostgreSQL
OpenAI API
Vercel deployment
```

------

# MVP Success Criteria

The system is successful if after a few weeks:

- writing is more consistent
- prompts feel connected to prior thought
- patterns become visible
- ideas evolve into essays or projects
- research no longer feels fragmented
- intellectual direction becomes clearer