#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================
## user_problem_statement
Copy/restore the Torado Group ERP repo (torado60), read all mandatory docs, review & map the
existing system, then VERIFY and CONTINUE/FINISH the development that was stopped midway.
User directive: "ya selesaikan semua" (finish everything). Respond in Bahasa Indonesia.

## RESTORATION SESSION (2026-06-17) — focus for testing
backend:
  - task: "Auth + RBAC (login admin@torado.id, portal access)"
    implemented: true
    working: "NA"
    file: "backend/routers/auth.py"
    priority: "high"
    needs_retesting: true
  - task: "Owner Cockpit cash position (cash_accounts seeded) + burn/runway (opex JEs)"
    implemented: true
    working: "NA"
    file: "backend/services/cash_position_service.py, backend/seed/seed_opex_demo.py"
    priority: "high"
    needs_retesting: true
  - task: "CRM/Loyalty (customers, loyalty_transactions, rewards) endpoints return data"
    implemented: true
    working: "NA"
    file: "backend/routers/crm_analytics.py, loyalty.py, rewards.py"
    priority: "high"
    needs_retesting: true
  - task: "Fixed assets, reservations, outlet budgets, tax endpoints return data"
    implemented: true
    working: "NA"
    file: "backend/routers/fixed_asset.py, reservations.py, outlet_budget.py, tax.py"
    priority: "medium"
    needs_retesting: true
  - task: "Public site content (brands, outlets, news, menu, careers) return data"
    implemented: true
    working: "NA"
    file: "backend/routers/public_content.py, public_menu.py"
    priority: "medium"
    needs_retesting: true

frontend:
  - task: "Login -> portal-select -> 8 portals render with real data"
    implemented: true
    working: "NA"
    file: "frontend/src/App.js"
    priority: "high"
    needs_retesting: true
  - task: "Owner Cockpit shows non-zero Cash Position + runway"
    implemented: true
    working: "NA"
    file: "frontend/src/portals/owner"
    priority: "high"
    needs_retesting: true
  - task: "Finance reports hub, Executive analytics, HR, Inventory, Procurement, Admin pages render"
    implemented: true
    working: "NA"
    file: "frontend/src/portals"
    priority: "high"
    needs_retesting: true
  - task: "Public marketing site (home, brands, menu, locations, news, careers) render with content"
    implemented: true
    working: "NA"
    file: "frontend/src/pages"
    priority: "medium"
    needs_retesting: true

metadata:
  created_by: "main_agent"
  version: "2.0"
  test_sequence: 0

test_plan:
  current_focus:
    - "Owner Cockpit cash position (non-zero)"
    - "All 8 portals render with seeded data"
    - "Public marketing site renders with CMS content"
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Restored Torado ERP in fresh env. Seeded canonical core + all feature datasets. Fixed seed_crm_demo wrong-DB bug and burn_30d (opex JEs). Integrity 21/21, health 25/25, pytest 215 pass. Please verify end-to-end across all portals + newly-seeded features. Login: admin@torado.id / Torado@2026. Skip any drag-drop/voice/camera tests."

## TEST RESULT — iteration_32 (2026-06-17) — RESTORATION VERIFICATION
- Backend: 100% (39/39 passed) | Frontend: 100% (all portals) | Overall: 100%
- Owner Cockpit Cash Position NON-ZERO (Rp 728.185.000, 50.4d runway, 9 accounts) — KEY FIX VERIFIED
- All feature datasets populated & rendering: customers 250, rewards 8, budgets 20, reservations, fixed assets 32+, public CMS (5 brands/6 news/33 menu/8 jobs)
- No critical bugs, no UI bugs, no integration issues, no white-screen crashes
agent_communication:
  - agent: "testing"
    message: "100% pass. Restoration verified end-to-end across all 8 portals + public marketing site. No bugs found. Owner Cockpit cash position confirmed non-zero. All previously-empty feature pages now show data."

