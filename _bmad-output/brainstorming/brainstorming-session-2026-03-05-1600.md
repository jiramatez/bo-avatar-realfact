---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: 'Full Codebase Review - backoffice-ui'
session_goals: 'หา code ซ้ำซ้อน, data flow ขาดตอน, UX ไม่ consistent, ความสัมพันธ์ function ที่หลวม'
selected_approach: 'progressive-flow'
techniques_used: ['morphological-analysis', 'six-thinking-hats', 'scamper', 'solution-matrix']
ideas_generated: ['18 solutions across 3 groups']
context_file: ''
---

# Brainstorming Session Results

**Facilitator:** Rf-mbp
**Date:** 2026-03-05 16:00

## Session Overview

**Topic:** Full Codebase Review — backoffice-ui (19 pages, auth, app, mock-data, CSS)
**Goals:** หา code ซ้ำซ้อน, data flow ขาดตอน, UX ไม่ consistent, ความสัมพันธ์ function ที่หลวม

## Phase 1: Morphological Analysis — 25 Findings

### 6 Dimensions Explored:
1. Architecture & Memory (5 findings)
2. Auth & RBAC (4 findings)
3. Data Flow & Integrity (6 findings)
4. CSS & UX Consistency (5 findings)
5. Code Duplication (4 findings)
6. Potential Bugs (3 findings)

### Critical Findings:
- A1: showModal() adds duplicate event listeners (memory leak)
- A2: No page cleanup — 340+ orphaned listeners after 10 navigations
- C1: Denormalized tenantName in 10+ locations — stale data on rename

## Phase 2: Six Thinking Hats — Pattern Recognition

### Key Insights:
- WHITE: 577 inline styles > half of CSS file (974 lines)
- RED: Users feel "app gets slower" from memory leaks
- YELLOW: Stat cards, tabs, chips, toast/confirm all EXCELLENT
- BLACK: Memory leak will crash production after extended use
- GREEN: 3 infrastructure changes fix 72% of all findings
- BLUE: Missing Page Lifecycle, Data Access Layer, Shared Utilities

## Phase 3: SCAMPER — 18 Solutions Generated

### Quick Wins: C2, B1, S4, C3, C4fix, E2
### Foundation: A1+S1, S2, C1, S3+R1, E3
### Progressive: S5, C4, C5, A2

## Phase 4: Solution Matrix — Sprint Plan

### Sprint 1: Critical Fixes (~25 min)
1. Fix showModal() listener duplication
2. Add RBAC to 3 missing pages
3. Fix session status case
4. Add 9 missing statusChip values
5. Fix CLOG-006 tenantName
6. Remove dead alias

### Sprint 2: Foundation (~1.5 hr)
7. Page lifecycle + cleanup() hook
8. App.rerenderPage() shared utility
9. MockData.lookup() for denormalized data
10. Sidebar filter data-attribute

### Sprint 3: Quality (when available)
11-15. Shared helpers, CSS migration, event delegation
