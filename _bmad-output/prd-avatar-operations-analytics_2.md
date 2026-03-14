---
stepsCompleted: ['gap-analysis', 'scope-definition', 'functional-requirements', 'nonfunctional-requirements', 'cross-reference-audit']
baseDocument: prd-pricing-multitenancy.md
relationship: complementary-no-overlap
workflowType: 'prd'
classification:
  projectType: 'saas_b2b (Sub-Platform Operations PRD)'
  domain: 'AI Avatar Operations / Developer Portal Operations / Analytics / Platform Configuration'
  complexity: 'High'
  projectContext: 'Brownfield (ต่อยอดจาก PRD Pricing-Billing-MultiTenancy)'
scope:
  modules:
    - 'M-AV-01: Avatar Preset & Session Management'
    - 'M-AV-02: Hardware & Device Management'
    - 'M-DP-02: Developer Portal Backoffice Operations'
    - 'M-BE-08: Token Package & Welcome Bonus Configuration'
    - 'M-BE-09: Payment Settings Administration'
    - 'M-BE-10: Analytics & Reporting Platform'
    - 'M-FE-BO: Central Backoffice Dashboard'
---

# Product Requirements Document — Avatar Operations, Developer Portal Operations, Analytics & Platform Configuration

**Author:** realfact-team
**Date:** 2026-03-04
**Companion to:** PRD — Pricing, Billing & Multi-Tenancy (prd-pricing-multitenancy.md)

## Executive Summary

PRD ฉบับนี้เป็น **เอกสารเสริม (Companion PRD)** ของ PRD Pricing, Billing & Multi-Tenancy โดยครอบคลุมส่วนที่ PRD เดิมไม่ได้กำหนดขอบเขตไว้ — ได้แก่ **Avatar Sub-Platform Operations**, **Developer Portal Backoffice Operations**, **Analytics Platform** และ **Platform Configuration** ที่จำเป็นสำหรับ Backoffice UI ทำงานได้ครบ

PRD เดิมสร้าง **Revenue Infrastructure** (Cost → Price → Token → Billing → Invoice) ส่วน PRD นี้สร้าง **Operational Infrastructure** สำหรับ Sub-Platform แรก (Avatar), Developer Portal (API Preset & Credit Line) และเครื่องมือบริหารจัดการระดับ Platform

### ขอบเขตของ PRD นี้ (7 Modules)

1. **M-AV-01** — Avatar Preset & Session Management: จัดการ AI Avatar Presets, ติดตาม Live Sessions, Avatar Dashboard, Avatar Tenant View, Tenant Onboarding Workflow
2. **M-AV-02** — Hardware & Device Management: จัดการ Device Models, Device Lifecycle (Register → Sell → Activate → Decommission), Device Operations, Online Monitoring
3. **M-DP-02** — Developer Portal Backoffice Operations: จัดการ API Presets (sync จาก AI Framework), Assign Endpoint (ผูก API Preset → Tenant), Developer Portal Tenants พร้อม Credit Line management, Developer Portal Dashboard
4. **M-BE-08** — Token Package & Welcome Bonus: Admin จัดการ Token Packages สำเร็จรูป per Sub-Platform และ Welcome Bonus สำหรับ Tenant ใหม่
5. **M-BE-09** — Payment Settings Administration: จัดการ Bank Accounts, PromptPay/QR configs, Payment Channel toggles per Sub-Platform, Billing Terms 3-Layer Configuration (ขยายจาก FR70 ของ PRD เดิม)
6. **M-BE-10** — Analytics & Reporting: Revenue Analytics, API Usage Analytics, Customer & Service Analytics (ขยายจาก Health Dashboard ของ M-BE-12)
7. **M-FE-BO** — Central Backoffice Dashboard: Aggregated KPIs, Developer Portal Overview, Pending Action Items, Quick Navigation, Context Switching

### สิ่งที่ PRD นี้ไม่ครอบคลุม (อยู่ใน PRD เดิมแล้ว)

- Sub-Platform Management (M-BE-12) — CRUD, Branding, Lifecycle, Health Dashboard
- Tenant Management (M-BE-04) — CRUD, Suspend/Restore, Audit Log
- Cost Engine (M-BE-05) — Cost Config, Change Requests, Approval
- Price Engine (M-BE-06) — Margin, Snapshots, Price Lock, Subscription Plans
- Billing (M-BE-07) — Token Wallet, Invoice, Payment, Credit Line, Purchase Log, Refund
- Multi-Tenancy (X-MT-01) — 3-Layer Architecture, Data Isolation
- Tenant Service — SSO, Hub Page, Registration, RBAC

### What Makes This Special

PRD นี้แสดง **"First Plug-in"** ของ Platform Economy — Avatar เป็น Sub-Platform แรกที่ plug เข้ากับ Central Infrastructure ที่ PRD เดิมกำหนดไว้ รูปแบบ Hardware → Device → Preset → Session เป็น **template** ที่ Sub-Platform อื่นในอนาคต (เช่น Booking) สามารถ adapt ไปใช้ได้

Developer Portal เป็น **"Second Plug-in"** ที่ใช้ pattern เดียวกัน แต่แทนที่ Hardware + Device จะเป็น **API Preset** (bundle of AI Agents) ที่ sync จาก AI Framework และแทนที่ Prepaid Token จะใช้ **Credit Line** (ใช้ก่อนจ่ายทีหลัง) สำหรับ B2B Developer

Core Insight: Revenue Infrastructure อย่างเดียวไม่พอ — ต้องมี Operational Infrastructure ที่ทำให้ Admin จัดการ hardware, AI presets, API presets และ monitor sessions/usage ได้จริง ถึงจะ launch Sub-Platform ที่ "ทำเงินได้จริง" ตามเป้า PRD เดิม

## Project Classification

| Attribute | Value |
|-----------|-------|
| **Project Type** | SaaS B2B — Sub-Platform Operations PRD |
| **Domain** | AI Avatar Operations / Developer Portal Operations / IoT Device Management / Analytics / Platform Configuration |
| **Complexity** | High — 7 modules, IoT lifecycle, real-time sessions, credit line management, analytics |
| **Project Context** | Brownfield — ต่อยอดจาก Platform ที่มี PRD Pricing-Billing-MultiTenancy |

## Relationship to Existing PRDs

```
PRD: Pricing, Billing & Multi-Tenancy          PRD: Avatar Ops, Dev Portal Ops, Analytics & Platform Config
(Revenue Infrastructure)                        (Operational Infrastructure)
┌─────────────────────────────┐                ┌─────────────────────────────┐
│ M-BE-04: Tenant Mgmt       │                │ M-AV-01: Avatar Presets     │
│ M-BE-05: Cost Engine        │                │ M-AV-02: Hardware/Devices   │
│ M-BE-06: Price Engine       │◄──────────────►│ M-DP-02: Dev Portal Ops     │
│ M-BE-07: Billing            │  (ใช้ร่วมกัน)  │ M-BE-08: Token Packages     │
│ M-BE-12: Sub-Platform       │                │ M-BE-09: Payment Settings   │
│ X-MT-01: Multi-Tenancy      │                │ M-BE-10: Analytics          │
│ Tenant Service              │                │ M-FE-BO: Central Dashboard  │
└─────────────────────────────┘                └─────────────────────────────┘
```

**Integration Points ระหว่าง 2 PRDs:**
- M-AV-01 ใช้ Tenant data จาก M-BE-04 และ Token Deduction จาก M-BE-07
- M-AV-02 Device ผูกกับ Tenant จาก Tenant Service
- M-DP-02 ใช้ Credit Line จาก M-BE-07, Tenant data จาก M-BE-04, API Preset sync จาก AI Framework
- M-BE-08 Token Packages เป็น config ให้ Token Top-up ใน M-BE-07
- M-BE-09 Payment Settings เป็น config ให้ Payment Processing ใน M-BE-07
- M-BE-09 Billing Terms กำหนด default billing cycle/payment terms ให้ Credit Line ใน M-BE-07
- M-BE-10 Analytics อ่าน data จาก M-BE-07 (Revenue + Credit Line), Gateway (API Usage), M-BE-04 (Customers)

## Success Criteria

### User Success

**Platform Admin:**
- เพิ่ม Device ใหม่เข้าระบบ Hardware Inventory พร้อม Register Code ภายใน 1 นาที
- ดู Device ที่ online/offline ทั้งหมดใน real-time ไม่ต้อง SSH เข้า server
- Assign Avatar Preset ให้ Device ได้ทันทีจาก UI — ไม่ต้องพึ่ง DevOps
- ดู API Presets ที่ sync มาจาก AI Framework + Assign Endpoint ให้ Tenant ได้ทันที
- จัดการ Credit Line ของ Developer Portal Tenants (วงเงิน, รอบบิล, ยอดค้าง) จาก Tenant detail
- ดู Revenue trend, API usage, top customers ใน Analytics Dashboard เพื่อ decision making
- จัดการ Token Packages (สร้าง/แก้ไข/ลบ) สำหรับแต่ละ Sub-Platform โดยไม่ต้อง deploy code
- Configure bank accounts, payment channels, และ billing terms per Sub-Platform จาก Payment Settings
- จัดการ pending actions (verifications, credit requests, refunds) จาก Central Dashboard ได้ภายใน 3 clicks per item — ไม่ต้อง navigate ไปหลาย module

