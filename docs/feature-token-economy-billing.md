# Feature Specification: Token Economy & Billing System

> **เอกสารนี้สรุปหลักการ Token Economy ทั้งหมด**
> สำหรับนำไปเพิ่มเป็น Feature ใน PRD ของโปรเจ็คหลัก (realfact-platform)
>
> สร้างเมื่อ: 2026-03-10
> สถานะ: Draft — รอรวมเข้า PRD หลัก

---

## 1. หลักการ (Core Principle)

```
Cost + Margin = Sell Price (THB) = Token ที่หัก

ไม่มี Selling Rate
ไม่มี Conversion Step
ไม่มีการกำหนดว่า 1 Token = กี่บาทแยกต่างหาก
Sell Price คือ Token — จบ
```

**สูตรหลัก 2 ขั้น:**

| # | สูตร | คำอธิบาย |
|---|-------|----------|
| ① | `sellPerUnit = costPerUnit ÷ (1 − margin%)` | คำนวณราคาขายต่อหน่วยของแต่ละ service |
| ② | `tokensToDeduct = Σ (quantity × sellPerUnit)` | รวม sell price ทุก service = Token ที่หัก |

**สูตรเสริม (สำหรับ Owner Dashboard):**

| # | สูตร | คำอธิบาย |
|---|-------|----------|
| ③ | `totalCost = Σ (quantity × costPerUnit)` | ต้นทุนรวมทุก service ใน session |
| ④ | `profit = totalSell − totalCost` | กำไรต่อ session |
| ⑤ | `blendedMargin = (1 − totalCost ÷ totalSell) × 100%` | margin เฉลี่ยของ session |

---

## 2. Full Flow Diagram

