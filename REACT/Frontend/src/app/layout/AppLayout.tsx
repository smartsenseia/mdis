import { Outlet } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const onToggleSidebar = useCallback(() => {
    setSidebarCollapsed((v) => !v);
  }, []);

  const sidebarW = useMemo(
    () => (sidebarCollapsed ? "72px" : "280px"),
    [sidebarCollapsed]
  );

  return (
    <div
      className="dash"
      style={{
        ["--sidebar-w" as any]: sidebarW,
      }}
    >
      <Sidebar collapsed={sidebarCollapsed} onToggle={onToggleSidebar} />

      <div className="dash__main">
        <header className="dash__topbar">
          <Topbar />
        </header>

        <div className="dash__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}