**Tenant Admin (Avatar):**
- Activate Device ด้วย Register Code → เริ่มใช้ Avatar Session ได้ทันที
- เห็น Avatar ที่ถูก assign ให้ Tenant ตัวเอง + devices ที่ใช้ได้
- เห็น session history + token consumption per session

**Developer (Developer Portal):**
- เรียก API Preset endpoints ที่ถูก assign ให้ — หักจาก Credit Line อัตโนมัติ
- ดู Credit Line balance, usage history, invoices จาก Developer Portal UI (M-DP-01)

### Business Success

| Metric | Target | Timeline |
|--------|--------|----------|
| Device activation rate | > 90% ของ devices ที่ขาย activate ภายใน 7 วัน | Launch + 3 เดือน |
| Device online rate | > 85% ของ activated devices online | ตั้งแต่ launch |
| Analytics adoption | Admin ใช้ Analytics dashboard > 3 ครั้ง/สัปดาห์ | Launch + 1 เดือน |
| Token Package conversion | > 30% ของ Tenant ซื้อ Token Package (ไม่ใช่แค่ Free plan) | Launch + 3 เดือน |
| Payment Settings config | ทุก Sub-Platform มี payment channel configured ก่อน activate | ตั้งแต่ launch |

### Technical Success

| Aspect | Requirement |
|--------|-------------|
| **Device Online Status** | Heartbeat check < 60 วินาที, UI update < 5 วินาที |
| **Session Data** | Live session data available ใน dashboard < 10 วินาที |
| **Analytics Data Freshness** | < 5 นาที สำหรับ revenue/usage data |
| **Analytics Query Performance** | Dashboard load < 3 วินาที สำหรับ 12 เดือน data |
| **Hardware Inventory** | รองรับ > 10,000 devices without performance degradation |

### Measurable Outcomes

| Outcome | Measurement | Definition of Done |
|---------|-------------|-------------------|
| Device lifecycle ครบ | Register → Sell → Activate → (Decommission) ครบ flow | ทุก step ทำจาก UI ได้ ไม่มี manual DB intervention |
| Avatar operations ครบ | Preset assign → Session start → Token deduct → Session end | E2E flow ทำงานถูกต้อง tokens หักจริง |
| Analytics ครบ 3 มิติ | Revenue + Usage + Customer analytics มีข้อมูลครบ | Dashboard แสดง real data ไม่ใช่ mock |
| Payment config ครบ | Bank + PromptPay + Channel toggles + Billing Terms per Sub-Platform | Invoice แสดง bank info ตาม Sub-Platform |

## Product Scope

### Production V1.0 — Full Production Release

**ทุกอย่างที่ต้องมีเพื่อ Avatar Sub-Platform ทำงานได้จริง:**

- **M-AV-01**: Avatar Preset management (sync จาก AI Framework, assign to Tenant, system default, slot limits per plan, compatible device models), Session monitoring (live + history), Avatar Dashboard (KPIs, live sessions, recent sessions), Avatar Tenant View, Onboarding Workflow
- **M-AV-02**: Device Model CRUD, Device Registration (auto-generated Register Code `AV-XXXXXX`, MAC Address required), Device Sale recording, Device Activation, Device Transfer (โอนไป Tenant อื่น), Device Decommissioning, Online/Offline Monitoring, Preset Assignment per Device, Assign Log, Bulk Import, CSV Export
- **M-DP-02**: API Preset management (sync จาก AI Framework — ชื่อ, คำอธิบาย, จำนวน Agents, เวอร์ชัน, วันที่อัพเดท), Assign Endpoint (N:N — ผูก API Preset → Tenant), Developer Portal Tenant View (เฉพาะ Tenants ที่ใช้ Developer Portal พร้อม Credit Line detail ใน Tenant), Developer Portal Dashboard
- **M-BE-08**: Token Package CRUD per Sub-Platform (name, token count, price, bonus, popular flag), Token Price Calculator, Welcome Bonus configuration (amount, change history), Token Deduction Priority Display
- **M-BE-09**: Bank Account CRUD (multiple accounts, default flag, Active/Inactive toggle, Sub-Platform assignment), PromptPay/QR CRUD (type, value, note, Sub-Platform assignment), Payment Channel toggles per Sub-Platform (Card 2C2P, Bank Transfer, PromptPay), Billing Terms 3-Layer Configuration (Platform Default → Per-Context Override → Resolution Preview)
- **M-BE-10**: Revenue Analytics (trend, by Sub-Platform, by plan tier, daily, top tenants), API Usage Analytics (daily calls, token breakdown, top customers), Customer & Service Analytics (service categories, active services)
- **M-FE-BO**: Central Dashboard (platform KPIs, Developer Portal overview card, pending actions with deep-links, quick navigation), Context Switching (Central ↔ Avatar ↔ Developer Portal), Sidebar with badge counters, Tenant Export CSV

### V2.0 (Future Enhancement)

- **Predictive Analytics**: AI-powered churn prediction, usage forecasting, pricing optimization
- **Advanced Device Management**: OTA firmware update, remote diagnostics, batch configuration
- **Voice Cloning Management**: จัดการ custom voice models per Tenant
- **Automated Onboarding**: Self-service device activation + auto-assign preset
- **Real-time Analytics**: WebSocket-based live dashboard update (< 1 วินาที)
- **Cross Sub-Platform Analytics**: เปรียบเทียบ metrics ระหว่าง Sub-Platforms

## User Journeys

### Journey 1: Platform Admin — "เตรียม Hardware + Avatar ให้ Sub-Platform พร้อมเปิดบริการ"

**Persona:** สมชาย — Central Admin ของ RealFact Platform (เดิมจาก PRD Pricing) หลังจากตั้ง Sub-Platform Avatar + Cost/Price/Plans เสร็จแล้ว (ตาม Journey 1 ของ PRD เดิม) ตอนนี้ต้องเตรียม Hardware และ AI ให้พร้อมรับ Tenant

**Opening Scene:** สมชายเปิด Backoffice เห็น Avatar Sub-Platform สถานะ Active แล้ว แต่ยังไม่มี Device และ Avatar Preset — ต้องเตรียมทั้งสองอย่างก่อน Tenant จะใช้งานได้

**Rising Action:**
1. สมชายเข้า **Central Dashboard** → เห็น KPI: Sub-Platforms 2 (Avatar Active, Booking Registered), Tenants 12, Revenue ฿45,230 → เห็น Pending Actions: 2 pending verifications, 1 credit request → คลิก deep-link ไปจัดการได้ทันที
2. สลับ Context ไป **"RealFact Avatar"** จาก dropdown → Sidebar เปลี่ยนเป็น Avatar menu
3. เข้า **Hardware → Device Models** → ตรวจว่ามี model "Avatar Kiosk 15-inch" อยู่แล้ว (synced จาก spec) → เพิ่ม model ใหม่ "Avatar Tablet 10-inch" (ชื่อ, ขนาด, resolution, spec)
4. เข้า **Hardware → Devices** → กด **"Add Device"** → ใส่ Serial Number `SN-2026-001`, MAC Address `AA:BB:CC:DD:EE:01`, ชื่อ "Lobby Kiosk", เลือก model → ระบบ auto-generate **Register Code `AV-A1B2C3`** → สถานะ: Registered
5. ทำซ้ำ 10 ครั้ง → หรือใช้ **Bulk Import** อัปโหลด CSV → devices 10 ตัวถูกเพิ่มทันที
6. ลูกค้า ABC Corp สั่งซื้อ 5 ตัว → สมชายกด **"Record Sale"** → เลือก 5 devices → assign ให้ Tenant "ABC Corp" → สถานะ: Sold
7. เข้า **Assign Avatar** (Service Builder) → เห็น Avatar Presets ที่ sync มาจาก AI Framework → เลือก "Corporate Assistant" → กด **Assign to Tenants** → เลือก ABC Corp + XYZ Ltd → แต่ละ Tenant ได้ preset ตาม slot limit ของ plan (Free: 1, Starter: 5, Pro: unlimited)
8. ตั้ง **System Default Preset** → เลือก "Welcome Bot" → กดดาว → ทุก Device ที่ activate โดยไม่มี preset จะใช้ตัวนี้

**Climax:** สมชายเปิด **Avatar Dashboard** → เห็น: Total Devices 10, Online 0 (ยังไม่ activate), Presets 3 → ทุกอย่างพร้อมรอ Tenant activate device

**Resolution:** เมื่อ Tenant แรก activate device → Dashboard แสดง live session ทันที → สมชายมั่นใจว่า operational infrastructure พร้อม 100%

