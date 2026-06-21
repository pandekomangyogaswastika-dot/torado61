/** Procurement Portal shell — Navigation Restructuring + ApprovalCenter (Sprint B). */
import { Routes, Route, Navigate } from "react-router-dom";
import { ClipboardList, ShoppingCart, Store, Award } from "lucide-react";
import { useAuth } from "@/lib/auth";
import ProcurementHome from "./ProcurementHome";
import KanbanWorkboard from "./KanbanWorkboard";
import VendorComparison from "./VendorComparison";
import PRList from "./PRList";
import PRForm from "./PRForm";
import PRDetail from "./PRDetail";
import POList from "./POList";
import POForm from "./POForm";
import PODetail from "./PODetail";
import GRList from "./GRList";
import GRForm from "./GRForm";
import VendorRecommendPage from "./VendorRecommendPage";
import RFQList from "./RFQList";
import RFQDetail, { RFQForm } from "./RFQDetail";
import PriceIntelligence from "./PriceIntelligence";
import VendorCatalog from "./VendorCatalog";
import PRConsolidation from "./PRConsolidation";
import POComparison from "./POComparison";
import AllVendors from "./AllVendors";
import VendorScorecardList from "./VendorScorecardList";
import ApprovalCenter from "../shared/ApprovalCenter";
import ComingSoonPage from "@/components/shared/ComingSoonPage";

// Procurement portal hanya melihat approval tipe PR & PO
const PROC_TYPES = ["purchase_request", "purchase_order"];

export default function ProcurementPortal() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div data-testid="procurement-portal">
      <Routes>
        <Route index element={<ProcurementHome />} />
      <Route path="kanban" element={<KanbanWorkboard />} />
      <Route path="vendor-comparison" element={<VendorComparison />} />
      <Route path="vendor-recommend" element={<VendorRecommendPage />} />
      <Route path="price-intelligence" element={<PriceIntelligence />} />
      <Route path="vendor-catalog" element={<VendorCatalog />} />
      <Route path="rfq" element={<RFQList />} />
      <Route path="rfq/new" element={<RFQForm />} />
      <Route path="rfq/:id" element={<RFQDetail />} />
      <Route path="pr" element={<PRList />} />
      <Route path="pr/new" element={<PRForm />} />
      <Route path="pr/:id" element={<PRDetail />} />
      <Route path="po" element={<POList />} />
      <Route path="po/new" element={<POForm />} />
      <Route path="po/:id" element={<PODetail />} />
      <Route path="gr" element={<GRList />} />
      <Route path="gr/new" element={<GRForm />} />

      {/* Real pages: Consolidation, PO Comparison, Vendors, Scorecard */}
      <Route path="consolidation" element={<PRConsolidation />} />
      <Route path="po-comparison" element={<POComparison />} />
      <Route path="vendors" element={<AllVendors />} />
      <Route path="vendor-scorecard" element={<VendorScorecardList />} />

      <Route
        path="approvals"
        element={
          <ApprovalCenter
            restrictedTypes={PROC_TYPES}
            title="Procurement Approval Center"
            subtitle="Antrian persetujuan PR dan PO"
          />
        }
      />
      <Route path="*" element={<Navigate to="/procurement" replace />} />
      </Routes>
    </div>
  );
}