## PHASE UX-6 — DataTable Migration COMPLETION (2026-06-17, continuation)
user_problem_statement: |
  Continue the previous agent's Phase UX-6 (DataTable migration). Found that ux_audit.py = 0/0 but
  TWO files still rendered shadcn <Table> as main LIST tables (audit blind spot, not genuine):
  ARInvoiceList (Customers/Aging/Reconciliation tabs) and ApprovalCenter (Delegations table).
  ApprovalCenter ALSO had a latent RC-4 crash: it rendered <Table>/<TableHeader> WITHOUT importing
  them (would white-screen when a delegation exists). Migrated all to the shared DataTable primitive.

frontend:
  - task: "ApprovalCenter Delegations tab -> DataTable (fixes latent RC-4 crash: Table used but not imported)"
    implemented: true
    working: true
    file: "frontend/src/portals/shared/ApprovalCenter/index.jsx"
    priority: "high"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Migrated Delegations table from un-imported shadcn <Table> to DataTable (rowAction=revoke). Verified via screenshot with a real delegation (Pak Hadi, PR+Payment Request badges, period, reason) — renders, no white-screen. Total Pending 28 invariant intact. Test delegation then removed to keep baseline pristine; on empty DB the Delegasi tab shows the DataTable empty state."
  - task: "ARInvoiceList Customers + Aging-by-Customer + Reconciliation tabs -> DataTable"
    implemented: true
    working: true
    file: "frontend/src/portals/finance/ARInvoiceList/index.jsx"
    priority: "high"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Invoices tab was already DataTable. Migrated Customers tab, Aging 'Per Customer' table, and Reconciliation statement to DataTable. Verified Customers tab via screenshot with 2 real AR customers (sortable cols render). Aging/Recon require AR invoice data (empty in demo) -> render empty/zero states correctly."

metadata:
  created_by: "main_agent"
  version: "3.0"
  test_sequence: 1

test_plan:
  current_focus:
    - "ApprovalCenter Delegasi tab renders DataTable without crash"
    - "AR Ledger Customers/Aging/Reconciliation tabs render DataTable without crash"
    - "Regression: existing DataTable list pages (Inventory Stock Balance, Finance Journals, Procurement PR/PO list) still render + sort + drill-down"
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Phase UX-6 genuine DataTable migration completed for the 2 audit-blind-spot files. ux_audit=0/0, frontend compiled clean, integrity 21/21. Login admin@torado.id / Torado@2026. Please regression-test: (1) Finance > Approval Center > Delegasi tab (must NOT white-screen; previously crashed - Table not imported), (2) Finance > AR Invoices: Invoices/Customers/Aging Report/Rekonsiliasi tabs render without errors, sortable headers work. 2 AR customers exist for Customers tab; AR invoices are empty so Aging/Recon show zero/empty states (expected). (3) Regression smoke on a few existing DataTable list pages. SKIP any drag-drop/voice/camera. Frontend-only testing."
  - agent: "testing"
    message: "iteration_34.json — 100% PASS, 0 bugs (frontend-only). CRITICAL fix verified: ApprovalCenter Delegasi tab renders with NO CRASH (DataTable empty state + Tambah Delegasi button). AR Invoices all 4 tabs render: Invoices empty state, Customers DataTable with PT Mitra Boga Nusantara + CV Sentosa Catering (sortable header present), Aging Report no errors, Rekonsiliasi DataTable statement rows. KPI strip Total Pending 28 intact. No console errors, no white-screen detected."

## DOC CLEANUP + AR COHERENCE SESSION (2026-06-17)
user_problem_statement: |
  Copy torado60 repo, read ALL mandatory docs genuinely, map existing system, then execute the
  confirmed doc-cleanup: delete 7 historical docs, fix dangling refs (GROUND_TRUTH Part A + PRD.md),
  optimize ENGINEERING_GUARDRAILS.md (keep ALL critical rules). Also: make seed data a reusable script,
  fix latent bug _post_ar_je hardcoded revenue CoA 4101 (chart uses 4000/4001) so AR subledger==GL,
  wire AR seed into seed_reset.sh, and verify Rekonsiliasi tab switches.