**Requirements Revealed:**
- M-FE-BO: Central Dashboard + Context Switching
- M-AV-02: Device Model CRUD, Device Registration (Register Code + MAC Address), Bulk Import, Record Sale
- M-AV-01: Preset management, Tenant assignment (slot limits), System Default

---

### Journey 2: Tenant Admin — "Activate Device แรกและเริ่ม Avatar Session"

**Persona:** ปิยะ — Tenant Admin ของ startup (เดิมจาก Journey 3 ของ PRD Pricing) subscribe Avatar Starter Plan แล้ว ได้รับ device 2 ตัวจาก RealFact ต้อง activate และเริ่มใช้

**Opening Scene:** ปิยะได้รับ Avatar Kiosk 2 ตัว พร้อมกล่องที่มี Register Code `AV-A1B2C3` และ `AV-D4E5F6`

**Rising Action:**
1. ปิยะเปิด Avatar Kiosk → จอแสดง **"Enter Register Code"** → ใส่ `AV-A1B2C3` → ระบบ validate: device เป็นของ Tenant ปิยะ (ตรวจจาก Sale record) → สถานะเปลี่ยน: Sold → **Activated** → device เชื่อมต่อ server
2. Device ได้รับ **System Default Preset** "Welcome Bot" อัตโนมัติ → ปิยะเริ่มคุยกับ Avatar ได้ทันที
3. สมชาย (Admin) เห็นใน **Avatar Dashboard** → "Lobby Kiosk" ขึ้นสถานะ **Online** → Live Session เริ่ม → token ถูกหัก real-time ตาม Exchange Rate (1 token = 1 minute)
4. ปิยะ activate device ที่ 2 → กระบวนการเดียวกัน → 2 devices online

**จาก Backoffice (สมชาย):**
5. สมชายเข้า **Device Operations** → เห็น 2 devices online (green badge), แต่ละตัวแสดง: tenant, current preset, active session status
6. สมชายกด device "Lobby Kiosk" → เปิด detail → เห็น session history: Session ID, duration, tokens consumed
7. สมชาย **เปลี่ยน Preset** ของ "Lobby Kiosk" จาก "Welcome Bot" → "Corporate Assistant" → ระบบบันทึก **Assign Log**: old preset, new preset, actor, timestamp
8. Session ถัดไปของ "Lobby Kiosk" ใช้ "Corporate Assistant" → AI ตอบตาม agent prompt ที่กำหนด
9. หลังจากนั้น ABC Corp ต้องการโอน device 1 ตัวไปให้สาขาใหม่ (Tenant อื่น) → สมชายใช้ **Transfer Device** → เลือก Tenant ปลายทาง → ระบบอัปเดต ownership

**Climax:** สมชายเปิด **Avatar Dashboard** เห็น: Devices 10, Online 2, Sessions Today 5, Tokens Today 47 — ระบบทำงานสมบูรณ์

**Resolution:** สมชายเปิด **Avatar Tenant View** ของ Tenant ปิยะ → เห็น **Onboarding Checklist**: ✅ Subscription Active, ✅ Device Activated (2/2), ✅ First Session Completed, ☐ Custom Preset Assigned — Onboarding Progress 75% ครบทุก milestone ยกเว้น custom preset สมชาย assign "Corporate Assistant" → checklist update เป็น 100% → เมื่อ Tenant เพิ่มขึ้น Dashboard scale ได้ → device management ครบ lifecycle ไม่ต้อง manual

**Requirements Revealed:**
- M-AV-02: Device Activation (Register Code validation + Tenant matching), Online Monitoring, Preset Assignment, Assign Log, Device Transfer
- M-AV-01: System Default Preset auto-assign, Session tracking, Avatar Dashboard (live + history), **Onboarding Checklist (auto-tracked milestones per Tenant)**
- Token Deduction: ใช้ M-BE-07 Token Deduction จาก PRD เดิม

---

### Journey 3: Platform Admin — "วิเคราะห์ Revenue และ Usage เพื่อปรับกลยุทธ์"

**Persona:** สมชาย + วรรณา (Finance) — ต้องการดู Analytics เพื่อ decision making ตอนสิ้นเดือน

**Opening Scene:** ผ่านไป 3 เดือนหลัง launch — ผู้บริหารต้องการรายงาน revenue performance และ usage pattern

**Rising Action:**
1. สมชายเข้า **Analytics → Revenue & Billing** → เห็น:
   - Revenue MTD: ฿128,500, Revenue YTD: ฿312,000
   - **Revenue Trend Chart** (6 เดือน): Subscription revenue โตสม่ำเสมอ, Token Top-up มี spike เดือน 2
   - **Revenue by Sub-Platform** (donut): Avatar 65%, Booking 35%
   - **Revenue by Plan Tier**: Pro ฿89,000 (15 tenants), Starter ฿32,000 (22 tenants), Free ฿0 (45 tenants)
   - **Top Tenants by Spend**: ABC Corp ฿28,500, TechCorp ฿19,200, XYZ Ltd ฿15,800
2. เข้า **Analytics → API Usage** → เห็น:
   - API Calls Today: 12,450 | This Week: 78,320 | This Month: 312,500
   - **Daily API Calls Chart** (7 วัน): แนวโน้มเพิ่มขึ้น + input/output token breakdown
   - **Top 10 Customers by API Calls**: TechCorp นำ (Credit Line user — ใช้หนัก)
3. เข้า **Analytics → Customers & Services** → เห็น:
   - Service Categories: LLM 60%, Platform (Avatar Session) 25%, TTS 10%, Embedding 5%
   - Active Service Codes: 5/5 active
4. สมชายกด **Export CSV** → ส่งให้ผู้บริหาร
5. วรรณาเข้า **Analytics → Revenue & Billing** → ดู **Daily Revenue** (bar chart รายวัน) → เห็นวันที่ revenue drop → cross-check กับ Billing module → พบว่ามี overdue invoices 3 รายการ

**Climax:** ผู้บริหารเห็นว่า Avatar revenue โตดี แต่ Free-to-Paid conversion ต่ำ (45 Free vs 37 Paid) → ตัดสินใจปรับ Welcome Bonus + สร้าง Token Package โปรโมชัน

**Follow-up — Token Package + Welcome Bonus:**
6. สมชายเข้า **Plans → Token Packages** → ใช้ **Token Price Calculator** คำนวณราคาที่แข่งขันได้ → สร้าง Package ใหม่สำหรับ Avatar: "Starter Pack" (5,000 tokens, ฿2,000, bonus 500 tokens, flag: Popular) → Active
7. เข้า **Plans → Welcome Bonus** → เพิ่ม Welcome Bonus จาก 100 → 200 tokens → ระบบบันทึก change history (เดิม 100, ใหม่ 200, changed by admin@realfact.ai, วันที่)

**Follow-up — Payment Settings:**
8. Booking Sub-Platform กำลังจะ launch → สมชายเข้า **Payment Settings → Bank Accounts** → เพิ่ม bank account ใหม่ (KBank) → assign ให้ Booking
9. เข้า **Payment Channels** → เปิด Card (2C2P) + Bank Transfer สำหรับ Booking → ปิด PromptPay (ยังไม่พร้อม)
10. เข้า **Billing Terms** → ตั้ง Platform Default: Billing Cycle 30 วัน, Payment Terms Net 30 → ตั้ง Developer Portal override: Billing Cycle 60 วัน, Payment Terms Net 60

**Resolution:** Analytics ให้ data-driven insights → Token Packages + Welcome Bonus ปรับได้ทันที → Payment Settings + Billing Terms พร้อมสำหรับ Sub-Platform ใหม่

**Requirements Revealed:**
- M-BE-10: Revenue Analytics (trend, by platform, by tier, daily, top tenants), API Usage (daily, token breakdown, top customers), Customer & Service Analytics, Export CSV
- M-BE-08: Token Package CRUD, Token Price Calculator, Welcome Bonus configuration + change history
- M-BE-09: Bank Account CRUD, Payment Channel toggles per Sub-Platform, Billing Terms 3-Layer Configuration

---

### Journey 4: Platform Admin — "เตรียม Developer Portal + Assign API Preset ให้ Tenant"

**Persona:** สมชาย — Central Admin (ต่อจาก Journey 1-3) ต้องเตรียม Developer Portal ให้พร้อมรับ B2B Developers ที่จะใช้ API ผ่าน Credit Line

**Opening Scene:** สมชายเปิด Backoffice → สลับ Context เป็น **"Developer Portal"** → เห็น sidebar ใหม่: Dashboard, Tenants, API Presets, Assign Endpoint

**Rising Action:**
1. สมชายเข้า **API Presets** → เห็นรายการ presets ที่ sync มาจาก AI Framework:
   - "Customer Service Bundle" v2.1 — 3 agents (Chat Agent GPT-4o, Escalation Agent Claude, Summary Agent GPT-4o-mini)
   - "Sales Assistant" v1.0 — 2 agents (Sales Bot GPT-4o, Lead Qualifier GPT-4o-mini)
   - "RAG Engine" v3.2 — 1 agent (Document Search Claude)
