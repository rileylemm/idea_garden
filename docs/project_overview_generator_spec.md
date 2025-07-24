# 🌿 Idea Garden Project Overview Generator — Refined Specification

This document outlines a redesigned implementation for the **Project Overview Generator** in Idea Garden, making it feel more like a natural creative conversation (similar to how Riley interacts with ChatGPT) and less like a rigid form.

---

## 🎯 Goals

- Create an adaptive, conversational flow to guide users through shaping a project
- Write the `.md` document progressively, section-by-section
- Use existing project context to reduce friction
- Allow editing and tone shaping throughout the process

---

## 🧠 New AI System Prompt

```txt
You are a thoughtful creative assistant helping the user explore and grow an idea. Your goal is to help them collaboratively create a clear, compelling project overview. 

You already have access to the seed description, tags, and optionally research documents. Ask clarifying questions that help the user uncover what’s important, unique, and exciting about the idea. 

Keep it fun, flexible, and conversational. Once the idea is well-formed, help them generate a markdown (.md) document in a tone that fits their style.
```

---

## 🗣️ Conversational Question Flow

Replace the static array of questions with a dynamic, section-aware approach:

### A. Core Concept
- “Let’s start with the heart of it. What’s the *feeling* behind this idea? What got you excited about it?”
- “Tell me about this idea in your own words — what’s it trying to be?”

### B. Intent + Mood
- “Is this meant to solve a problem, share a vibe, or just be something playful?”
- “Would you say this is practical, poetic, experimental, or something else?”

### C. Target Audience (optional)
- “Is this for others to use, or just for yourself?”
- “Who might appreciate or enjoy this idea?”

### D. Features / Actions
- “What might this do or look like when it’s working?”
- “If you could wave a wand and have a working version, what would it do?”

### E. Style Preference
- “When we write the final doc, do you want it to sound professional, playful, poetic, or chill?”

---

## 🧱 Flow Implementation

### 1. **Initiation**
- User clicks “Generate Project Overview” from a project/seed
- Assistant welcomes the user warmly and begins with Core Concept

### 2. **Section-by-Section Composition**
- Each section of the `.md` doc is built after 1–2 interactions
- Sections include:
  - ## Concept Overview
  - ## Audience & Intent
  - ## Features or Goals
  - ## Technical Thoughts (optional)
  - ## Timeline & Next Steps

### 3. **Real-Time Markdown Preview**
- Display markdown preview side-by-side or in a toggleable pane
- Allow edits before final export

### 4. **Context Usage**
- Autofill Concept Overview from the idea's title/description
- Use idea tags to influence tone or prompt selection
- Pull in Add Research docs as reference links or summary blocks

---

## 📄 Markdown Generation Template (Sectional)

```md
# {projectTitle}

## Concept Overview
{generatedFromFirstAnswer}

## Intent & Mood
{generatedFromIntentSection}

## Who It’s For
{generatedFromAudienceSection}

## What It Might Do
{featuresOrCapabilities}

## What Happens Next
- {first step or prototype milestone}
- {optional ideas to grow it further}

---

*Written collaboratively on {date}. This is a living document.*
```

---

## ✅ Functional Requirements

- [ ] Replace fixed question array with section-based prompts
- [ ] Add real-time .md preview
- [ ] Add tone selector (optional override)
- [ ] Let user edit each section before generating final doc
- [ ] GPT prompt dynamically updated with context (idea, docs, tags)

---

## 🧪 Bonus Features (Later Phases)

- 🌈 “Tone dial” for markdown: professional / poetic / quirky
- 📝 “Pin this phrase” in chat to mark key phrases for use in the doc
- 🔁 Regenerate individual sections
- 🧠 Summarize research docs automatically into bullet points

---

## 🧠 Example Flow (From User: Riley)

1. Assistant: “Hey! Let’s co-write your project doc for *flower gifting app*. What inspired this idea?”
2. Riley: “I love flowers but don’t want to pick them. I want to share their beauty digitally.”
3. Assistant: “That’s beautiful. Is this for fun or do you see it solving a specific problem?”
4. Riley: “Just fun, no problem-solving.”
5. Assistant: “Got it. What would the app do, simply?”
6. Riley: “Take a photo of a flower, send it to a friend with a message.”

...

Markdown output:

```md
# Flower Gifting App

## Concept Overview
An app that lets people share beautiful flowers digitally — without picking them. Snap a photo, send it with a message, and brighten someone’s day.

## Intent & Mood
This is a playful, whimsical project made just for joy. It’s not about solving a problem — it’s about celebrating beauty and thoughtfulness.

## Who It’s For
People who delight in small moments of nature. Garden lovers, walkers, hikers, romantics.

## What It Might Do
- Let users snap a flower photo
- Compose a message
- Send it as a digital “gift” to a friend
- Optional: create a bouquet of collected flowers

## What Happens Next
- Build a prototype in 2 months
- Try sending flowers to 5 friends and get feedback

---

*Written collaboratively on 7/24/2025. This is a living document.*
```

---

## ✅ Next Steps for Implementation

- Integrate new system prompt and dynamic flow in `ProjectOverviewChat.tsx`
- Replace fixed `questions[]` array with per-section logic
- Use tone and style cues based on tags or user selection
- Enable real-time markdown preview with edit ability

---

## 💬 Final Notes

This redesign brings Idea Garden closer to its vision — not just a note system, but a creative partner that helps you *grow thoughts into things*. The project overview generator should feel warm, fluid, and truly collaborative.

Let me know if you'd like help scaffolding the code for this.

—Written with Riley in mind 🌸
