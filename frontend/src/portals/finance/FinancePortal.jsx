/** Finance Portal shell — Navigation Restructuring: PortalSubNav removed, AppShell Sidebar+Subnav handles navigation. */
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import FinanceHome from "./FinanceHome";
import ValidationQueue from "./ValidationQueue";
import JournalList from "./JournalList";
import JournalDetail from "./JournalDetail";
import ManualJournalForm from "./ManualJournalForm";
import TrialBalance from "./TrialBalance";
import ProfitLoss from "./ProfitLoss";
import BalanceSheet from "./BalanceSheet";
import CashflowReport from "./CashflowReport";
import APAging from "./APAging";
import COABrowser from "./COABrowser";
import PeriodList from "./PeriodList";
import PeriodClosingWizard from "./PeriodClosingWizard";
import ReportBuilder from "./ReportBuilder";
import PivotReport from "./PivotReport";
import Comparatives from "./Comparatives";
import VendorScorecard from "./VendorScorecard";
import Forecasting from "./Forecasting";
import AnomalyFeed from "./AnomalyFeed";
import PaymentList from "./PaymentList";
import PaymentForm from "./PaymentForm";
import PaymentDetail from "./PaymentDetail";
import PaymentRunList from "./PaymentRunList";
import PaymentRunDetail from "./PaymentRunDetail";
import PaymentRunTemplateList from "./PaymentRunTemplateList";
import PaymentRunTemplateDetail from "./PaymentRunTemplateDetail";
import PaymentRequestList from "./PaymentRequestList";
import PaymentRequestForm from "./PaymentRequestForm";
import PaymentRequestDetail from "./PaymentRequestDetail";
import BankRecon from "./BankRecon";
import CashPosition from "./CashPosition";
import TaxCenter from "./TaxCenter";
import EFakturExport from "./EFakturExport";
import EBupotExport from "./EBupotExport";
import FixedAssetList from "./FixedAssetList";
import FixedAssetDetail from "./FixedAssetDetail";
import BudgetVsActual from "./BudgetVsActual";
import BudgetManagement from "./BudgetManagement";
import BudgetHub from "./BudgetHub";
import ARInvoiceList from "./ARInvoiceList";
import PeriodClosingHub from "./PeriodClosingHub";
import ReservationDeposits from "./ReservationDeposits";
import ApprovalCenter from "../shared/ApprovalCenter";
import FinanceReportsHub from "./FinanceReportsHub";
import FinancePaymentsHub from "./FinancePaymentsHub";
import FinanceTaxHub from "./FinanceTaxHub";

export default function FinancePortal() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div data-testid="finance-portal">
      <Routes>
        <Route index element={<FinanceHome />} />
      <Route path="validation" element={<ValidationQueue />} />
      {/* Payments Hub — all payment sub-pages in one tabbed workspace */}
      <Route path="payments-hub" element={<FinancePaymentsHub />} />
      <Route path="payments" element={<PaymentList />} />
      <Route path="payments/new" element={<PaymentForm />} />
      <Route path="payments/:id" element={<PaymentDetail />} />
      <Route path="payment-runs" element={<PaymentRunList />} />
      <Route path="payment-runs/:id" element={<PaymentRunDetail />} />
      <Route path="payment-run-templates" element={<PaymentRunTemplateList />} />
      <Route path="payment-run-templates/:id" element={<PaymentRunTemplateDetail />} />
      <Route path="payment-requests" element={<PaymentRequestList />} />
      <Route path="payment-requests/new" element={<PaymentRequestForm />} />
      <Route path="payment-requests/:id" element={<PaymentRequestDetail />} />
      <Route path="journals" element={<JournalList />} />
      <Route path="journals/:id" element={<JournalDetail />} />
      <Route path="manual-journal" element={<ManualJournalForm />} />
      {/* Reports Hub — all 7 reports in one tabbed workspace */}
      <Route path="reports" element={<FinanceReportsHub />} />
      {/* Legacy direct routes redirect to hub with tab pre-selected */}
      <Route path="trial-balance" element={<Navigate to="/finance/reports?tab=trial-balance" replace />} />
      <Route path="profit-loss" element={<Navigate to="/finance/reports?tab=profit-loss" replace />} />
      <Route path="balance-sheet" element={<Navigate to="/finance/reports?tab=balance-sheet" replace />} />
      <Route path="cashflow" element={<Navigate to="/finance/reports?tab=cashflow" replace />} />
      <Route path="comparatives" element={<Navigate to="/finance/reports?tab=comparatives" replace />} />
      <Route path="report-builder" element={<Navigate to="/finance/reports?tab=report-builder" replace />} />
      <Route path="pivot" element={<Navigate to="/finance/reports?tab=pivot" replace />} />
      <Route path="ap-aging" element={<APAging />} />
      {/* Tax & Compliance Hub — Tax Center + e-Faktur + e-Bupot tabs */}
      <Route path="tax" element={<FinanceTaxHub />} />
      <Route path="tax-center" element={<TaxCenter />} />
      <Route path="efaktur" element={<EFakturExport />} />
      <Route path="ebupot" element={<EBupotExport />} />
      <Route path="assets" element={<FixedAssetList />} />
      <Route path="assets/:id" element={<FixedAssetDetail />} />
      {/* Budget Hub — Budget vs Actual + Management + Forecasting tabs */}
      <Route path="budget-hub" element={<BudgetHub />} />
      <Route path="budget" element={<BudgetVsActual />} />
      <Route path="budget/manage" element={<BudgetManagement />} />
      <Route path="ar-invoices" element={<ARInvoiceList />} />
      <Route path="bank-recon" element={<BankRecon />} />
      <Route path="cash-position" element={<CashPosition />} />
      <Route path="forecasting" element={<Forecasting />} />
      <Route path="anomalies" element={<AnomalyFeed />} />
      <Route path="vendor-scorecard" element={<VendorScorecard />} />
      <Route path="periods" element={<PeriodList />} />
      <Route path="period-closing" element={<PeriodClosingHub />} />
      <Route path="period-closing/:period" element={<PeriodClosingWizard />} />
      <Route path="closing-wizard" element={<Navigate to="/finance/periods" replace />} />
      <Route path="coa" element={<COABrowser />} />
      <Route path="reservation-deposits" element={<ReservationDeposits />} />
      <Route path="approvals" element={<ApprovalCenter />} />
      <Route path="*" element={<Navigate to="/finance" replace />} />
      </Routes>
    </div>
  );
}