2. สมชายกดดู detail ของ "Customer Service Bundle" → เห็น Agent List: ชื่อ, model ที่ใช้, role → เห็น Assigned Tenants: ยังไม่มี
3. เข้า **Tenants** → เห็นรายชื่อ Tenant ที่ subscribe Developer Portal: FinTech Co. (Pro), DataDriven Ltd. (Starter), SmartBot Inc. (Starter)
4. กด **FinTech Co.** → เห็น Tenant Detail + tab **Credit Line**:
   - Credit Limit: ฿100,000
   - Used Amount: ฿42,800
   - Available Credit: ฿57,200
   - Billing Cycle: 30 วัน
   - Payment Terms: Net 30
   - สถานะ: Active
   - ประวัติ Invoice: INV-DEV-202602-001 (฿38,500 — Paid)
5. เข้า **Assign Endpoint** → เลือก "Customer Service Bundle" → กด **Assign to Tenants** → เลือก FinTech Co. + DataDriven Ltd. → บันทึก → ทั้ง 2 Tenants เข้าถึง API Preset นี้ได้

**Climax:** สมชายเปิด **Developer Portal Dashboard** → เห็น: Active Tenants 3, Total API Presets 5, API Calls Today 1,250, Credit Line Usage ฿142,800/฿280,000

**Resolution:** เมื่อ Developer เรียก API → ระบบหัก Credit Line อัตโนมัติตาม Service Code rate → สิ้นรอบบิล auto-generate Invoice → ข้อมูลไหลไป Central Backoffice Billing

**Requirements Revealed:**
- M-DP-02: API Preset view (sync จาก AI Framework), Assign Endpoint (N:N), Tenant view + Credit Line detail, Dashboard
- M-BE-07: Credit Line deduction + Invoice generation (จาก PRD เดิม)
- M-FE-BO: Context Switching (Central ↔ Avatar ↔ Developer Portal)

---

### Journey Requirements Summary

| Capability Area | J1 (Setup) | J2 (Activate) | J3 (Analytics) | J4 (Dev Portal) |
|----------------|:-:|:-:|:-:|:-:|
| **Central Dashboard + Context Switching** | ✅ | | | ✅ |
| **Device Model CRUD** | ✅ | | | |
| **Device Registration + Register Code + MAC** | ✅ | ✅ | | |
| **Device Sale Recording** | ✅ | | | |
| **Device Activation** | | ✅ | | |
| **Device Online Monitoring** | | ✅ | | |
| **Device Transfer** | | ✅ | | |
| **Device Bulk Import** | ✅ | | | |
| **Preset Management (Avatar)** | ✅ | | | |
| **Preset Tenant Assignment + Slot Limits** | ✅ | | | |
| **System Default Preset** | ✅ | ✅ | | |
| **Preset-Device Assignment** | | ✅ | | |
| **Assign Log** | | ✅ | | |
| **Avatar Dashboard (Live + History)** | ✅ | ✅ | | |
| **Session Monitoring** | | ✅ | | |
| **API Preset Management (Dev Portal)** | | | | ✅ |
| **Assign Endpoint (N:N)** | | | | ✅ |
| **Dev Portal Tenant View + Credit Line** | | | | ✅ |
| **Dev Portal Dashboard** | | | | ✅ |
| **Revenue Analytics** | | | ✅ | |
| **API Usage Analytics** | | | ✅ | |
| **Customer & Service Analytics** | | | ✅ | |
| **Token Package CRUD + Calculator** | | | ✅ | |
| **Welcome Bonus Configuration** | | | ✅ | |
| **Bank Account CRUD** | | | ✅ | |
| **Payment Channel Config** | | | ✅ | |
| **Billing Terms 3-Layer** | | | ✅ | |
| **Export CSV** | ✅ | | ✅ | |

## Domain-Specific Requirements

### IoT / Hardware Domain

**Device Lifecycle:**
- Device เป็น physical hardware (Avatar Kiosk/Tablet) ที่ต้องจัดการ lifecycle ตั้งแต่โรงงานจนเลิกใช้
- Register Code เป็น key สำหรับ device activation — ต้อง unique, ไม่ reuse, format `AV-XXXXXX` (6 alphanumeric chars)
- MAC Address เป็น identifier สำหรับ network — format `XX:XX:XX:XX:XX:XX`, unique, ห้ามซ้ำ
- Online status ต้อง near real-time — device ส่ง heartbeat, server ตรวจจับ offline < 60 วินาที
- 1 Device ผูกกับ 1 Tenant (ผ่าน Sale record) — สามารถ Transfer ไป Tenant อื่นได้โดย Admin
- Device Decommission เป็น soft action — ข้อมูลยังเก็บอยู่เพื่อ audit

**Device ↔ Tenant ↔ Preset Relationship:**
```
Tenant (N:N via Membership from PRD เดิม)
├── Devices (1:N — each device sold to 1 tenant)
│   ├── Current Preset (1:1 — ณ เวลาใดเวลาหนึ่ง device มี 1 preset)
│   └── Sessions (1:N — history ของ sessions บน device นี้)
└── Available Presets (N:N — ถูก assign โดย Admin, จำกัดตาม plan slot)
```

### AI / ML Domain

**Avatar Preset Model:**
- Preset = configuration ของ AI Avatar ประกอบด้วย: character name, voice name, agent prompt, compatible device models
- Presets ถูก **sync จาก AI Framework** — Admin ไม่สร้าง preset เอง แต่จัดการ assignment และ configuration
- Slot Limit per Plan: Free = 1 preset, Starter = 5 presets, Pro = unlimited
- System Default Preset = preset ที่ใช้เมื่อ device activate โดยไม่มี preset กำหนดไว้

**API Preset Model (Developer Portal):**
- API Preset = bundle of AI Agents ที่เตรียมไว้ให้ Developer เรียกใช้ผ่าน API Endpoint
- Presets ถูก **sync จาก AI Framework** — เช่นเดียวกับ Avatar Preset, Admin ไม่สร้างเอง แค่รับข้อมูลมาจัดการ assignment
- แต่ละ API Preset ประกอบด้วย:
  - **ชื่อ** (Name): ชื่อ Preset เช่น "Customer Service Bundle"
  - **คำอธิบาย** (Description): อธิบายว่า Endpoint ทำอะไร
  - **จำนวน Agents** (Agent Count): จำนวน AI Agents ภายใน Preset
  - **Agent List**: รายละเอียดของแต่ละ Agent (ชื่อ, model ที่ใช้, role/หน้าที่)
  - **เลขเวอร์ชัน** (Version): semver ของ API Preset
  - **วันที่อัพเดทล่าสุด** (Last Updated)
  - **สถานะ** (Status): Active / Draft / Deprecated
- Assignment: N:N — 1 API Preset ผูกได้หลาย Tenants, 1 Tenant ผูกได้หลาย API Presets
- รองรับ 1:1 clone ในอนาคตจาก N:N assignment เดิม

**API Preset ↔ Tenant ↔ Credit Line Relationship:**
```
Tenant (Developer Portal)
├── Assigned API Presets (N:N — ถูก assign โดย Admin ผ่าน Assign Endpoint)
│   └── Agents (1:N — แต่ละ Preset มีหลาย Agents)
├── Credit Line (1:1 — วงเงิน, ยอดใช้, คงเหลือ, รอบบิล)
│   ├── API Usage → หักจาก Credit Line ตาม Service Code rate
│   └── Invoices (1:N — auto-generate ทุกรอบบิล)
└── API Call History (1:N — log ทุก API call)
```

### Developer Portal Billing Domain

**Credit Line Model (B2B Post-paid):**
- Developer Portal ใช้ **Credit Line** — ใช้ก่อนจ่ายทีหลัง (ไม่ใช่ Prepaid Token เหมือน Avatar)
- Credit Line management อยู่ใน **Tenant detail** (ไม่ใช่เมนูแยก)
- Credit Line ประกอบด้วย: Credit Limit, Used Amount, Available Credit, Billing Cycle (30/60/90 days), Payment Terms (Net 15/30/60)
- เมื่อ Available Credit = 0 → **Hard Block ทันที** — API return error
- สิ้นรอบบิล → Auto-generate Invoice → ข้อมูลไหลไป Central Backoffice Billing
- Token Deduction per API call: หักตาม Service Code rate ของ Agent ที่ถูกเรียกใช้
- ข้อมูล Credit Line invoices แสดงใน Central Backoffice Billing รวมกับ Avatar invoices
- Billing Terms (Billing Cycle + Payment Terms) resolve ตาม 3-layer priority: Per-Tenant → Per-Context → Platform Default

### Real-time Operations

**Session Management (Avatar):**
- Avatar Session = การสนทนาระหว่าง user กับ AI Avatar ผ่าน device
- Session data: device, tenant, preset, start/end time, duration, tokens consumed
- Live sessions แสดงใน dashboard แบบ real-time (LIVE indicator)
- Token deduction ใช้ mechanism จาก M-BE-07 (PRD เดิม) — Exchange Rate: 1 token = 1 minute สำหรับ Avatar

