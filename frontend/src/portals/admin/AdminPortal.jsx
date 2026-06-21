/**
 * AdminPortal shell — Navigation Restructuring (V2):
 * - Custom SubNav removed; AppShell Sidebar (level-1) + Subnav (level-2)
 *   handles navigation, identik dengan portal lain.
 * - Routes lengkap untuk semua menu yang diakses dari sidebar global.
 * - Item yang sebelumnya hanya hidup di SubNav (Operations, Report
 *   Schedules, CMS Reviews/Analytics/Pages, Loyalty Analytics) sekarang
 *   ditambahkan ke `navigationSchema.js` agar konsisten.
 */
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Settings as SettingsIcon } from "lucide-react";

import { useAuth } from "@/lib/auth";
import PageHeader from "@/components/shared/PageHeader";
import ComingSoonPage from "@/components/shared/ComingSoonPage";

import AdminHome from "./AdminHome";
import Users from "./Users";
import Roles from "./Roles";
import UserManagementHub from "./UserManagementHub";
import AdminSetupHub from "./AdminSetupHub";
import MasterData from "./MasterData";
import MasterDataHub from "./MasterDataHub";
import BulkImport from "./BulkImport";
import AuditLog from "./AuditLog";
import NumberSeries from "./NumberSeries";
import ApprovalWorkflows from "./ApprovalWorkflows";
import ApprovalMatrixBuilder from "./ApprovalMatrixBuilder";
import Operations from "./Operations";
import Integrations from "./Integrations";
import TaxConfig from "./TaxConfig";
import SmartSEO from "./SmartSEO";
import SystemSettings from "./SystemSettings";
import ConfigurationLayout from "./configuration/ConfigurationLayout";
import SalesSchemasPage from "./configuration/SalesSchemasPage";
import PettyCashPoliciesPage from "./configuration/PettyCashPoliciesPage";
import ServiceChargePoliciesPage from "./configuration/ServiceChargePoliciesPage";
import IncentiveSchemesPage from "./configuration/IncentiveSchemesPage";
import AnomalyThresholdsPage from "./configuration/AnomalyThresholdsPage";
import EffectiveDatingTimelinePage from "./configuration/EffectiveDatingTimelinePage";
import LoyaltyAdminHome from "./loyalty/LoyaltyAdminHome";
import LoyaltyHub from "./loyalty/LoyaltyHub";
import LoyaltyAdminCustomers from "./loyalty/LoyaltyAdminCustomers";
import LoyaltyAdminCustomerDetail from "./loyalty/LoyaltyAdminCustomerDetail";
import LoyaltyAdminRewards from "./loyalty/LoyaltyAdminRewards";
import LoyaltyAdminRedemptions from "./loyalty/LoyaltyAdminRedemptions";
import CRMAnalytics from "./loyalty/CRMAnalytics";
import CMSBrands from "./cms/CMSBrands";
import CMSCareers from "./cms/CMSCareers";
import CMSOutlets from "./cms/CMSOutlets";
import CMSNews from "./cms/CMSNews";
import CMSMenu from "./cms/CMSMenu";
import MediaLibrary from "./cms/MediaLibrary";
import CMSPendingReviews from "./cms/CMSPendingReviews";
import CMSAnalytics from "./cms/CMSAnalytics";
import PageBuilder from "./cms/PageBuilder";
import CMSStudio from "./CMSStudio";
import ReportSchedules from "./ReportSchedules";
import DataManagement from "./DataManagement";
import TourAnalytics from "./TourAnalytics";