backend:
  - task: "AR invoice JE posts revenue (fixed CoA 4101 -> fallback 4101/4000/4001) so subledger==GL"
    implemented: true
    working: true
    file: "backend/services/_ar/journal.py"
    priority: "high"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Verified: 9/9 AR invoices GL-posted, 0 unbalanced JEs, revenue credited to CoA 4000 Rp193.55M. Balance sheet balanced (L Rp112,266,745). Integrity gate 21/21. AR/journal pytest 31 passed."
  - task: "Reusable idempotent AR demo seed wired into seed_reset.sh (step 19)"
    implemented: true
    working: true
    file: "backend/seed/seed_ar_demo.py, scripts/seed_reset.sh"
    priority: "high"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Re-run idempotent: wipes AR + its JEs then reseeds to exactly 5 customers / 9 invoices / 9 JEs, no dup. seed_reset.sh full 19-step run all green."

frontend:
  - task: "AR Ledger — all 4 tabs render incl. Rekonsiliasi (tab switches + statement loads)"
    implemented: true
    working: true
    file: "frontend/src/portals/finance/ARInvoiceList/index.jsx"
    priority: "high"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "UI test (Playwright): clicking tab-recon switches to Rekonsiliasi (active), statement auto-loads with real data (Saldo Awal 93.74M + Invoice 94.966M - Pembayaran 8.288M = Saldo Akhir 180.418M). KPI strip 9 invoices / Rp211.946M. No crash."

metadata:
  created_by: "main_agent"
  version: "4.0"
  test_sequence: 2

test_plan:
  current_focus:
    - "Inventory > Transfers: page loads; create-transfer form disables Save while submitting; Send/Receive buttons present (AsyncButton)."
    - "Negative-stock guard: create a transfer from an outlet that HAS stock, set a huge qty (e.g. 999999), click Send → expect an error toast like 'Stok tidak mencukupi / stok negatif' (NOT success). If unable to find a stocked item, skip gracefully."
    - "Inventory > Adjustments: Approve button present (AsyncButton) and page renders."
    - "Hub/Home rendering: Finance Home, Inventory Home, Procurement Home, Outlet Home, HR Home, Admin Home each render without crash; topic hubs (Finance Reports, Stock Movements, CRM) render."
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "UX_UI_REVIEW items session. Please FRONTEND-verify: (1) NEGATIVE-STOCK GUARD — go to Inventory > Transfers, create a new transfer (pick a source outlet + an item that shows on-hand stock), set qty to 999999, save, then click 'Kirim' (Send). It MUST be rejected with an error toast mentioning insufficient/negative stock (Indonesian: 'Stok tidak mencukupi' / 'stok negatif'), NOT succeed. (2) Transfer create form 'Simpan' button should disable while saving; Send/Receive action buttons exist. (3) Inventory > Adjustments: Approve button renders. (4) Portal HOME/HUB pages render without crash: Finance Home, Inventory Home, Procurement Home, Outlet Home, HR Home, Admin Home + Finance Reports hub, Stock Movements hub. Login admin@torado.id / Torado@2026. SKIP drag-drop/voice/camera and double-click-timing tests. Frontend-only."


#====================================================================================================
# PHASE 3 — Backend↔Frontend Parity Gaps (2026-06-18)
#====================================================================================================
## phase3_problem_statement
Continue Torado ERP development at Phase 3 (PARITY_AUDIT Kategori A): wire up backend features
that had no UI. Login admin@torado.id / Torado@2026. Token key localStorage=aurora_access_token.
Respond in Bahasa Indonesia. SKIP drag-drop/voice/camera and double-click-timing tests.

phase3_backend:
  - task: "AR update_invoice (draft) recomputes subtotal/tax/total/outstanding/period"
    implemented: true
    working: true
    file: "backend/services/_ar/invoice.py"
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Curl sanity PASS: edit lines 3x100k + 1x50k(no ppn) -> sub=350000 tax=36000 total=386000 out=386000. Draft-only guard intact."
  - task: "AR send_reminder fixed import (send_email) + telegram honest config check"
    implemented: true
    working: true
    file: "backend/services/_ar/reminder.py"
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Pre-existing bug: imported non-existent send_simple_email + wrong telegram signature. Fixed. Endpoint returns 200 + honest {sent:false,error} when channel not configured (RESEND/TELEGRAM keys absent in demo). MOCKED delivery in demo (no provider keys)."
  - task: "auth change-password endpoint (already existed)"
    implemented: true
    working: true
    file: "backend/routers/auth.py"
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Curl: rejects wrong old password (401); accepts valid change. NOTE: testing agent must NOT permanently change admin/finance demo passwords (rate-limit + breaks seeded creds). If tested, revert to Torado@2026."