**API Usage (Developer Portal):**
- API Call = Developer เรียก API Preset endpoint 1 ครั้ง
- Usage data: tenant, API preset, agent(s) used, timestamp, tokens consumed, credit deducted
- Credit Line deduction ใช้ mechanism จาก M-BE-07 (PRD เดิม) — อัตราตาม Service Code ของแต่ละ Agent

## Functional Requirements

### 1. Hardware & Device Management (M-AV-02)

#### Device Models

- **FR1:** Platform Admin สามารถสร้าง Device Model (ชื่อ, ขนาดจอ, resolution, spec, สถานะ)
- **FR2:** Platform Admin สามารถแก้ไขและ Discontinue Device Model — Discontinue ได้เสมอ, ลบได้เมื่อไม่มี device ใช้ model นี้
- **FR3:** Platform Admin สามารถดูรายการ Device Models ทั้งหมดพร้อม spec, device count, และ status

#### Device Lifecycle

- **FR4:** Platform Admin สามารถเพิ่ม Device ใหม่ (Serial Number, MAC Address, ชื่อ, Model) — ระบบ auto-generate Register Code format `AV-XXXXXX` (6 chars alphanumeric uppercase) ที่ unique
- **FR5:** MAC Address ต้อง unique ทั้งระบบ, format `XX:XX:XX:XX:XX:XX` — ระบบ validate format และ uniqueness ก่อนบันทึก
- **FR6:** Register Code ต้อง unique ทั้งระบบ, ห้ามซ้ำ, ห้าม reuse แม้ device ถูก decommission
- **FR7:** Platform Admin สามารถ Record Sale — เลือก devices (สถานะ Registered) แล้ว assign ให้ Tenant → สถานะ: Sold
- **FR8:** Tenant สามารถ Activate Device ด้วย Register Code — ระบบ validate ว่า device ถูกขายให้ Tenant นี้ → สถานะ: Sold → Activated
- **FR9:** Device Activation ต้อง validate: Register Code ถูกต้อง + device เป็นของ Tenant ที่ login → ถ้าไม่ตรง reject ทันที
- **FR10:** Platform Admin สามารถ Decommission Device → สถานะ: Decommissioned — ข้อมูลยังเก็บอยู่เพื่อ audit
- **FR11:** Device Lifecycle เป็น one-way: Registered → Sold → Activated → Decommissioned — ไม่สามารถย้อนกลับ (ยกเว้น Sold → Registered โดย Admin ถ้ายังไม่ activate)
- **FR12:** Platform Admin สามารถแก้ไขชื่อ Device ได้ทุกสถานะ

#### Bulk Operations

- **FR13:** Platform Admin สามารถ Bulk Import devices จาก CSV file (columns: Serial Number, MAC Address, Name, Model, Register Code optional)
- **FR14:** ระบบ validate CSV ทุก row ก่อน import — แจ้ง errors per row (duplicate S/N, invalid MAC format), import เฉพาะ rows ที่ผ่าน, auto-generate Register Code ถ้าไม่ระบุ
- **FR15:** Platform Admin สามารถ Export Device Inventory เป็น CSV (columns: S/N, MAC Address, Name, Model, Register Code, Status, Sold To, Dates)

#### Device Operations & Monitoring

- **FR16:** ระบบแสดง Online/Offline status ของทุก Activated Device — update < 5 วินาทีบน UI
- **FR17:** ระบบตรวจจับ device offline เมื่อไม่ได้รับ heartbeat เกิน 60 วินาที
- **FR18:** Platform Admin สามารถดู Device Grid แสดง: ชื่อ, S/N, online/offline badge, active session badge, tenant, current preset
- **FR19:** Platform Admin สามารถดู Device Detail: status, tenant, model, online status, current preset, session history, assign log
- **FR20:** ระบบแสดง Offline Devices Warning Banner เมื่อมี activated devices ที่ offline
- **FR21:** Platform Admin สามารถ filter devices ตาม status, tenant, online/offline

#### Device Transfer

- **FR22:** Platform Admin สามารถ Transfer Device ไป Tenant อื่น — ระบบอัปเดต ownership (soldTo) และบันทึก Assign Log พร้อม actor + timestamp

### 2. Avatar Preset & Session Management (M-AV-01)

#### Preset Management

- **FR23:** ระบบ sync Avatar Presets จาก AI Framework — AI Framework push updates เมื่อ preset มีการเปลี่ยนแปลง (create/update/deprecate) ระบบ validate payload schema ก่อน upsert, บันทึก sync log (success/failure/conflict) ทุกครั้ง, แสดง Last Synced timestamp + Manual Sync button บน UI, กรณี sync fail ระบบ retry 3 ครั้ง (exponential backoff) แล้วแจ้ง Admin via notification — conflict resolution ใช้ remote-wins strategy (AI Framework เป็น source of truth)
- **FR24:** Platform Admin สามารถดู Preset list: ชื่อ, avatar character, voice, status, suggested flag, assigned tenants
- **FR25:** Platform Admin สามารถแก้ไข Preset เฉพาะ local-override fields: agent prompt (text, max 10,000 chars) และ compatible device models (multi-select จาก active Device Models) — fields ที่ sync มาจาก AI Framework (ชื่อ, avatar character, voice, LLM model) เป็น read-only ห้ามแก้ไข, การ sync ครั้งถัดไปไม่ overwrite local-override fields
- **FR26:** Platform Admin สามารถ Assign Preset ให้ Tenant (multi-select) — จำนวน preset ถูกจำกัดตาม Slot Limit ของ Plan (Free: 1, Starter: 5, Pro: unlimited)
- **FR27:** ระบบ enforce Slot Limit — ถ้า Tenant เกิน limit ระบบ reject การ assign พร้อมแจ้งเหตุผล
- **FR28:** Platform Admin สามารถตั้ง **System Default Preset** — device ที่ activate โดยไม่มี preset กำหนดจะใช้ preset นี้อัตโนมัติ
- **FR29:** ระบบแสดง "System Default" badge บน preset ที่เป็น default
- **FR30:** Platform Admin สามารถ Assign Preset ให้ Device เฉพาะตัว — override System Default โดยต้องเป็น preset ที่ compatible กับ device model
- **FR31:** ระบบบันทึก **Assign Log** ทุกครั้งที่เปลี่ยน Preset บน Device: timestamp, device, old preset, new preset, actor

#### Session Management

- **FR32:** ระบบแสดง Active Sessions แบบ real-time ใน Avatar Dashboard — แสดง: LIVE indicator, device, tenant, preset, start time
- **FR33:** ระบบบันทึก Session ทุกครั้ง: Session ID, device (S/N + name), tenant, preset, start time, end time, duration, tokens consumed, status (active/completed)
- **FR34:** Platform Admin สามารถดู Session History per Device — sorted by time descending, filterable by date range and tenant
- **FR35:** ระบบคำนวณ token consumption per session ตาม Exchange Rate ของ Sub-Platform

#### Avatar Dashboard

- **FR36:** Avatar Dashboard แสดง KPIs 7 ตัว: Total Devices, Online Devices, Pending Activation (Sold ยังไม่ activate), Sessions Today, Tokens Today, Active Presets, Self-Activate Rate
- **FR37:** Avatar Dashboard แสดง Summary Banner: Live Sessions, Active Tenants, Offline Devices
- **FR38:** Avatar Dashboard แสดง Active Sessions list (real-time) + Recent Completed Sessions table (Session ID, Device, Tenant, Preset, Duration, Tokens, Time)
- **FR39:** Avatar Dashboard แสดง Quick Action shortcuts ไปยัง: Hardware Inventory, Device Operations, Assign Avatar

#### Avatar Tenant View

- **FR40:** Platform Admin สามารถดู Avatar-specific Tenant list — filter เฉพาะ Tenants ที่ subscribe Avatar
- **FR41:** Avatar Tenant View แสดง: tenant name, plan chip, device count, token balance, renew date, subscription status, actions
- **FR42:** Avatar Tenant Detail แสดง: assigned devices (พร้อม online/offline status + current preset), assigned avatar presets, token wallet breakdown (Total/Subscription/Purchased), recent token activity, quick navigation ไปยัง Devices/Assign Avatar

#### Onboarding Workflow

- **FR43:** ระบบแสดง Onboarding Checklist สำหรับ Tenant ใหม่ของ Avatar — แสดง steps ทั้งหมดพร้อม actor (Tenant/Admin/System) และ completion status
- **FR44:** Onboarding Checklist steps ประกอบด้วย: Register → Subscribe → Ship Device → Activate Device → Assign Preset → First Session → (completion milestones)

### 3. Developer Portal Backoffice Operations (M-DP-02)

> **Note:** M-DP-01 (Developer Portal — Tenant-facing UI) อยู่ใน PRD เดิม — M-DP-02 คือ Backoffice management module สำหรับ Admin จัดการ API Presets, Assign Endpoint และ Tenant Credit Lines

