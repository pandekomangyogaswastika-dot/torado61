/** Sidebar — desktop portal sidebar.
 *
 * Renders the current portal's navigation sections (collapsible) with a
 * collapse toggle. Pinned/Recent quick-access lists were removed 2026-06 per
 * user request to keep the main menu compact and prevent it from being pushed
 * down on 15" laptops.
 *
 * UI/UX 2026-06 (plan.md Phase 1):
 *  - Width 280→248px; font/padding compacted (text-[13px]) for 15" laptops.
 *  - Leaf-only active model: parent section that contains the active route gets
 *    only a subtle TEXT highlight (no background) — fixes the "double-active" bug.
 *  - Single-item sections are FLATTENED into a direct link (no mubazir collapsible).
 */
import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown, ChevronRight, ChevronsLeft, ChevronsRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/contexts/NavigationContext";
import { getPortalSections } from "@/lib/navigationSchema";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";

/** Returns true if `perms` grants access to `reqPerm` */
function hasPerm(perms, reqPerm) {
  if (!reqPerm) return true;
  if (perms.includes("*")) return true;
  return perms.some(p => p === reqPerm || p.startsWith(reqPerm + "."));
}

export default function Sidebar() {
  const { currentPortal, sidebarCollapsed, toggleSidebar } = useNavigation();
  const { user } = useAuth();
  const location = useLocation();

  const [expandedSections, setExpandedSections] = useState(() => {
    const saved = localStorage.getItem("aurora_sidebar_sections");
    return saved ? JSON.parse(saved) : {};
  });

  const toggleSection = useCallback((sectionId) => {
    setExpandedSections((prev) => {
      const newState = { ...prev, [sectionId]: !prev[sectionId] };
      localStorage.setItem("aurora_sidebar_sections", JSON.stringify(newState));
      return newState;
    });
  }, []);

  const isItemActive = useCallback((path) => location.pathname === path, [location.pathname]);

  if (!currentPortal) return null;

  const userPerms = user?.permissions || [];
  const allSections = getPortalSections(currentPortal.id);
  const sections = allSections.filter(s => hasPerm(userPerms, s.reqPerm));

  const isSectionActive = (section) => section.items.some((item) => location.pathname === item.path);

  const itemTestId = (item) =>
    `sidebar-nav-item-${item.id || item.path.replace(/[^a-z0-9]/gi, "-")}`;

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border bg-card/30 backdrop-blur-md transition-all duration-300",
          sidebarCollapsed ? "w-[76px]" : "w-[248px]"
        )}
        data-testid="sidebar"
      >
        {/* Sidebar header with collapse toggle */}
        <div className="h-14 md:h-16 flex items-center justify-between px-4 border-b border-border">
          {!sidebarCollapsed && (
            <span className="text-sm font-semibold truncate">
              {currentPortal.name}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
            data-testid="sidebar-collapse-toggle"
            aria-label={sidebarCollapsed ? "Buka sidebar" : "Tutup sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Sidebar content - enforce scroll container */}
        <ScrollArea className="flex-1 px-2.5 py-3 h-0">
          <nav className="space-y-0.5">
            {sections.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSections[section.id] ?? true;
              const isActive = isSectionActive(section);

              // ── Flattened single-item section → render as a direct leaf link ──
              if (section.items.length === 1) {
                const only = section.items[0];
                const active = isItemActive(only.path);
                const flatLink = (
                  <Link
                    to={only.path}
                    className={cn(
                      "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors",
                      active
                        ? "text-foreground bg-foreground/[0.08]"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                    )}
                    data-testid={`sidebar-section-${section.id}`}
                    aria-label={section.name}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left truncate">{section.name}</span>
                        {only.badge && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/70">
                            {only.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );

                return (
                  <div key={section.id}>
                    {sidebarCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{flatLink}</TooltipTrigger>
                        <TooltipContent side="right" className="max-w-[260px]">
                          <div className="text-xs font-semibold">{section.name}</div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      flatLink
                    )}
                  </div>
                );
              }

              // ── Multi-item section → collapsible (leaf-only active model) ──
              const sectionButton = (
                <button
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                  )}
                  data-testid={`sidebar-section-${section.id}`}
                  aria-label={section.name}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{section.name}</span>
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3 shrink-0 opacity-60" />
                      ) : (
                        <ChevronRight className="h-3 w-3 shrink-0 opacity-60" />
                      )}
                    </>
                  )}
                </button>
              );

              return (
                <div key={section.id} className="space-y-0.5">
                  {/* Section header (with tooltip when collapsed) */}
                  {sidebarCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{sectionButton}</TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[260px]">
                        <div className="text-xs font-semibold">{section.name}</div>
                        {section.items.length > 0 && (
                          <div className="text-[10px] text-muted-foreground mt-1">
                            {section.items.map(it => it.name).join(" · ")}
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    sectionButton
                  )}

                  {/* Section items (expanded sidebar only) */}
                  {!sidebarCollapsed && isExpanded && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="ml-5 space-y-0.5 border-l border-border pl-2.5">
                          {section.items.map((item) => {
                            const isItemActv = isItemActive(item.path);
                            return (
                              <Link
                                key={item.id || item.path}
                                to={item.path}
                                className={cn(
                                  "flex items-center gap-2 px-2.5 py-1 rounded-md text-[13px] transition-all duration-150",
                                  isItemActv
                                    ? "text-foreground font-semibold bg-foreground/[0.08] border-l-2 border-foreground/30 pl-2"
                                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                                )}
                                data-testid={itemTestId(item)}
                              >
                                <span className="flex-1 truncate">{item.name}</span>
                                {item.badge && (
                                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/70">
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>
    </TooltipProvider>
  );
}
