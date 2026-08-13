import { Routes, Route, Link } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignDetails from "./pages/CampaignDetails";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import { Button } from "./components/ui/Button";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <p className="text-sm font-medium text-text-primary">Page not found</p>
      <p className="text-sm text-text-secondary">The page you're looking for doesn't exist.</p>
      <Link to="/">
        <Button variant="secondary" size="sm">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/:campaignId" element={<CampaignDetails />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;