#### API Preset Management

- **FR45:** ระบบ sync API Presets จาก AI Framework — AI Framework push updates เมื่อ API Preset มีการเปลี่ยนแปลง (create/update/deprecate) ระบบรับข้อมูล: preset name, description, agent list, version, status แล้ว upsert โดย match ด้วย preset ID จาก AI Framework, บันทึก sync log ทุกครั้ง, แสดง Last Synced timestamp + Manual Sync button บน UI, กรณี sync fail ระบบ retry 3 ครั้ง (exponential backoff) แล้วแจ้ง Admin — Admin ไม่สร้าง preset เอง แค่จัดการ assignment
- **FR46:** Platform Admin สามารถดู API Preset list แสดง: ชื่อ, คำอธิบาย, จำนวน Agents ภายใน, เลขเวอร์ชัน, วันที่อัพเดทล่าสุด, สถานะ (Active/Draft/Deprecated), จำนวน Assigned Tenants
- **FR47:** Platform Admin สามารถดู API Preset Detail แสดง: Agent List (ชื่อ Agent, model ที่ใช้, role/หน้าที่), Assigned Tenants list, Version History
- **FR48:** Platform Admin สามารถ filter API Presets ตาม: สถานะ (All/Active/Draft/Deprecated), search by name
- **FR49:** ระบบแสดง API Presets stats: Total Presets, Active Presets, Total Agents (sum across all presets), Assigned Tenants count

#### Assign Endpoint

- **FR50:** Platform Admin สามารถ Assign API Preset ให้ Tenant (multi-select) — ผูกแบบ N:N (1 Preset → หลาย Tenants, 1 Tenant → หลาย Presets)
- **FR51:** Assign Endpoint modal แสดง: API Preset name, checkbox list ของ Tenants (ชื่อ, ID, current credit status), pre-checked สำหรับ Tenants ที่ถูก assign อยู่แล้ว
- **FR52:** ระบบแสดง warning ถ้า Tenant ที่เลือกมี Credit Line exhausted (Available Credit = 0) — ยังอนุญาตให้ assign ได้แต่แจ้งเตือน
- **FR53:** ระบบแสดง Assignment Overview: Per API Preset card แสดง assigned tenant count, tenant names with credit health indicator (color-coded)

#### Developer Portal Tenant View

- **FR54:** Platform Admin สามารถดู Developer Portal Tenant list — filter เฉพาะ Tenants ที่ subscribe Developer Portal
- **FR55:** Developer Portal Tenant list แสดง: tenant name, status, assigned API presets count, credit limit, credit used, credit health, API calls this month
- **FR56:** Developer Portal Tenant Detail แสดง:
  - ข้อมูลทั่วไป: ชื่อ, สถานะ, วันที่สมัคร, API Calls Today/Month
  - Assigned API Presets list (พร้อม version + agent count)
  - **Credit Line section**: Credit Limit, Used Amount, Available Credit (progress bar), Billing Cycle, Payment Terms, Status, Approved Date, Approved By
  - Invoice History: รายการ invoices ของ Credit Line (INV ID, amount, status, date)
- **FR57:** Platform Admin สามารถแก้ไข Credit Line settings ของ Tenant: Credit Limit, Billing Cycle, Payment Terms, Status — ระบบบันทึก change history ไปยัง Credit Approval Log (sync กับ Central Backoffice Billing)
- **FR58:** ระบบแสดง Credit Line health indicator: สี (green > 50%, yellow 20-50%, red < 20%) ตาม Available Credit / Credit Limit

#### Developer Portal Dashboard

- **FR59:** Developer Portal Dashboard แสดง KPIs 4 ตัว: Active Tenants (Developer Portal), Total API Presets (Active/Total), API Calls Today (across all tenants), Total Credit Usage / Total Credit Limit
- **FR60:** Developer Portal Dashboard แสดง Credit Line Summary table: Tenant, Credit Limit, Used, Available, Health (progress bar color-coded)
- **FR61:** Developer Portal Dashboard แสดง Top Tenants by API Usage: ranked list with tenant name, API calls, horizontal progress bar
- **FR62:** Developer Portal Dashboard แสดง API Preset Assignment Overview table: preset name, version, agent count, assigned tenant count, status

### 4. Analytics & Reporting (M-BE-10)

> **Note:** Health Dashboard ของ Sub-Platform (uptime, error rate) อยู่ใน M-BE-12 ของ PRD เดิม (FR26) — ไม่ซ้ำกับ Analytics ที่นี่ซึ่งเน้น business intelligence. Revenue Analytics รวมข้อมูล Credit Line invoices จาก Developer Portal ด้วย

#### Revenue Analytics

- **FR63:** ระบบแสดง Revenue KPIs: Revenue MTD, Revenue YTD, Subscription revenue this month, Token Top-up revenue this month
- **FR64:** ระบบแสดง Revenue Trend Chart (area chart, multi-series: Subscriptions vs Token Top-ups) — ย้อนหลัง 6-12 เดือน
- **FR65:** ระบบแสดง Revenue by Sub-Platform (donut chart + absolute amounts)
- **FR66:** ระบบแสดง Revenue by Sub-Platform (grouped bar chart — monthly breakdown)
- **FR67:** ระบบแสดง Daily Revenue (bar chart — per day ของเดือนปัจจุบัน)
- **FR68:** ระบบแสดง Revenue by Plan Tier (horizontal progress bars + tenant counts per tier)
- **FR69:** ระบบแสดง Top Tenants by Spend (ranked list: tenant name, DP badge if Developer Portal tenant, total revenue)

#### API Usage Analytics

- **FR70:** ระบบแสดง API Usage KPIs: API Calls Today, API Calls This Week, API Calls This Month, Total Tokens This Month
- **FR71:** ระบบแสดง Daily API Calls Chart (line/bar — last 7 days) พร้อม input/output token breakdown
- **FR72:** ระบบแสดง Top 10 Customers by API Calls (horizontal bar chart)

#### Customer & Service Analytics

- **FR73:** ระบบแสดง Customer KPIs: Total Tenants (platform + DP), Active Tenants, Active Services, Categories
- **FR74:** ระบบแสดง Customer Status breakdown (donut: Active/Suspended/Pending)
- **FR75:** ระบบแสดง Services by Category breakdown (donut: LLM, Platform, TTS, Embedding)

#### Common Analytics Features

- **FR76:** ทุก Analytics page แสดง Last Refreshed timestamp + Refresh button
- **FR77:** ทุก Analytics page มี Export CSV button — download ข้อมูลเป็น CSV พร้อม BOM-prefixed UTF-8
- **FR78:** Analytics data freshness < 5 นาที — ข้อมูล transaction/event (billing, API call, session) ที่เกิดขึ้นในระบบต้องปรากฏบน Analytics dashboard ภายใน 5 นาทีนับจาก event timestamp (วัดโดย: event_timestamp vs analytics_query_result_timestamp) ทุก Analytics page แสดง "Data as of: [timestamp]"

### 5. Token Package & Welcome Bonus Configuration (M-BE-08)

#### Token Packages

- **FR79:** Platform Admin สามารถสร้าง Token Package per Sub-Platform: ชื่อ, จำนวน tokens, ราคา, bonus tokens, "Popular" flag, สถานะ
- **FR80:** Platform Admin สามารถแก้ไข Token Package (ชื่อ, tokens, bonus, ราคา, Popular flag) และ toggle สถานะ Active/Inactive
- **FR81:** ระบบแสดง Token Packages grouped by Sub-Platform — แสดง: ชื่อ, tokens, bonus, total ที่ได้รับ, price, price/token (auto-calculated), popular badge, status
- **FR82:** ระบบคำนวณ Price per Token อัตโนมัติจาก price ÷ tokens
- **FR83:** Token Package ที่ Active จะแสดงเป็นตัวเลือกสำหรับ Tenant ตอน Top-up (ใช้ร่วมกับ M-BE-07 Token Top-up จาก PRD เดิม)

#### Token Price Calculator

- **FR84:** ระบบแสดง Token Price Calculator: กรอก จำนวน Tokens, ราคา THB, Bonus Tokens → คำนวณ ราคาต่อ Token, Tokens รวม (base + bonus), ส่วนลดเทียบกับ base package

#### Welcome Bonus

- **FR85:** Platform Admin สามารถตั้ง Welcome Bonus token amount สำหรับ Tenant ใหม่ทั้งระบบ
- **FR86:** ระบบบันทึก Welcome Bonus Change History: old value, new value, changed by, date
- **FR87:** ระบบแจ้งเตือนเมื่อ Welcome Bonus สูงกว่า plan สูงสุด 10 เท่า (confirmation required ด้วย danger confirm)
- **FR88:** Welcome Bonus ถูกเครดิตเข้า Token Wallet ของ Tenant ใหม่แบบ atomic ภายใน registration transaction เดียวกัน — ถ้า wallet credit ล้มเหลว registration ต้อง rollback, ใช้ registration_id เป็น idempotency key ป้องกัน double credit, audit log บันทึก: tenant_id, bonus_amount, credited_at

