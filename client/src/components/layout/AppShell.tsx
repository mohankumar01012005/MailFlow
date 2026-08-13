import { useState } from "react";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";

const titleMap: Record<string, string> = {
  "/": "Dashboard",
  "/campaigns": "Campaigns",
  "/campaigns/new": "Create Campaign",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export function AppShell() {
  const location = useLocation();
  const isCampaignDetails = useMatch("/campaigns/:campaignId");
  const title =
    titleMap[location.pathname] ?? (isCampaignDetails ? "Campaign Details" : "MailFlow");

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-full">
      <Sidebar />
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-surface-0 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}