```
╔══════════════════════════════════════════════════════════════════╗
║              TOKEN ECONOMY — FULL FLOW                           ║
║              ตั้งแต่ตั้งค่าต้นทุน → หัก Token จาก Wallet            ║
╚══════════════════════════════════════════════════════════════════╝


 STEP 1: Owner ตั้งค่าต้นทุน (Cost Config)
 ─────────────────────────────────────────
 ผู้ตั้ง: Owner (Lv.0)
 ตั้งค่าครั้งเดียว อัปเดตเมื่อ Provider เปลี่ยนราคา

 ┌────────────────────────┬───────────┬────────────┬──────────┐
 │ Service Code           │ Provider  │ Billing    │ Cost/Unit│
 │                        │           │ Type       │ (THB)    │
 ├────────────────────────┼───────────┼────────────┼──────────┤
 │ avatar-session         │ Realfact  │ Per Min    │ 0.5000   │
 │ anthropic-claude-s-4-6 │ Anthropic │ Per Token  │ 0.0003(i)│
 │                        │           │            │ 0.0015(o)│
 │ elevenlabs-turbo-v2-5  │ ElevenLabs│ Per Req    │ 0.0380   │
 │ openai-embedding-3-sm  │ OpenAI    │ Per Token  │ 0.000001 │
 └────────────────────────┴───────────┴────────────┴──────────┘
                              │
                              ▼
 STEP 2: Owner ตั้งค่า Margin (Margin Config)
 ─────────────────────────────────────────────
 ผู้ตั้ง: Owner (Lv.0)
 ลำดับ Priority: Service Code > Provider > Global

 ┌──────────────────────────────────────────────────────────┐
 │  Global Default: 30%                                     │
 │                                                          │
 │  Provider Override:                                      │
 │    Anthropic: 35%  │  ElevenLabs: 40%  │  Realfact: 45% │
 │                                                          │
 │  Service Code Override (สูงสุด):                          │
 │    avatar-session: 50%                                   │
 │    anthropic-claude-sonnet-4-6: 38%                      │
 │    openai-embedding-3-small: 20%                         │
 └──────────────────────────────────────────────────────────┘
                              │
                              ▼
 STEP 3: ระบบคำนวณ Selling Price ต่อหน่วย (อัตโนมัติ)
 ─────────────────────────────────────────────────────
 สูตร: sellPerUnit = costPerUnit ÷ (1 − effectiveMargin%)

 ┌─────────────────────┬──────────┬────────┬───────────┐
 │ Service             │ Cost     │ Margin │ Sell/Unit │
 ├─────────────────────┼──────────┼────────┼───────────┤
 │ avatar-session      │ 0.5000   │ 50% ①  │ 1.000000  │
 │ claude-sonnet (in)  │ 0.0003   │ 38% ①  │ 0.000484  │
 │ claude-sonnet (out) │ 0.0015   │ 38% ①  │ 0.002419  │
 │ elevenlabs-turbo    │ 0.0380   │ 40% ②  │ 0.063333  │
 │ embedding-3-small   │ 0.000001 │ 20% ①  │ 0.000001  │
 └─────────────────────┴──────────┴────────┴───────────┘
 ① = Service Code Override  ② = Provider Override  ③ = Global
                              │
                              ▼
 STEP 4: Session เกิดขึ้น — AI Framework ส่ง Usage Log
 ─────────────────────────────────────────────────────
 เกิดอัตโนมัติเมื่อ Session จบ

 Session S-001 (13 นาที, Tenant: ABC Corporation)
 ┌────────────────────────┬──────────┬──────────┐
 │ Service                │ Type     │ Quantity │
 ├────────────────────────┼──────────┼──────────┤
 │ avatar-session         │ primary  │ 13       │
 │ anthropic-claude-s-4-6 │ input    │ 3,250    │
 │ anthropic-claude-s-4-6 │ output   │ 1,100    │
 │ elevenlabs-turbo-v2-5  │ primary  │ 26       │
 └────────────────────────┴──────────┴──────────┘
                              │
                              ▼
 STEP 5: คำนวณต้นทุน + ราคาขายรวม
 ─────────────────────────────────
 ┌─────────────────────┬───────┬──────────┬──────────┐
 │ Service             │ Qty   │ Cost Tot │ Sell Tot │
 ├─────────────────────┼───────┼──────────┼──────────┤
 │ avatar-session      │ 13    │  6.500   │ 13.000   │
 │ claude-sonnet (in)  │ 3,250 │  0.975   │  1.573   │
 │ claude-sonnet (out) │ 1,100 │  1.650   │  2.661   │
 │ elevenlabs-turbo    │ 26    │  0.988   │  1.647   │
 ├─────────────────────┼───────┼──────────┼──────────┤
 │ TOTAL               │       │ 10.113   │ 18.881   │
 │                     │       │ (ต้นทุน)  │(ราคาขาย) │
 └─────────────────────┴───────┴──────────┴──────────┘

 กำไร = 18.881 − 10.113 = 8.768 THB (46.4% blended margin)
                              │
                              ▼
 STEP 6: หัก Token จาก Wallet (ไม่มี conversion)
 ────────────────────────────────────────────────
 tokensToDeduct = totalSell = 18.881

 ┌──────────────────────────────────────────────┐
 │  WALLET: ABC Corporation (T-001)             │
 │                                              │
 │  Balance Before:  5,000.000 Tokens           │
 │  Deduct:            -18.881 Tokens           │
 │  Balance After:   4,981.119 Tokens           │
 └──────────────────────────────────────────────┘

 Tenant เห็น: "Session 13 นาที — หัก 18.881 Tokens"
 Owner เห็น:  "ต้นทุน 10.11 ฿ — ขาย 18.88 ฿ — กำไร 8.77 ฿"
```

---

## 3. Margin Priority (ลำดับการเลือก Margin)

```
Service Code Override  ──→  มี? ใช้เลย (เช่น avatar-session: 50%)
       │ ไม่มี
       ▼
Provider Override      ──→  มี? ใช้ (เช่น Anthropic: 35%)
       │ ไม่มี
       ▼
Global Margin          ──→  ใช้ค่า default (30%)
```

**สูตร Margin vs Markup:**
- ระบบนี้ใช้ **Margin** (ไม่ใช่ Markup)
- `sellPrice = cost ÷ (1 − margin%)`
- Margin = กำไรเป็น % ของ **ราคาขาย** (ไม่ใช่ % ของต้นทุน)
- เป็นมาตรฐาน SaaS/FinTech — ดู Gross Margin ในงบการเงินได้ตรง

---

## 4. Token Wallet — วิธีเติม Token

Tenant ได้ Token จาก 3 ทาง:

| ทาง | คำอธิบาย | ตัวอย่าง |
|-----|----------|----------|
| Subscription Alloc | ได้ Token ทุกเดือนตามแพลน | Pro Plan → +5,000 tkn/เดือน |
| Token Top-up | ซื้อเพิ่มผ่าน Package | 5,000 tkn ราคา 4,000 ฿ |
| Welcome Bonus | ได้ครั้งแรกเมื่อสมัคร | +1,000 tkn |