#### Token Deduction Priority

- **FR89:** ระบบแสดง Token Deduction Priority เป็น read-only reference: 1. Subscription Tokens (reset ทุก billing cycle) → 2. Welcome Bonus Tokens (one-time, no expiry) → 3. Purchased Tokens (stackable, no expiry)

### 6. Payment Settings Administration (M-BE-09)

> **Note:** PRD เดิม FR65 กำหนดว่า Tenant ชำระผ่าน 3 ช่องทาง (2C2P, Bank Transfer, Company QR) และ FR70 กำหนดว่า Finance Admin configure bank account info — PRD นี้ขยายรายละเอียด CRUD management และ Billing Terms ที่ PRD เดิมไม่ได้ระบุ

#### Bank Accounts

- **FR90:** Finance Admin สามารถเพิ่ม Bank Account: bank (SCB/KBank/BBL/KTB/BAY/GSB), เลขบัญชี, ชื่อบัญชี, สาขา
- **FR91:** Finance Admin สามารถ assign Bank Account ให้ Sub-Platform (multi-select) — Invoice ของ Sub-Platform นั้นจะแสดง bank info ตามที่ assign
- **FR92:** Finance Admin สามารถตั้ง Default Bank Account — ใช้เมื่อ Sub-Platform ไม่มี assignment เฉพาะ (default มีได้แค่ 1 account, ตั้ง default ใหม่จะยกเลิก default เดิม)
- **FR93:** Finance Admin สามารถแก้ไข Bank Account (ข้อมูลธนาคาร + assigned Sub-Platforms)
- **FR94:** Finance Admin สามารถ toggle Bank Account สถานะ Active/Inactive — Inactive account จะไม่แสดงใน Invoice

#### PromptPay / QR

- **FR95:** Finance Admin สามารถเพิ่ม PromptPay/QR config: type (Tax ID / Phone), value, note/ชื่อบัญชี, QR image
- **FR96:** Finance Admin สามารถ assign PromptPay config ให้ Sub-Platform (multi-select)
- **FR97:** Finance Admin สามารถแก้ไข PromptPay config และ toggle สถานะ Active/Inactive

#### Payment Channel Toggles

- **FR98:** Platform Admin สามารถเปิด/ปิด Payment Channels per Sub-Platform: Card (2C2P), Bank Transfer, PromptPay — ช่องทางที่ปิดจะไม่แสดงให้ Tenant เห็นในขั้นตอนชำระเงิน
- **FR99:** ระบบ enforce ว่า Sub-Platform ต้องมีอย่างน้อย 1 payment channel เปิดก่อน activate (precondition ของ M-BE-12 Lifecycle)

#### Billing Terms Configuration

- **FR100:** Platform Admin สามารถตั้ง Platform Default Billing Terms: Default Billing Cycle (15/30/60/90 วัน), Default Payment Terms (Net 15/30/60/90), Auto-generate Invoice toggle, Hard Block at 0 Credit toggle
- **FR101:** Platform Admin สามารถตั้ง Per-Context Override: แต่ละ context (Developer Portal, etc.) เลือก "ใช้ Platform Default" หรือ custom Billing Cycle + Payment Terms
- **FR102:** ระบบแสดง Billing Terms Resolution Preview table: แต่ละ context แสดง resolved Billing Cycle, resolved Payment Terms, และ source (Platform Default หรือ Custom)
- **FR103:** Billing Terms ใช้กับลูกค้าแบบ Credit Line เท่านั้น — ลูกค้าแบบ Subscription ใช้รอบบิลตาม Plan ที่สมัคร

#### Payment Settings KPIs

- **FR104:** Payment Settings page แสดง KPIs: Bank Accounts count (Active), PromptPay/QR configs count (Active), Sub-Platforms configured count, Total active payment channels

### 7. Central Backoffice Dashboard & Navigation (M-FE-BO)

#### Central Dashboard

- **FR105:** Central Dashboard แสดง 4 KPI cards: Sub-Platforms count (Active), Total Tenants (platform + DP, active/suspended breakdown), Monthly Revenue (THB), Pending Actions count (red border + warning ถ้า > 0)
- **FR106:** Central Dashboard แสดง Sub-Platform cards (grid): ชื่อ, domain, status chip, tenants count, revenue, token usage, token exchange rate, plan chips
- **FR107:** Central Dashboard แสดง **Developer Portal Overview Card** (purple accent, แยกจาก SP cards): Active Tenants, API Presets (active/total), API Calls/Month, Credit Usage progress bar (color-coded: green <50%, yellow <80%, red >=80%) + "ใกล้เต็มวงเงิน" warning chip ถ้ามี tenant ที่ usage สูง
- **FR108:** Central Dashboard แสดง Plan Distribution per Sub-Platform: Pro / Starter / Free counts พร้อม price labels
- **FR109:** Central Dashboard แสดง **Pending Action Items** panel: overdue invoices, pending slip verifications, pending credit line requests, pending refunds — แต่ละ item มี **deep-link** ไปยังหน้าจัดการโดยตรง
- **FR110:** Central Dashboard แสดง Quick Navigation shortcuts ไปยัง frequently used pages (Sub-Platforms, Tenant Management, Billing, Cost & Pricing, Developer Portal)

#### Context Switching

- **FR111:** Backoffice UI รองรับ Context Switching ผ่าน dropdown: "Central Backoffice" (Platform-level) ↔ "RealFact Avatar" (Sub-Platform level) ↔ "Developer Portal" (API Management) ↔ (Sub-Platforms อื่นในอนาคต)
- **FR112:** Sidebar menu เปลี่ยนตาม context ที่เลือก — Central context แสดง platform menu, Avatar context แสดง avatar menu (Dashboard, Tenants, Hardware, Devices, Assign Avatar), Developer Portal context แสดง DP menu (Dashboard, Tenants, API Presets, Assign Endpoint)
- **FR113:** ระบบจำ context ล่าสุดของ user — persist across page refresh โดยเมื่อ user กลับมาเปิด Backoffice ระบบ restore context เดิมอัตโนมัติ

#### Sidebar & Navigation

- **FR114:** Sidebar แสดง **Badge Counters** real-time: Pending Verifications, Pending Credit/Refund, Pending Change Requests, Overdue Invoices
- **FR115:** Badge counters update ภายใน 3 วินาทีหลัง state เปลี่ยน (approve/reject/create) ผ่าน server push — fallback: ถ้า real-time connection ขาด ระบบ polling ทุก 30 วินาที, badge แสดง count จาก API query (source of truth)
- **FR116:** Sidebar รองรับ Collapsible Groups สำหรับ nested navigation (Cost & Pricing, Plans & Packages, Billing, Analytics)
- **FR117:** Sidebar รองรับ hover-to-expand (collapsed: icon only → expanded: icon + label) + pin lock button

#### Tenant Export

- **FR118:** Platform Admin สามารถ Export Tenant list (platform + DP tenants) เป็น CSV (columns: ID, Name, Email, Source, Subscriptions/Type, Token Balance/Credit Used, Monthly Revenue, Status, Joined)

## Non-Functional Requirements

### Performance

| NFR | Requirement | Measurement |
|-----|-------------|-------------|
| **NFR-AP1** | Device online status update latency | < 5 วินาทีบน UI หลัง device status เปลี่ยน |
| **NFR-AP2** | Live session data refresh | < 10 วินาทีบน Avatar Dashboard |
| **NFR-AP3** | Analytics dashboard initial load | < 3 วินาที สำหรับ 12 เดือน data |
| **NFR-AP4** | Analytics chart render | < 1 วินาทีหลัง data loaded |
| **NFR-AP5** | Device grid render | < 2 วินาทีสำหรับ 500+ devices |
| **NFR-AP6** | Bulk Import CSV processing | < 30 วินาทีสำหรับ 1,000 devices |
| **NFR-AP7** | Context switching | < 500ms sidebar + content update |
| **NFR-AP8** | Session history query | < 2 วินาทีสำหรับ 100K+ sessions with pagination |

### Security

| NFR | Requirement | Measurement |
|-----|-------------|-------------|
| **NFR-AS1** | Register Code unpredictability | Cryptographically random (128-bit entropy minimum) — collision probability < 1 in 10^9 สำหรับ 100K devices, ใช้ CSPRNG เท่านั้น |
| **NFR-AS2** | Device Activation authorization | ระบบ reject activation ภายใน < 1 วินาทีถ้า device-tenant ownership ไม่ตรง — ป้องกัน unauthorized activation 100% (zero false positive) |
| **NFR-AS3** | Analytics data access | RBAC enforced — Finance เห็น Revenue, Admin เห็นทุกอย่าง |
| **NFR-AS4** | Payment Settings modification | Finance Admin + Super Admin only — audit log ทุก change |

### Reliability & Availability