export default function AdminPortal() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return null;

  // Phase 2: the "Admin Platform" hero is shown ONLY on the Admin home (/admin).
  // Sub-pages have their own headers, so the repeated hero is removed for density.
  const isAdminHome = location.pathname === "/admin" || location.pathname === "/admin/";

  return (
    <div className="max-w-7xl mx-auto" data-testid="admin-portal">
      {isAdminHome && (
        <PageHeader
          icon={SettingsIcon}
          title="Admin Platform"
          subtitle="Master data, users, roles, dan konfigurasi sistem"
        />
      )}
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<Users />} />
        <Route path="roles" element={<Roles />} />
        {/* Unified hubs (IA consolidation) */}
        <Route path="user-management" element={<UserManagementHub />} />
        <Route path="setup" element={<AdminSetupHub />} />
        <Route path="master" element={<Navigate to="/admin/master/items" replace />} />
        <Route path="master-data" element={<Navigate to="/admin/master/items" replace />} />
        <Route path="master/:entity" element={<MasterDataHub />} />
        <Route path="configuration" element={<ConfigurationLayout />}>
          <Route index element={<Navigate to="/admin/configuration/sales-schemas" replace />} />
          <Route path="sales-schemas" element={<SalesSchemasPage />} />
          <Route path="petty-cash-policies" element={<PettyCashPoliciesPage />} />
          <Route path="service-charge-policies" element={<ServiceChargePoliciesPage />} />
          <Route path="incentive-schemes" element={<IncentiveSchemesPage />} />
          <Route path="anomaly-thresholds" element={<AnomalyThresholdsPage />} />
          <Route path="effective-dating" element={<EffectiveDatingTimelinePage />} />
        </Route>
        <Route path="workflows" element={<ApprovalWorkflows />} />
        {/* Phase 15 — global visual workflow builder */}
        <Route path="approvals" element={<ApprovalMatrixBuilder />} />
        {/* Sprint D — Bulk Excel Import */}
        <Route path="bulk-import" element={<BulkImport />} />
        <Route path="number-series" element={<NumberSeries />} />
        <Route path="audit-log" element={<AuditLog />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="integrations/:tab" element={<Integrations />} />
        <Route path="tax" element={<TaxConfig />} />
        <Route path="operations/*" element={<Operations />} />

        {/* System Settings (real page, not Coming Soon) */}
        <Route path="settings" element={<SystemSettings />} />

        {/* Loyalty admin — unified hub (Overview/Customers/Rewards/Redemptions/Analytics tabs) */}
        <Route path="loyalty" element={<LoyaltyHub />} />
        <Route path="loyalty/customers" element={<LoyaltyAdminCustomers />} />
        <Route path="loyalty/customers/:customerId" element={<LoyaltyAdminCustomerDetail />} />
        <Route path="loyalty/rewards" element={<LoyaltyAdminRewards />} />
        <Route path="loyalty/redemptions" element={<LoyaltyAdminRedemptions />} />
        <Route path="loyalty/analytics" element={<CRMAnalytics />} />

        {/* Sprint D: CMS routes - all use CMSStudio wrapper for unified tabs */}
        <Route path="cms-studio" element={<Navigate to="/admin/cms/brands" replace />} />
        <Route path="cms/brands" element={<CMSStudio />} />
        <Route path="cms/outlets" element={<CMSStudio />} />
        <Route path="cms/news" element={<CMSStudio />} />
        <Route path="cms/menu" element={<CMSStudio />} />
        <Route path="cms/careers" element={<CMSStudio />} />
        <Route path="cms/media" element={<CMSStudio />} />
        {/* Sprint I-L: Reviews + Analytics + Page Builder */}
        <Route path="cms/reviews" element={<CMSStudio />} />
        <Route path="cms/analytics" element={<CMSStudio />} />
        <Route path="cms/pages" element={<CMSStudio />} />
        {/* Sprint E: Scheduled Reports */}
        <Route path="report-schedules" element={<ReportSchedules />} />
        {/* Phase 2: Smart SEO Optimization */}
        <Route path="smart-seo" element={<SmartSEO />} />
        {/* Data Management: Import / Export / Delete */}
        <Route path="data-management" element={<DataManagement />} />
        {/* Tour Analytics — Help & Tour usage statistics */}
        <Route path="tour-analytics" element={<TourAnalytics />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
}