phase3_frontend:
  - task: "UserMenu: Change Password dialog functional (was dead placeholder)"
    implemented: true
    working: "NA"
    file: "frontend/src/components/shared/UserMenu.jsx, components/shared/ChangePasswordDialog.jsx"
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Click avatar (top-right) -> 'Change Password' opens dialog with old/new/confirm + strength checklist. NOTE: do NOT actually submit a real password change for admin (breaks creds); just verify dialog opens, validation (mismatch, weak password disables submit) works. Optionally test wrong-old-password shows error toast."
  - task: "UserMenu: Profile + Preferences dialogs functional (were dead placeholders)"
    implemented: true
    working: "NA"
    file: "frontend/src/components/shared/ProfileDialog.jsx, PreferencesDialog.jsx"
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Profile shows read-only account info. Preferences: theme (Terang/Gelap) + Remember Last Portal toggle."
  - task: "AR Ledger: Edit Customer (Customers tab) -> PUT /ar/customers/{id}"
    implemented: true
    working: "NA"
    file: "frontend/src/portals/finance/ARInvoiceList/index.jsx, ARInvoiceDialogs/index.jsx"
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Path: /finance/payments-hub -> AR Invoices tab -> Customers sub-tab -> pencil icon per row -> edit form -> Simpan. Verify the customer row reflects edited name/terms."
  - task: "AR Ledger: Edit draft Invoice -> PUT /ar/invoices/{id} (recompute)"
    implemented: true
    working: "NA"
    file: "frontend/src/portals/finance/ARInvoiceList/index.jsx, ARInvoiceDialogs/index.jsx"
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "On a DRAFT invoice row, pencil icon opens edit dialog (header + line items). Change a qty/price, Simpan -> totals update in the list. Edit pencil only shows for Draft invoices."
  - task: "AR Ledger: Send payment Reminder (Bell) -> POST /ar/invoices/{id}/remind"
    implemented: true
    working: "NA"
    file: "frontend/src/portals/finance/ARInvoiceList/index.jsx, ARInvoiceDialogs/index.jsx"
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "On a Terkirim/Sebagian/overdue invoice with outstanding>0, amber Bell icon opens reminder dialog (channel email/telegram) -> Kirim Pengingat. Expect a toast. In demo (no email/telegram provider) expect a WARNING toast (logged, not actually sent) — this is correct/honest behaviour, NOT a bug."
  - task: "JournalList: Excel export -> GET /reports/finance/journal-ledger.xlsx"
    implemented: true
    working: "NA"
    file: "frontend/src/portals/finance/JournalList.jsx"
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Path: /finance/journals -> 'Excel' button next to 'Manual JE'. Clicking downloads journal_ledger_<period>.xlsx (toast success). Backend curl confirmed 200 + xlsx bytes."