| NFR | Requirement | Measurement |
|-----|-------------|-------------|
| **NFR-AR1** | Device heartbeat service uptime | 99.9% measured monthly (< 43.2 นาที downtime/เดือน) — ถ้าล่ม device online status ไม่ update, วัดจาก uptime monitoring |
| **NFR-AR2** | Session data durability | Zero session data loss — ทุก session ต้องถูกบันทึก |
| **NFR-AR3** | Analytics data availability | 99.5% — degradation graceful (แสดง cached data ถ้า source ไม่พร้อม) |
| **NFR-AR4** | Assign Log immutability | Append-only — ห้ามแก้ไข/ลบ assign log entries, ตรวจสอบโดย audit integrity check (ไม่มี UPDATE/DELETE operations บน assign_log table) |
| **NFR-AR5** | Welcome Bonus change history | Append-only — ห้ามแก้ไข/ลบ change history entries, ตรวจสอบโดย audit integrity check (ไม่มี UPDATE/DELETE operations บน bonus_change_history table) |

### Scalability

| NFR | Requirement | Measurement |
|-----|-------------|-------------|
| **NFR-ASC1** | Device capacity | > 10,000 devices — Device grid renders < 2 วินาที, search/filter < 1 วินาที, bulk operations < 30 วินาที at 10K devices (วัดจาก load testing) |
| **NFR-ASC2** | Concurrent sessions | > 500 simultaneous active sessions |
| **NFR-ASC3** | Analytics data retention | 24 เดือน hot data, 5 ปี cold storage |
| **NFR-ASC4** | Session history | > 1M sessions queryable with pagination |

## Implementation Considerations

### Dependencies on PRD เดิม (Pricing, Billing & Multi-Tenancy)

| This Module | Depends On | Dependency Type |
|-------------|-----------|-----------------|
| M-AV-01 (Sessions) | M-BE-07 Token Deduction | Token หัก per session ตาม Exchange Rate |
| M-AV-01 (Slot Limits) | M-BE-06 Subscription Plans | Plan tier กำหนด preset slot limit |
| M-AV-02 (Device Sale) | Tenant Service | Device assign ให้ Tenant ที่ registered แล้ว |
| M-AV-02 (Activation) | Tenant Service JWT | Validate tenant context ตอน activate |
| M-DP-02 (API Presets) | AI Framework | Preset data sync จาก AI Framework |
| M-DP-02 (Assign Endpoint) | M-BE-04 Tenant | Tenant ที่ subscribe Developer Portal |
| M-DP-02 (Credit Line) | M-BE-07 Credit Line | Credit Line management + Invoice generation |
| M-DP-02 (Tenants) | M-BE-04, M-BE-07 | Tenant data + Credit Line + Billing data |
| M-BE-08 (Token Packages) | M-BE-07 Token Top-up | Packages เป็น config สำหรับ top-up flow |
| M-BE-08 (Welcome Bonus) | Tenant Service Registration | Bonus เครดิตตอน register |
| M-BE-09 (Payment Settings) | M-BE-07 Invoice | Invoice แสดง bank info ตาม config |
| M-BE-09 (Channel Config) | M-BE-12 Lifecycle | Precondition ก่อน activate Sub-Platform |
| M-BE-09 (Billing Terms) | M-BE-07 Credit Line | Default billing cycle/terms สำหรับ Credit Line |
| M-BE-10 (Revenue) | M-BE-07 Billing data | Revenue data source (รวม Credit Line invoices) |
| M-BE-10 (Usage) | Gateway (existing) | API call metrics |
| M-FE-BO (Dashboard) | M-BE-04, M-BE-07, M-BE-12 | Aggregated data from multiple modules |

### Phased Development

```
Timeline Overview:
Phase 0:  [Proto Design] ← ทำพร้อมกับ Sprint 0 ของ PRD เดิม
Phase 1a: [M-AV-02 Hardware ─────]  ← เริ่มเมื่อ Tenant Service (Phase 0a PRD เดิม) เสร็จ 80%
Phase 1b: [M-BE-08 Packages ─────]  ← parallel, ไม่มี dependency
Phase 1c: [M-BE-09 Pay Settings ─]  ← parallel, ไม่มี dependency
Phase 1d: [M-DP-02 Dev Portal ───]  ← parallel, ต้องรอ Tenant Service + Credit Line (M-BE-07)
Phase 2:  [M-AV-01 Presets+Sessions ─────]  ← ต้องรอ Hardware + Plans (M-BE-06)
Phase 3:  [M-BE-10 Analytics ────────────]  ← ต้องรอ Billing (M-BE-07) + Gateway data
Phase 4:  [M-FE-BO Dashboard ───]  ← ต้องรอ modules ส่วนใหญ่เสร็จ
```

**Phase 1 (Parallel — 4 modules):**
- M-AV-02 Hardware & Device Management — ไม่ต้องรอ Billing, แค่ต้อง Tenant Service
- M-DP-02 Developer Portal Ops — ต้องรอ Tenant Service + Credit Line (M-BE-07) พร้อมเบื้องต้น
- M-BE-08 Token Packages + Welcome Bonus — standalone config
- M-BE-09 Payment Settings + Billing Terms — standalone config

**Phase 2 (Dependent):**
- M-AV-01 Avatar Presets & Sessions — ต้องรอ: Hardware (device exists), Plans (slot limits), Token Deduction (billing)

**Phase 3 (Data-dependent):**
- M-BE-10 Analytics — ต้องรอ production data จาก Billing + Gateway

**Phase 4 (Integration):**
- M-FE-BO Central Dashboard — aggregation ของทุก module

### External Integration

| System | Direction | Purpose | New to this PRD |
|--------|-----------|---------|:---:|
| **AI Framework** | Inbound (sync) | Preset definitions pushed to platform | ✅ |
| **Device Firmware** | Bidirectional | Heartbeat + Register Code activation | ✅ |
| **OTEL Pipeline** (existing) | Inbound | Session metrics, device metrics → Analytics | Reuse |
| **Gateway** (existing) | Inbound | API call metrics → Usage Analytics | Reuse |

### Proto Contracts ที่ต้องสร้างใหม่

| Proto Package | ครอบคลุม |
|---------------|---------|
| `proto/realfact/hardware/v1/` | DeviceModel, Device, RegisterCode, Activation, BulkImport, Transfer |
| `proto/realfact/avatar/v1/` | Preset, Session, AssignLog, OnboardingChecklist |
| `proto/realfact/devportal/v1/` | ApiPreset, Agent, AssignEndpoint |
| `proto/realfact/analytics/v1/` | RevenueMetrics, UsageMetrics, CustomerMetrics |
| `proto/realfact/config/v1/` | TokenPackage, WelcomeBonus, BankAccount, PromptPayConfig, PaymentChannel, BillingTerms |

### Existing Infrastructure ที่ใช้ได้เลย

- gRPC framework (libs/go/grpcmw + libs/node/grpc-client)
- Tenant Context lib (libs/go/tenantctx + libs/node/tenant-context)
- OTEL pipeline (Collector + Prometheus + Grafana) — สำหรับ Analytics data source
- Redis (Cache + Pub/Sub) — สำหรับ device heartbeat + session cache
- Proto build pipeline (Buf CLI)
- Monorepo tooling (Nx + Bun)

### Tech Stack

- Hardware Service: **Go 1.24+** (ตาม existing Gateway + Builder)
- Avatar Operations Service: **Go 1.24+**
- Developer Portal Operations Service: **Go 1.24+**
- Analytics Service: **Go 1.24+** (aggregation) + PromQL (Prometheus queries)
- Config Service: **Go 1.24+**
- Backoffice UI: **Vanilla JS** (ตาม prototype ปัจจุบัน) → migrate to **Next.js** ในอนาคต
- Charts: **ApexCharts** (ตาม prototype)
- Database: **PostgreSQL** (shared with PRD เดิม)
- Cache: **Redis** (heartbeat, session cache)
- Inter-service: **ConnectRPC/gRPC**

### Risk Mitigation

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Device heartbeat ล่าช้า** | Medium | Redis Pub/Sub + WebSocket to UI, fallback: polling 30s |
| **AI Framework sync ล่าช้า** | Medium | Cache presets locally, async sync, manual refresh button |
| **Analytics data volume โต** | Medium | Time-series partitioning, materialized views, data retention policy |
| **Device Register Code collision** | Low | UUID-based generation + DB unique constraint |
| **Concurrent preset assignment** | Low | Optimistic locking on slot count per tenant |
| **Payment Settings misconfiguration** | Medium | Validation: ต้องมี ≥1 channel ก่อน activate Sub-Platform |
| **Welcome Bonus abuse** | Low | Rate limit registration, bonus cap validation (10x plan warning) |
| **Billing Terms misconfiguration** | Medium | Resolution Preview table ให้ Admin verify ก่อน save |
| **Credit Line edit sync failure** | Medium | DP Tenant Credit Line edit ต้อง sync กับ Central Billing atomically |
