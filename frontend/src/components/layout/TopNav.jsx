import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Search, Menu, Store, Globe2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/lib/auth";
import { useNavigation } from "@/contexts/NavigationContext";
import { visiblePortalsFor } from "@/lib/portals";
import { cn } from "@/lib/utils";
import api, { unwrap } from "@/lib/api";
import UserMenu from "@/components/shared/UserMenu";
import NotificationBell from "@/components/shared/NotificationBell";
import ApprovalsInboxButton from "@/components/shared/ApprovalsInboxButton";
import ThemeToggle from "@/components/shared/ThemeToggle";
import HelpTourButton from "@/components/shared/HelpTourButton";

export default function TopNav({ onSearchOpen }) {
  const { user } = useAuth();
  const { openMobileDrawer } = useNavigation();
  const location = useLocation();
  const navigate = useNavigate();
  const portals = visiblePortalsFor(user);
  const [outlets, setOutlets] = useState([]);

  useEffect(() => {
    // Load outlet list to resolve names (lightweight, cached)
    api.get("/master/outlets", { params: { per_page: 100 } })
      .then((r) => setOutlets(unwrap(r) || []))
      .catch(() => {});
  }, []);

  const activePortal = portals.find((p) => location.pathname.startsWith(p.path))?.id;

  // Keep the active portal pill in view when the switcher overflows (15" laptops).
  const navRef = useRef(null);
  useEffect(() => {
    const el = navRef.current?.querySelector('[aria-current="page"]');
    if (el) el.scrollIntoView({ inline: "center", block: "nearest" });
  }, [activePortal]);

  // Determine scope context for the logged-in user
  const isFullAccess = (user?.permissions || []).includes("*");
  const userOutletIds = user?.outlet_ids || [];
  const isRestricted = !isFullAccess && userOutletIds.length > 0 && userOutletIds.length < outlets.length;
  const scopeOutlets = outlets.filter((o) => userOutletIds.includes(o.id));

  return (
    <header
      className="glass-panel sticky top-0 z-40 px-3 sm:px-4 lg:px-6 h-[64px] lg:h-[72px] flex items-center justify-between gap-2"
      style={{ borderBottom: "1px solid rgb(var(--glass-border))" }}
    >
      {/* Logo + mobile menu */}
      <div className="flex items-center gap-2 min-w-0 shrink-0">
        <button
          onClick={openMobileDrawer}
          className="lg:hidden h-10 w-10 rounded-full glass-input flex items-center justify-center hover:bg-foreground/5 transition-colors"
          aria-label="Buka menu navigasi"
          data-testid="topnav-menu-toggle"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          onClick={() => navigate("/portal-select")}
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg pr-2"
          aria-label="Torado ERP - Pilih Portal"
          data-testid="logo-home-button"
        >
          <div className="h-9 w-9 rounded-xl grad-aurora flex items-center justify-center shadow-md flex-shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-bold text-sm tracking-tight">Torado</span>
          </div>
        </button>

        {/* Outlet context indicator — visible ONLY when user is restricted to specific outlets */}
        {isRestricted && scopeOutlets.length > 0 && (
          <div className="hidden sm:flex items-center gap-1 ml-1">
            {scopeOutlets.slice(0, 2).map((o) => (
              <span
                key={o.id}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20"
                title="Anda hanya dapat melihat data outlet ini"
              >
                <Store className="h-3 w-3" />
                {o.name}
              </span>
            ))}
            {scopeOutlets.length > 2 && (
              <span className="text-[11px] text-muted-foreground">+{scopeOutlets.length - 2}</span>
            )}
          </div>
        )}
      </div>

      {/* Portal switcher (center on desktop) — scrolls horizontally when space is tight (15" laptops) */}
      <nav
        ref={navRef}
        className="hidden lg:flex flex-1 min-w-0 items-center justify-start gap-1 overflow-x-auto no-scrollbar px-2 [scroll-padding-inline:1rem]"
        aria-label="Portal"
      >
        {portals.map((p) => {
          const isActive = activePortal === p.id;
          const Icon = p.icon;
          return (
            <Link
              key={p.id}
              to={p.path}
              className={cn(
                "relative shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] font-medium transition-all flex items-center gap-1.5",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="active-portal-pill"
                  className="absolute inset-0 pill-active rounded-full"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {p.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Current portal label (mobile) */}
      <div className="lg:hidden flex-1 min-w-0 text-center">
        {activePortal && (
          <span className="text-sm font-semibold truncate block">
            {portals.find((p) => p.id === activePortal)?.name}
          </span>
        )}
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={onSearchOpen}
          className="hidden sm:flex h-10 px-3 rounded-full glass-input items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-w-[180px]"
          data-testid="open-global-search"
          aria-label="Cari (⌘K)"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Cari…</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/10" aria-hidden="true">⌘K</kbd>
        </button>
        <button
          onClick={onSearchOpen}
          className="sm:hidden h-10 w-10 rounded-full glass-input flex items-center justify-center hover:bg-foreground/5"
          aria-label="Cari"
          data-testid="open-global-search-mobile"
        >
          <Search className="h-5 w-5" />
        </button>
        <NotificationBell />
        <ApprovalsInboxButton />
        <HelpTourButton />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