test_plan:
  current_focus:
    - "AR Ledger Edit Customer (PUT /ar/customers) — Customers tab pencil -> edit -> save -> row updates"
    - "AR Ledger Edit draft Invoice (PUT /ar/invoices) — pencil on Draft row -> change qty -> save -> totals update"
    - "AR Ledger Send Reminder (POST /ar/invoices/{id}/remind) — Bell on sent/overdue row -> dialog -> Kirim -> toast (warning in demo is OK)"
    - "UserMenu Change Password dialog opens + client validation (DO NOT submit a real change for admin)"
    - "UserMenu Profile + Preferences dialogs open and render"
    - "JournalList Excel export button downloads xlsx"
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "PHASE 3 parity features added. Please FRONTEND-test (login admin@torado.id / Torado@2026): (1) AR Ledger at /finance/payments-hub -> 'AR Invoices' tab. Customers sub-tab: pencil per customer -> edit name/terms -> Simpan -> row updates. (2) Invoices sub-tab: on a DRAFT row, pencil -> edit dialog -> change a line qty/price -> Simpan -> totals update in list. (3) On a 'Terkirim'/'Sebagian' row (outstanding>0), amber Bell -> reminder dialog -> pick Email -> 'Kirim Pengingat' -> a toast appears (a WARNING toast 'belum terkirim/belum dikonfigurasi' is EXPECTED & correct in demo, since no email provider key — NOT a bug). (4) Top-right avatar menu -> 'Change Password' opens dialog: verify password strength checklist + mismatch warning + submit disabled until valid. IMPORTANT: do NOT actually submit a successful password change for admin/finance (it breaks seeded demo creds + login rate-limit). You MAY test that a WRONG old password shows an error toast, but if you change a password, you MUST change it back to Torado@2026. (5) avatar menu -> 'Profile' and 'Preferences' dialogs open & render (Preferences: theme toggle + remember-portal). (6) /finance/journals -> 'Excel' button downloads a file (toast success). SKIP drag-drop/voice/camera and double-click-timing tests. Backend curl sanity already PASSED for all endpoints."


#====================================================================================================
# SESSION 2026-06-18 (PM) — Onboarding restore + DEEP honest verification (code-first)
#====================================================================================================
# Context: repo re-copied into /app, reseeded (seed_reset 20/20), Tier-0 context loaded.
# Removed false-positive docs (BUG_BACKLOG, AGENT_HANDOFF, PERMISSION_BUG_AUDIT,
#   TEST_COVERAGE_ANALYSIS, test_reports/*) at user's instruction. Added scripts/load_context.sh.
#
# Executable gates (truth, not claims): verify_data_integrity 21/21, health_check 25/25,
#   intent_audit_5portals 25/25, intent_audit_remaining 21/21, ux_audit 0/0, audit_all OK,
#   pytest 233 passed / 11 skipped / 0 fail.
#
# Deep negative-path verification (live):
#   - PASS  negative-stock guard rejects over-qty transfer/adjustment ("Stok tidak mencukupi").
#   - PASS  period-lock rejects manual JE into CLOSED period (PERIOD_CLOSED).
#   - PASS  unbalanced/zero manual JE rejected; PO-without-vendor rejected; same-outlet transfer rejected.
#   - BUG FIXED: over-quota leave was ACCEPTED with no enforcement. Now rejected in
#     leave_service.create_leave_request (LEAVE_QUOTAS + _assert_within_quota, honors
#     allow_over_quota override). Regression test: tests/test_deep_business_logic.py::test_hr_leave_over_quota_rejected.
#
# Frontend (verified manually via Playwright, paced to avoid rate-limit false-positives):
#   - All portal homes + key pages render WITH seeded data (executive, owner, outlet, procurement /pr=20,
#     inventory, finance /journals /coa /periods /ap-aging, hr (25 employees), admin /users (10), /workflows (8), /master/outlets (5)).
#   - PR form validates required fields; Manual Journal disables Post JE until balanced (Dr==Cr>0).
#   - FALSE POSITIVES debunked: prior "white screens" (executive/owner/reports) = rate-limit during rapid
#     navigation; prior "0-rows/blank" (admin/outlets, admin/approval-workflows, procurement/purchase-requests)
#     = WRONG guessed URLs (real routes: /admin/master/outlets, /admin/workflows, /procurement/pr).
#   - UX FIX: 8 portals lacked a catch-all route -> unmatched sub-routes rendered blank <main>. Added
#     <Route path="*" -> <Navigate to="/{portal}" replace/>> to all 9 portals. Verified redirects work.
#
# NOT exhaustively tested (honest scope): full UI write-to-approve clickthroughs for every one of ~180
#   features; deep RBAC matrix per endpoint; graceful 429 handling (app shows global "Memuat..." if a
#   bootstrap call is rate-limited during rapid full-reload navigation — not seen in normal client-side use).