### Token Package (ราคาขาย Token ให้ Tenant)

> **สำคัญ:** เพราะ 1 Token = 1 THB (sell price) ราคา Package ต้องสะท้อนมูลค่าจริง

| Package | Tokens | ราคา (THB) | ต่อ Token | ส่วนลด |
|---------|--------|-----------|----------|--------|
| Starter | 1,000 | 1,000 | 1.00 | — (ราคาเต็ม) |
| Popular | 5,000 | 4,000 | 0.80 | 20% |
| Value | 10,000 | 7,000 | 0.70 | 30% |
| Enterprise | 50,000 | 30,000 | 0.60 | 40% |

**หมายเหตุ:** ส่วนลด volume คือ "Tenant จ่ายน้อยกว่ามูลค่าจริงของ Token" — เป็นกลไกดึง volume ไม่ใช่การกำหนดราคาต่อ Token

---

## 5. ใครเห็นอะไร (Visibility Matrix)

| Role | เห็นอะไร |
|------|----------|
| **Tenant** | Token Balance (คงเหลือ), Transaction: "Session 13 นาที → -18.881 Tokens", ไม่เห็น cost / margin / breakdown |
| **Owner (Backoffice)** | ทุกอย่างที่ Tenant เห็น + Cost Breakdown ทุก service + Sell Breakdown + Profit per session + Blended Margin % |

---

## 6. API Payloads

### 6.1 Usage Log (จาก AI Framework เมื่อ Session จบ)

```json
{
  "sessionId": "S-001",
  "subPlatformCode": "avatar",
  "tenantId": "T-001",
  "startedAt": "2026-03-02T09:15:00Z",
  "endedAt": "2026-03-02T09:28:00Z",
  "duration": 13,
  "usageLogs": [
    { "serviceCode": "avatar-session",              "type": "primary", "quantity": 13   },
    { "serviceCode": "anthropic-claude-sonnet-4-6",  "type": "input",   "quantity": 3250 },
    { "serviceCode": "anthropic-claude-sonnet-4-6",  "type": "output",  "quantity": 1100 },
    { "serviceCode": "elevenlabs-turbo-v2-5",        "type": "primary", "quantity": 26   }
  ]
}
```

### 6.2 Settlement Record (ระบบสร้างอัตโนมัติ)

```json
{
  "settlementId": "STL-20260302-001",
  "sessionId": "S-001",
  "tenantId": "T-001",

  "breakdown": [
    {
      "serviceCode": "avatar-session",
      "type": "primary",
      "quantity": 13,
      "costPerUnit": 0.5000,
      "effectiveMargin": 0.50,
      "marginSource": "service_override",
      "sellPerUnit": 1.000000,
      "totalCost": 6.500,
      "totalSell": 13.000
    },
    {
      "serviceCode": "anthropic-claude-sonnet-4-6",
      "type": "input",
      "quantity": 3250,
      "costPerUnit": 0.0003,
      "effectiveMargin": 0.38,
      "marginSource": "service_override",
      "sellPerUnit": 0.000484,
      "totalCost": 0.975,
      "totalSell": 1.573
    },
    {
      "serviceCode": "anthropic-claude-sonnet-4-6",
      "type": "output",
      "quantity": 1100,
      "costPerUnit": 0.0015,
      "effectiveMargin": 0.38,
      "marginSource": "service_override",
      "sellPerUnit": 0.002419,
      "totalCost": 1.650,
      "totalSell": 2.661
    },
    {
      "serviceCode": "elevenlabs-turbo-v2-5",
      "type": "primary",
      "quantity": 26,
      "costPerUnit": 0.0380,
      "effectiveMargin": 0.40,
      "marginSource": "provider_override",
      "sellPerUnit": 0.063333,
      "totalCost": 0.988,
      "totalSell": 1.647
    }
  ],

  "summary": {
    "totalCost": 10.113,
    "totalSell": 18.881,
    "profit": 8.768,
    "blendedMargin": 46.4,
    "tokensToDeduct": 18.881
  }
}
```

### 6.3 Wallet Transaction (หัก Token)

```json
{
  "transactionId": "TXN-20260302-001",
  "tenantId": "T-001",
  "settlementId": "STL-20260302-001",
  "sessionId": "S-001",
  "type": "usage",

  "balanceBefore": 5000.00,
  "amount": -18.881,
  "balanceAfter": 4981.119,

  "description": "Avatar Session 13 นาที",
  "createdAt": "2026-03-02T09:28:00Z"
}
```

