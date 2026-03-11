
# Research Studio Schema Notes

This schema supports the **Research Studio** concept for the davidlong.tech site.

The purpose of the system is to support:

- daily research writing
- structured reflection
- AI-assisted editing and questioning
- long-term theory development
- transformation of private notes into public writing

---

# Core Concepts

## Research Entry

A **research entry** is the central object in the system.

Each entry contains:

- raw draft text
- edited text
- summary
- explanation of why the idea matters
- connections to branches and mysteries

Entries represent the **evolving record of thought**.

---

## Branch

Branches represent **major research domains**.

Examples:

- Algebra of Qualities
- Information and Matter
- Teaching and Learning
- Knowledge Systems

Branches help organize work over long time horizons.

---

## Mystery

Mysteries represent the **questions driving research**.

Examples:

- Why does mathematics describe reality?
- How does information become matter?
- Why do mysteries engage human attention?

Mysteries are treated as **first-class entities**, not just tags.

---

## Prompts

Prompts drive the daily writing process.

The prompt engine prioritizes:

1. unresolved ideas
2. synthesis opportunities
3. neglected branches
4. fallback prompts

---

## AI Operations

All AI interactions are stored in `tbl_ai_operations`.

This provides:

- auditability
- debugging capability
- future model comparison
- reproducibility

---

# Philosophy

The system is designed to help transform:

fragmented ideas → structured thought → coherent theory.

It is meant to function as a **continuity engine for thinking**, not merely a note-taking tool.
