/** HR Portal shell — Navigation Restructuring: PortalSubNav removed, AppShell Sidebar+Subnav handles navigation. */
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import HRHome from "./hr/HRHome";
import AdvancesList from "./hr/AdvancesList";
import FOCList from "./hr/FOCList";
import IncentiveList from "./hr/IncentiveList";
import LBFundLedger from "./hr/LBFundLedger";
import PayrollList from "./hr/PayrollList";
import ServiceChargeList from "./hr/ServiceChargeList";
import VoucherList from "./hr/VoucherList";
import LeaveRequests from "./hr/LeaveRequests";
import ApprovalCenter from "./shared/ApprovalCenter";
import JobApplications from "./hr/JobApplications";
import JobListings from "./hr/JobListings";
import CompensationHub from "./hr/CompensationHub";

export default function HRPortal() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div data-testid="hr-portal">
      <Routes>
        <Route index element={<HRHome />} />
        <Route path="compensation" element={<CompensationHub />} />
        <Route path="advances" element={<AdvancesList />} />
        <Route path="service-charge" element={<ServiceChargeList />} />
        <Route path="incentive" element={<IncentiveList />} />
        <Route path="voucher" element={<VoucherList />} />
        <Route path="foc" element={<FOCList />} />
        <Route path="lb-fund" element={<LBFundLedger />} />
        <Route path="payroll" element={<PayrollList />} />
        <Route path="leaves" element={<LeaveRequests />} />
        <Route path="approvals" element={<ApprovalCenter />} />
        <Route path="job-applications" element={<JobApplications />} />
        <Route path="job-listings" element={<JobListings />} />
        <Route path="*" element={<Navigate to="/hr" replace />} />
      </Routes>
    </div>
  );
}
