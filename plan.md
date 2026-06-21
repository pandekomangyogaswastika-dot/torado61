# plan.md — Torado ERP UI/UX + IA + Flow + Backend↔Frontend Parity (MASTER PLAN, pasca-audit mendalam)

## 1) Objectives
- Menjadikan 3 dokumen ini sebagai **single source of truth**:
  - UI/UX audit + temuan per-halaman + peta IA: `/app/memory/UI_UX_AUDIT_2026-06-17.md` (termasuk Addendum layar 15")
  - Blueprint implementasi token-level (tema tetap): `/app/design_guidelines.md`
  - Audit parity backend↔frontend: `/app/memory/PARITY_AUDIT_2026-06-17.md`
- Eksekusi perbaikan **tanpa mengganti tema/visual** (aurora/glassmorphism + Inter tetap). Fokus: **density/ukuran/spacing, konsistensi komponen, IA (struktur menu), discoverability, user flow**.
- Kalibrasi UX untuk **laptop 15"** dengan viewport acuan **1280×800** (dan sanity @1366×768). Target: konten kunci **above-the-fold** (tanpa scroll berlebihan).
- Menjaga fungsionalitas: **tidak merusak** backend yang sudah lulus integrity gates & intent audits. Perubahan UI harus non-breaking.
- Menutup gap “ground truth” non-UX yang berdampak ke akurasi laporan keuangan & skala data:
  - **E2** (GL inventory opening-stock valuation) — implementasi seed konsisten + JE opening ✅
  - **E4** (AP Aging discrepancy) — AP aging harus bersumber dari `ap_ledgers` (SSOT) ✅
  - **E5** (pagination limit data detail) — hindari hard-limit `per_page=100` untuk halaman detail PO/PR ✅
  - **E6** (artefak `TEST_PHASE5_*`) — cleanup bila ada (ternyata sudah bersih) ✅
  - **E3** (PPN-in & e-Bupot dari AP) — `ap_ledgers` melacak `ppn_amount`/`pph23_amount` untuk preview/export pajak ✅
- Konsolidasi proses seed menjadi **entry point tunggal** agar demo data konsisten lintas environment ✅.
- **SPA Deep-Link UX**: hilangkan state “blank white” saat refresh / direct URL access dengan menampilkan loader yang tepat ✅.
- **AI/LLM policy (baru):** bila nanti mengaktifkan fitur AI (Anomaly Scan, dsb), gunakan **Claude (Anthropic) native** dan **jangan gunakan library Emergent**. Untuk saat ini, **skip integrasi API key** karena belum ada key yang dikonfigurasi.

**Keputusan user (sudah disetujui):**
- Konsolidasi hub **Payments (Finance)** & **Operations (Admin)** → **YA (hub+tabs)**
- "Akses Cepat" cross-portal → **diperjelas** (ikon panah keluar + label portal)
- Lebar sidebar target → **248px** (rekomendasi blueprint)
- **E2 approach**: posting opening-stock ke GL otomatis (Dr inventory / Cr retained earnings) + bila unit cost tidak ada, buat dan konsisten lewat 1 script seed
- **E3 approach**: AP ledger menyimpan nilai pajak input (PPN-in) dan withholding (PPh23) per invoice untuk mendukung e-Bupot
- **LLM policy**: tidak pakai Emergent library; gunakan Claude native bila nanti diaktifkan

---

## 2) Implementation Steps (Phased)

### Phase 0 — Checkpoint Review (Wajib sebelum kode disentuh)
**Status:** DONE

**User stories**
1. Sebagai user, saya ingin audit yang benar-benar berbasis observasi UI (bukan scanning) dan ada blueprint solusi.
2. Sebagai owner, saya ingin semua keputusan design tetap menjaga tema namun memperbaiki density.
3. Sebagai user, saya ingin kalibrasi audit sesuai layar 15" sehingga hasilnya relevan.
4. Sebagai stakeholder, saya ingin tahu ada/tidak gap backend→frontend.

**Steps (yang sudah dilakukan)**
- Live walkthrough + screenshot multi-portal; re-capture @1280×800 & @1366×768 untuk meniru layar 15".
- Menulis laporan:
  - UI/UX audit: `/app/memory/UI_UX_AUDIT_2026-06-17.md`
  - Blueprint token-level: `/app/design_guidelines.md`
  - Parity backend↔frontend: `/app/memory/PARITY_AUDIT_2026-06-17.md`

**Output**
- Scope v1 terkunci: tema tidak berubah; fokus density/IA/flow; viewport acuan 1280×800.
- Keputusan user untuk: hub Payments & Operations, Akses Cepat diperjelas, sidebar 248px.

---

### Phase 0.5 — Fondasi Token (Design System, tema tetap) **P0 (fondasi teknis)**
**Status:** DONE

**Tujuan:** membuat “komponen dasar” yang menjadi sumber konsistensi (font/spacing/cards/tabs) sebelum mengutak-atik IA besar.

**User stories**
1. Sebagai user, saya ingin tipografi dan spacing konsisten di seluruh portal.
2. Sebagai user, saya ingin KPI/stat tampil ringkas dan seragam.
3. Sebagai user, saya ingin tab in-page konsisten (1 komponen tab).

**Steps (implementasi)**
- Terapkan **typography_scale** dan **spacing_density_scale** dari `/app/design_guidelines.md`:
  - `PageHeader` jadi compact: h1 `text-xl md:text-2xl`, icon `h-6/7`, `mb-3/4`.
  - Container page: `py-3 lg:py-4` (mengganti `lg:py-8`).
- Buat komponen **`CompactStatCard`** tunggal (sm/md) sebagai pengganti ≥5 varian stat card.
  - Pertahankan `KpiSnapshotStrip` sebagai baseline “strip ringkas”.
- Standarkan **Tabs pill** tunggal (PortalSubNav / shadcn Tabs) sesuai spec:
  - Trigger `h-8 px-2.5 text-[13px]`, list `p-1 gap-1.5`, active = `pill-active`.

**Acceptance**
- FE build sukses.
- Screenshot @1280×800 (light+dark) pada 2 dashboard menunjukkan:
  - Title/header lebih pendek.
  - KPI/stat card ringkas & seragam.
- Tidak ada regresi dark mode (kontras + readability).

---

### Phase 1 — Sidebar & IA (P0, dampak terbesar)
**Status:** DONE

**Tujuan:** menyelesaikan akar kebingungan navigasi: double-active, redundant menu, sidebar terlalu panjang, urutan tidak sesuai best practice.

**User stories**
1. Sebagai user, saya ingin klik submenu tanpa parent ikut “active” (no double-active).
2. Sebagai user, saya ingin sidebar muat dan terbaca di 15" tanpa perlu collapse.
3. Sebagai user Finance, saya ingin Reports hanya 1 link karena tab sudah ada.
4. Sebagai user Procurement, saya ingin Vendors bersih: view jadi tab (Scorecard/Comparison/AI/Item Catalog).
5. Sebagai admin, saya ingin Payments (Finance) & Operations (Admin) jadi hub+tabs agar sidebar pendek.

**Steps (implementasi)**
- **Fix double-active** (leaf-only active background):
  - `Sidebar.jsx`: active style hanya untuk route terdalam; parent hanya indikator subtle (tanpa background).
- **Flatten single-item sections**:
  - Owner: Financial Health/AI Insights; Outlet: CRM/Daily Orders/End-of-Day; Executive: Analytics/Reservasi.
- **Sidebar compaction**:
  - Lebar `w-[248px]`, font item `text-[13px]`, subitem `text-[12.5px]`, padding rapat, section label `text-[11px] uppercase tracking`.
- **Dedupe IA**:
  - Finance: Reports 8 item → 1 “Reports Hub” (sisanya tab di halaman).
  - Procurement: hapus `Vendor Scorecard/Comparison/Item Catalog/AI Recommend` dari sidebar (gunakan tab di `/procurement/vendors`).
- **Konsolidasi hub sesuai keputusan user**:
  - Finance: “Payments Hub” + “Tax Center” (tab di halaman).
  - Admin: “Operations Hub” + “Loyalty Hub” (tab di halaman).
- **IA ordering best-practice**:
  - Urut by frequency × criticality × workflow; dashboard/operasional di atas, config/admin di bawah.
  - Target **≤12 item top-level/portal**.

**Acceptance**
- Tidak ada double-active.
- Sidebar Finance/Admin tidak overflow parah; usable tanpa collapse di 15".
- Redundansi menu-tab hilang (Finance Reports, Procurement Vendors).

---

### Phase 2 — Density Per Halaman + Flow (P1)
**Status:** DONE

**Tujuan:** menaikkan density di page yang paling boros ruang, memperbaiki flow agar tidak “klik nyasar”.

**Steps**
- Migrasi dashboard ke **CompactStatCard**.
- Rapikan density umum (search bar, grid gap, action tiles).
- **AI assistant collapsible**.
- **Akses Cepat diperjelas**.
- Fix data bug: Inventory Overview `outlet_id → outlet_name`.
- Discoverability: breadcrumbs + global search.
- Konsistensi status: `StatusPill`.
- Hilangkan pemborosan header admin berulang.

**Acceptance**
- Above-the-fold rule tercapai di 1280×800.
- AI card tidak mendominasi dashboard.
- Tidak ada navigasi “nyasar”.

---

### Phase 3 — Backend↔Frontend Parity Gaps (berdasarkan PARITY_AUDIT)
**Status:** DONE (2026-06-18)

**Tujuan:** menutup gap fitur backend yang belum ada UI atau memperjelas discoverability.

**Scope (yang diselesaikan)**
- Change Password
- AR edit customer/invoice + remind
- Export excel finance (yang relevan)
- Discoverability untuk modul yang tersembunyi

---

### Phase 4 — Cleanup & QA (stabilitas, non-UX)
**Status:** DONE (2026-06-18)

**Tujuan:** merapikan debt teknis tanpa risiko ke user flow.

---

### Phase 5 — Verifikasi Lintas-Dimensi (Blind Spots)
**Status:** DONE (2026-06-18)

**Tujuan:** memastikan perubahan density tidak merusak a11y/responsif/performa.

---

### Phase 6 — Ground Truth Backlog (E2/E4/E5/E6) + Seed Consistency (Non-UX, Finance/Scale)
**Status:** DONE (2026-06-18)

**Ringkasan hasil**
- **E2:** seed unit_cost + opening stock movements + GL opening JE inventory (balanced)
- **E4:** AP aging SSOT dari `ap_ledgers`
- **E5:** detail PO/PR fetch-by-id (tidak lagi `per_page=100` list fetch)
- **E6:** no-op (budgets kosong)
- **Seed:** `seed_master.py` sebagai entry point tunggal

Gates: Integrity 21/21 PASS; Health 25/25 PASS.

---

### Phase 7 — Ground Truth Backlog (E3) — PPN Masukan (AP) + e-Bupot Readiness
**Status:** DONE (2026-06-18)

**Ringkasan hasil**
- `ap_ledgers` kini mengisi `subtotal`, `ppn_amount` (11%), `dpp`, `pph23_amount` (2%), `service_type`, `period`, `pph23_bukti_no`
- Vendor dilengkapi NPWP demo + `vendor_type=service`
- e-Bupot preview menghasilkan data nyata untuk 2026-04/05/06 (warning=0)
- `seed_missing_demo.py` diperbarui agar seed AP baru otomatis konsisten

Gates: Integrity 21/21 PASS; Health 25/25 PASS.

---

### Phase 8 — SPA Deep-Link Routing / Refresh UX
**Status:** DONE (2026-06-18)

**Masalah**
- Akses langsung ke route dalam (mis. `/finance/dashboard`) kadang menampilkan area kosong/blanks sesaat.

**Root cause**
- `RequireAuth` dan `RequirePortal` me-return `null` saat `auth.loading` (blank screen).

**Fix (yang dilakukan)**
- `frontend/src/App.js`
  - `RequireAuth`: saat `loading` → return **`<FullPageLoader />`** (bukan `null`).
  - `RequirePortal`: saat `loading` → return **`<FullPageLoader />`** (bukan `null`).
  - Loader dipisah menjadi:
    - `FullPageLoader`: untuk state auth (full-screen)
    - `PageLoader`: untuk fallback Suspense di dalam AppShell (content area) → spinner + teks "Memuat…" terlihat.

**Verification / Evidence**
- Screenshot automation menunjukkan saat refresh deep-link, spinner tampil (tidak blank).
- Aplikasi tetap berjalan normal sesudah load.

---

## 3) Next Actions (Immediate)
1. **Mode sekarang: maintenance** — seluruh scope utama UI/UX + ground truth + deep-link UX sudah selesai.
2. AI/LLM:
   - **Kebijakan:** Claude native (Anthropic) tanpa Emergent.
   - **Status:** belum ada `ANTHROPIC_API_KEY` → **skip integrasi API dulu**.
   - Bila nanti dilanjutkan: tambahkan `ANTHROPIC_API_KEY` + wrapper minimal di backend, plus audit security/rate limit.

---

## 📌 EXECUTION LOG (2026-06-17 → 2026-06-18)

### ✅ Phase 0.5 — Token compaction
- Typography/spacing compaction (PageHeader, KPI, Tabs).

### ✅ Phase 1 — Sidebar & IA
- Double-active fixed; compaction; dedup Finance Reports & Procurement Vendors; hub consolidation.

### ✅ Phase 2 — Density & Flow
- KPI compaction, AI collapsible, quick access clarity, outlet name mapping.

### ✅ Phase 3–5 — Parity + QA + Cross-dimension verification
- Parity gaps closed, cleanup, verification.

### ✅ Phase 6 — E2/E4/E5/E6
- Inventory opening JE; AP aging SSOT; PO/PR detail fetch-by-id; budgets no-op; seed_master.

### ✅ Phase 7 — E3
- AP tax fields + vendor NPWP; e-Bupot preview populated.

### ✅ Phase 8 — SPA Deep-Link Refresh UX
- Auth guards show loaders; content loader visible; blank screen eliminated.

> **STATUS PROGRAM:** Phase 0.5 → 8 SELESAI. Semua guardrail gate hijau.

---

## 4) Success Criteria
- **Theme preserved**: aurora/glassmorphism + Inter tidak berubah; hanya density/spacing/IA/flow.
- **Viewport 15" ready**: @1280×800, halaman kunci memenuhi above-the-fold rule.
- Sidebar:
  - Tidak ada **double-active**.
  - Lebar ~248px; font ringkas; section label jelas.
  - ≤12 item top-level/portal; tidak perlu collapse untuk usable.
- Flow:
  - Akses Cepat jelas saat pindah portal.
  - **Tidak ada blank putih saat deep-link refresh**; loader terlihat.
- Quality:
  - Integrity gate 21/21 PASS.
  - Health check 25/25 PASS.
- **Ground Truth fixed:**
  - Inventory opening-stock ter-posting ke GL dengan JE balanced.
  - AP aging bersumber dari `ap_ledgers` dan konsisten.
  - Detail PO/PR tidak bergantung pada `per_page=100` list fetch.
  - **Tax readiness:** `ap_ledgers` menyimpan PPN masukan + PPh23; e-Bupot preview menghasilkan data nyata.
  - Seed konsisten via `seed_master.py`.

**Catatan scope tersisa (opsional, belum dikerjakan):**
- **AI/LLM integration:** belum dikonfigurasi. Jika dibutuhkan, implementasi harus memakai Claude native (Anthropic) tanpa Emergent; untuk sekarang **di-skip**.

---

## Update 2026-06-21 — Tour & Guide validasi + fix route-drift eksekutif
- Restorasi env baru (torado61 → /app): seed 20/20, integrity 21/21, health OK, intent 25/25 + 21/21.
- **Tour & Guide divalidasi** (audit statis + browser/testing agent): 8/8 hub tour PASS, search PASS.
- **Fixed 3 route-drift tour** di portal Executive (route render komponen berbeda dari target tour):
  - `/executive` (OwnerHome) → tour baru `executive-owner-home` (5 step).
  - `/executive/outlet/:outletId` (OutletDrilldown) → tour baru `executive-outlet-drilldown` (4 step).
  - `/executive/brand/:brandId` (BrandDrilldown) → tour baru `executive-brand-drilldown` (4 step).
- Gate hijau: audit_tours(_v2) 0 missing/drift (429 target), ux_audit --strict 0/0, audit_all --strict OK.
- Detail lengkap di `memory/GROUND_TRUTH_2026-06-17.md` PART N.

---

## Update 2026-06-21 (lanjutan) — Audit Forensik Pra-Produksi
- 8 fase audit menyeluruh (bukan hanya tour): SSOT gates, pytest 233, semua audit script, e2e smoke,
  RBAC (matrix 25/25 + outlet scope), data-management/restore, frontend E2E (testing agent), deployment.
- FIX: (1) CRITICAL RBAC portal-route leak → per-route Gate di AdminPortal.jsx; (2) rate limit 120→1000;
  (3) 2 script salah-DB (RC-1); (4) 2 deploy blocker (.gitignore .env, loyalty API fallback).
- Status akhir: SEMUA GATE HIJAU, deployment_agent PASS → SIAP DEPLOY PRODUCTION.
- Detail: memory/GROUND_TRUTH_2026-06-17.md PART O.
