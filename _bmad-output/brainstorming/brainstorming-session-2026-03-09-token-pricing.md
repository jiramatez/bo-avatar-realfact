---
stepsCompleted: [1]
inputDocuments:
  - prd-pricing-multitenancy.md
  - memory/token-wallet-architecture.md
session_topic: 'Token Deduction & Pricing Model — Multi-Tenant AI Platform'
session_goals: 'Validate model, หา alternative ที่ง่ายกว่า, หา edge cases, ทำให้ Service Code config ง่ายที่สุด, การันตีกำไรทุก session'
selected_approach: 'ai-recommended'
techniques_used: []
ideas_generated: []
context_file: ''
---

# Brainstorming Session Results

**Facilitator:** Rf-mbp
**Date:** 2026-03-09

## Session Overview

**Topic:** Token Deduction & Pricing Model สำหรับ RealFact Multi-Tenant AI Platform
**Goals:**
1. Validate ว่า model ที่ออกแบบไว้ใช้ได้จริง
2. หา alternative ที่ง่ายกว่า / ลด complexity
3. หา edge cases / จุดอ่อนที่อาจพลาด
4. ทำให้การกำหนด Service Code ง่ายที่สุด
5. การันตีกำไรทุก session ที่เกิดขึ้น

### Current Model Summary
- 6 Admin configs: Cost, Margin, Token Unit Value, Plans, Packages, Session Max Cap
- 3 Profit levers: Margin, Package markup, Quota
- 3 Profit layers: Package/Plan markup + Per-service margin + Expired bonus tokens
- Dynamic Token Deduction based on actual usage
- Per-Service Margin (not flat margin)
- Pre-deduct → Settle → Refund flow