---

## 7. Safeguard System (ป้องกันขาดทุน)

### 7.1 จุดที่อาจขาดทุนได้

| Layer | ขาดทุนได้ไหม? | เหตุผล |
|-------|-------------|--------|
| **Session Level** | ❌ ไม่มีทาง | ทุก service บวก margin แล้ว — sellPerUnit > costPerUnit เสมอ |
| **Revenue Level** | ⚠️ ได้ | ถ้าขาย Token Package ราคาต่ำกว่า avgCostPerToken |
| **PriceLock Level** | ⚠️ ได้ | ถ้าล็อคราคาไว้แล้วต้นทุนเพิ่มภายหลัง |

### 7.2 Safeguard #1 — Package Price Guard

**ป้องกัน:** ตั้งราคา Package ต่ำกว่าต้นทุน
**ทำงานเมื่อ:** Owner สร้าง/แก้ไข Token Package

```
ระบบคำนวณ avgCostPerToken จาก Session ย้อนหลัง 30 วัน:

avgCostPerToken = Σ totalCost ÷ Σ tokensDeducted (ของทุก session)
```

```json
{
  "packageGuard": {
    "subPlatformCode": "avatar",
    "period": "last_30_days",
    "sessionsAnalyzed": 5,
    "totalCost": 34.528,
    "totalTokensDeducted": 64.496,
    "avgCostPerToken": 0.5353,
    "packages": [
      {
        "id": "TP-001",
        "pricePerToken": 1.00,
        "status": "safe",
        "marginVsCost": "+46.5%"
      },
      {
        "id": "TP-002",
        "pricePerToken": 0.80,
        "status": "safe",
        "marginVsCost": "+33.1%"
      },
      {
        "id": "TP-004",
        "pricePerToken": 0.30,
        "status": "danger",
        "marginVsCost": "-43.9%",
        "alert": "pricePerToken ต่ำกว่า avgCostPerToken — ขาดทุนทุก Token"
      }
    ]
  }
}
```

**UX:** แสดง alert ตอน Owner กด Save Package — สามารถยืนยันต่อหรือแก้ไขราคาได้

### 7.3 Safeguard #2 — Cost Change Impact Analysis

**ป้องกัน:** เปลี่ยนต้นทุนแล้วไม่รู้ว่ากระทบ Snapshot/Tenant ไหน
**ทำงานเมื่อ:** Cost Change Request ถูก Approve

```json
{
  "costChangeImpact": {
    "costChangeRequestId": "CCR-002",
    "serviceCode": "google-cloud-tts",
    "costBefore": 0.0140,
    "costAfter": 0.0120,
    "direction": "decreased",
    "effectiveDate": "2026-04-01",

    "affectedSnapshots": [
      {
        "snapshotId": "SNAP-DEFAULT",
        "name": "Default Snapshot (Mar 2026)",
        "affectedTenants": 40,
        "marginBefore": 40.0,
        "marginAfter": 48.6,
        "impact": "positive",
        "note": "ต้นทุนลด → margin เพิ่มอัตโนมัติ"
      },
      {
        "snapshotId": "SNAP-001",
        "name": "Thai Finance Group — Custom",
        "affectedTenants": 1,
        "priceLock": {
          "id": "PL-LOCK-001",
          "endDate": "2026-07-15",
          "daysRemaining": 134,
          "locked": true
        },
        "marginBefore": 25.0,
        "marginAfter": 35.7,
        "impact": "positive_but_locked",
        "note": "ต้นทุนลด → Platform ได้กำไรเพิ่ม แต่ Tenant ยังจ่ายราคาเดิม (locked)"
      }
    ]
  }
}
```

### 7.4 Safeguard #3 — Cost Increase Alert (PriceLock Conflict)

**ป้องกัน:** ต้นทุนเพิ่มแต่ PriceLock ล็อคราคาขาย → ขาดทุน
**ทำงานเมื่อ:** ต้นทุน service เพิ่ม + มี PriceLock ที่ยัง active

