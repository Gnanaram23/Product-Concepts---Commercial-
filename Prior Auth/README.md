# ClearAuth — Prior Authorization & Re-Authorization Platform

<p align="center">
  <img src="https://img.shields.io/badge/Status-Beta-blue" />
  <img src="https://img.shields.io/badge/Version-1.0.0-2563EB" />
  <img src="https://img.shields.io/badge/License-Commercial-red" />
  <img src="https://img.shields.io/badge/Stack-React%20%2B%20TypeScript%20%2B%20Express-informational" />
  <img src="https://img.shields.io/badge/AI-Claude%20(Anthropic)-blueviolet" />
</p>

> **Connecting Providers, Patients, and Payers through Intelligent Authorization.**  
> ClearAuth streamlines Prior Authorization workflows with AI-assisted form completion, real-time status tracking, and automated payer routing.

---

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Business Logic](#business-logic)
- [AI Capabilities](#ai-capabilities)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

ClearAuth is a web-based Prior Authorization (PA) and Re-Authorization (RA) platform designed to eliminate the administrative friction that delays patient access to medication and specialist care.

The US healthcare system processes **over 300 million PA requests annually**. 94% of physicians report PA-related delays. ClearAuth targets:

- **65% reduction** in provider administrative time per PA
- **35% improvement** in first-pass approval rates via AI documentation assistance
- **Real-time visibility** for patients into their authorization journey
- **Automated routing** to payers via HL7 FHIR, portal, or secure fax

---

## The Problem

| Stakeholder | Pain Point | Impact |
|---|---|---|
| **Provider** | Manual PA form completion via fax/portal takes 2–3 hours per case | Physician burnout, delayed care |
| **Patient** | No visibility into PA status; learns of denials only at the pharmacy | Therapy abandonment (up to 30%) |
| **Payer** | Manual review of incomplete submissions creates PIR cycles | $2–8 per PA decision in operational cost |

---

## Key Features

### For Providers
- **New PA Request Modal** — Patient lookup, ICD-10 auto-suggest, clinical justification, drag-and-drop document upload, submission channel selection (HL7 FHIR / Portal / Fax)
- **Active Cases Table** — Searchable case list with inline View / Appeal / Share actions
- **Appeals Management** — AI-generated formal appeal letters in < 5 seconds
- **Reauthorization Tracking** — 45-day advance expiry alerts with urgency classification
- **AI Features** — Form Assistant, Document Analyzer (Relevance + Completeness scoring), PA Insights (approval likelihood, processing time, doc score)

### For Patients
- **PA Journey Tracker** — 6-step visual tracker (Submitted → Received → Clinical Review → Decision Pending → Decision → Treatment Starts) with plain-language step explanations
- **My Documents** — Upload supporting documents, AI banner surfaces missing evidence
- **AI Assistant** — Treatment Explainer, PA Status Helper, Side Effect Guidance (plain-language, empathetic)

### For Payers
- **Review Queue Dashboard** — Inline Approve / Deny / AI Review with workload metrics
- **AI Clinical Review** — Guideline Match (criteria met/unmet), Alternative Suggestions, Clinical Appropriateness analysis

### Platform-Wide
- Role-aware AI Chat (different system prompts per role)
- PA Detail Modal with chronological timeline of all events
- Toast notification system for all state changes
- HIPAA-compliant audit trail on all decisions

---

## User Roles

| Role | Demo User | Color | Access |
|---|---|---|---|
| **Provider** | Dr. Sarah Mitchell | Blue `#2563EB` | Submit PAs, manage cases, appeals, re-auths, AI tools |
| **Patient** | Robert Brown | Green `#16A34A` | View own cases only, journey tracker, documents, AI assistant |
| **Payer** | Sam Wilson | Amber `#D97706` | Review queue, approve/deny, AI guideline tools |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | CSS Modules (custom design system, no Tailwind) |
| Routing | React Router v6 |
| State | React Context API |
| Backend | Express.js + TypeScript |
| Data Store | In-memory (MVP) → PostgreSQL (production) |
| AI | Anthropic Claude `claude-sonnet-4-6` |
| PA Exchange | HL7 FHIR R4 (mock in MVP, live in v1.1) |
| Deployment | Vite + Node.js + Replit / Netlify |

---

## Project Structure
```