```json
{
  "costChangeImpact": {
    "serviceCode": "anthropic-claude-sonnet-4-6",
    "costBefore": 0.0003,
    "costAfter": 0.0005,
    "direction": "increased",

    "affectedSnapshots": [
      {
        "snapshotId": "SNAP-DEFAULT",
        "marginBefore": 38.0,
        "marginAfter": 3.2,
        "impact": "critical",
        "alert": "margin ลดจาก 38% เหลือ 3.2% — ใกล้ขาดทุน"
      },
      {
        "snapshotId": "SNAP-001",
        "priceLock": { "locked": true, "daysRemaining": 134 },
        "marginBefore": 25.0,
        "marginAfter": -12.5,
        "impact": "loss",
        "alert": "ขาดทุน! PriceLock ล็อคราคาขายไว้ แต่ต้นทุนเพิ่ม → margin ติดลบ"
      }
    ],

    "recommendations": [
      {
        "action": "adjust_margin",
        "target": "SNAP-DEFAULT",
        "detail": "เพิ่ม margin claude-sonnet เป็น ≥ 50% เพื่อรักษากำไร"
      },
      {
        "action": "negotiate_price_lock",
        "target": "SNAP-001 (Thai Finance Group)",
        "detail": "เจรจา PriceLock ใหม่ หรือรอหมดสัญญา 134 วัน — ระหว่างนี้ขาดทุน ~12.5%"
      },
      {
        "action": "review_packages",
        "detail": "ตรวจสอบ Token Package ทั้งหมดว่ายังมีกำไรหรือไม่"
      }
    ]
  }
}
```

### 7.5 Safeguard #4 — Retroactive Audit (ตรวจสอบย้อนหลัง)

**ป้องกัน:** Session ที่หักไปแล้วด้วยราคาเก่า ไม่ตรงกับต้นทุนที่เปลี่ยน
**ทำงานเมื่อ:** ต้นทุนเปลี่ยน + มี Session ย้อนหลังที่ใช้ service นั้น

```json
{
  "retroactiveAudit": {
    "triggeredBy": "Cost change approved",
    "serviceCode": "anthropic-claude-sonnet-4-6",
    "costChange": { "from": 0.0003, "to": 0.0005 },
    "auditPeriod": { "from": "2026-03-01", "to": "2026-03-10" },

    "affectedSessions": [
      {
        "sessionId": "S-001",
        "tenantId": "T-001",
        "date": "2026-03-02",
        "settlement": {
          "originalCost": 10.113,
          "originalSell": 18.881,
          "originalTokensDeducted": 18.881,
          "recalcCost": 11.413,
          "recalcSell": 21.307,
          "recalcTokensShouldDeduct": 21.307,
          "difference": -2.426,
          "status": "under_charged"
        }
      },
      {
        "sessionId": "S-004",
        "tenantId": "T-005",
        "date": "2026-03-02",
        "settlement": {
          "originalCost": 20.531,
          "originalSell": 38.361,
          "originalTokensDeducted": 38.361,
          "recalcCost": 24.181,
          "recalcSell": 45.173,
          "recalcTokensShouldDeduct": 45.173,
          "difference": -6.812,
          "status": "under_charged"
        }
      }
    ],

    "summary": {
      "totalSessionsAffected": 2,
      "totalUnderCharged": -9.238,
      "totalOverCharged": 0,
      "netDifference": -9.238
    },

    "options": [
      {
        "action": "absorb",
        "description": "Platform รับภาระ — ไม่เรียกเก็บเพิ่ม",
        "impact": "ขาดทุน 9.238 THB จาก session เก่า"
      },
      {
        "action": "adjust_forward",
        "description": "ไม่แก้ย้อนหลัง แต่ปรับ margin/cost สำหรับ session ใหม่",
        "impact": "session ใหม่คิดราคาถูกต้อง session เก่า absorb"
      },
      {
        "action": "debit_adjustment",
        "description": "หัก Token เพิ่มจาก Wallet (ต้องแจ้ง Tenant ก่อน)",
        "impact": "ได้คืน 9.238 Token แต่อาจกระทบความสัมพันธ์"
      }
    ]
  }
}
```

### 7.6 Safeguard #5 — Dashboard Alert (แจ้งเตือน Real-time)

**ป้องกัน:** Owner ไม่รู้ว่ามีปัญหา
**ทำงาน:** ตลอดเวลา แสดงบน Backoffice Dashboard

```json
{
  "alerts": [
    {
      "id": "ALT-001",
      "severity": "critical",
      "icon": "fa-triangle-exclamation",
      "type": "package_below_cost",
      "title": "Token Package ราคาต่ำกว่าต้นทุน",
      "message": "Package TP-004 (50,000 tkn @ 0.30/tkn) ต่ำกว่า avgCost 0.5353/tkn",
      "action": { "label": "แก้ไข Package", "route": "/cost-pricing#packages" }
    },
    {
      "id": "ALT-002",
      "severity": "warning",
      "icon": "fa-arrow-trend-up",
      "type": "cost_increase_margin_drop",
      "title": "ต้นทุน Claude Sonnet เพิ่ม → margin ลด",
      "message": "margin ลดจาก 38% เหลือ 3.2% สำหรับ 40 tenants (SNAP-DEFAULT)",
      "action": { "label": "ดู Impact Report", "route": "/cost-pricing#impact" }
    },
    {
      "id": "ALT-003",
      "severity": "critical",
      "icon": "fa-lock",
      "type": "price_lock_loss",
      "title": "PriceLock ทำให้ขาดทุน",
      "message": "Thai Finance Group — PriceLock ล็อคราคาเดิม แต่ต้นทุนเพิ่ม → ขาดทุน 12.5% อีก 134 วัน",
      "action": { "label": "ดู PriceLock", "route": "/cost-pricing#pricelocks" }
    },
    {
      "id": "ALT-004",
      "severity": "info",
      "icon": "fa-magnifying-glass-dollar",
      "type": "retroactive_under_charge",
      "title": "Session ย้อนหลังหัก Token น้อยกว่าที่ควร",
      "message": "พบ 2 sessions หักน้อยไป 9.238 Token จากต้นทุนที่เปลี่ยน",
      "action": { "label": "ดู Audit Report", "route": "/cost-pricing#audit" }
    }
  ]
}
```

---

## 8. Safeguard Summary Table

| # | Safeguard | ทำงานเมื่อ | ป้องกันอะไร |
|---|-----------|-----------|------------|
| 1 | Package Price Guard | สร้าง/แก้ Package | ขาย Package ต่ำกว่าต้นทุน |
| 2 | Cost Change Impact | Cost Change Approved | ไม่รู้ว่า Snapshot/Tenant ไหนกระทบ |
| 3 | Cost Increase Alert | ต้นทุนเพิ่ม + PriceLock | PriceLock ล็อคราคา + ต้นทุนเพิ่ม = ขาดทุน |
| 4 | Retroactive Audit | ต้นทุนเปลี่ยน + มี session เก่า | Session เก่าหักไม่ตรง ต้องตัดสินใจ absorb/debit |
| 5 | Dashboard Alert | ตลอดเวลา | Owner ไม่รู้ว่ามีปัญหา — แจ้งเตือน real-time |

---

## 9. Data Model Changes Required

### 9.1 ตาราง/Collection ใหม่ที่ต้องเพิ่ม

| Table | คำอธิบาย |
|-------|----------|
| `settlements` | เก็บ breakdown การคำนวณต่อ session (Payload 5) |
| `wallet_transactions` | เก็บ log การหัก/เติม Token (Payload 6) |
| `safeguard_alerts` | เก็บ alert ที่ระบบสร้างอัตโนมัติ |
| `retroactive_audits` | เก็บผลการตรวจสอบย้อนหลัง |

### 9.2 ตารางที่ต้องแก้ไข

| Table | เปลี่ยนอะไร |
|-------|-----------|
| `sessions` | เปลี่ยน `tokens` จาก `= duration` เป็น `= totalSell` (dynamic) |
| `token_packages` | reprice ให้สะท้อน 1 Token = 1 THB sell price |
| `token_activities` | เปลี่ยน amount จากหักตาม duration เป็นหักตาม settlement |

---

## 10. Migration Notes

### จากระบบเดิม (Token = Duration) → ระบบใหม่ (Token = Sell Price)

1. **Session ที่จบแล้ว:** ไม่ต้องแก้ย้อนหลัง — เก็บเป็น historical data
2. **Token Package:** ต้อง reprice ทั้งหมดให้สะท้อน 1 Token = 1 THB
3. **Wallet Balance:** ต้องตัดสินใจว่า balance เดิมจะ convert อย่างไร หรือ reset
4. **Exchange Rate บน Sub-Platform:** เปลี่ยนจาก "1 Token = 1 Minute" เป็น "Token = THB (selling price)" — ไม่ต้องกำหนด exchange rate อีกต่อไป
