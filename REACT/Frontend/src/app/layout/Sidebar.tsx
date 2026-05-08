import { memo, useMemo } from "react";
import { NavLink } from "react-router-dom";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <aside
      className="dash__sidebar"
      data-collapsed={collapsed ? "true" : "false"}
      style={{
        width: collapsed ? 72 : 260,
        transition: "width 180ms ease",
        overflow: "hidden",
        flex: "0 0 auto",
        willChange: "width",
      }}
    >
      {/* Branding */}
      <div
        className="brand"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 12,
          minHeight: 44,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="brand__logo">S</div>

          {/* não remove do DOM → evita layout shift */}
          <div
            className="brand__name"
            style={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              overflow: "hidden",
              whiteSpace: "nowrap",
              transition: "opacity 120ms ease",
            }}
          >
            WBVIS
          </div>
        </div>

        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Collapse sidebar"
            title="Collapse"
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 8,
              borderRadius: 10,
              opacity: 0.9,
            }}
          >
            ⟨⟨
          </button>
        )}
      </div>

      {collapsed && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
          <button
            type="button"
            onClick={onToggle}
            aria-label="Expand sidebar"
            title="Expand"
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 8,
              borderRadius: 10,
              opacity: 0.9,
            }}
          >
            ⟩⟩
          </button>
        </div>
      )}

      {/* NAV */}
      <div
        className="navTitle"
        style={{
          opacity: collapsed ? 0 : 1,
          height: 18,
          overflow: "hidden",
          transition: "opacity 120ms ease",
        }}
      >
        NAVIGATION
      </div>

      <SidebarLink to="/telemetry" label="Dashboard" collapsed={collapsed} />

      <div
        className="navTitle"
        style={{
          opacity: collapsed ? 0 : 1,
          height: 18,
          overflow: "hidden",
          transition: "opacity 120ms ease",
        }}
      >
        Machines
      </div>

      <SidebarLink to="/machine-1" label="Machine 1" disabled collapsed={collapsed} />
      <SidebarLink to="/machine-2" label="Machine 2" disabled collapsed={collapsed} />
      <SidebarLink to="/machine-3" label="Machine 3" disabled collapsed={collapsed} />
      <SidebarLink to="/machine-4" label="Machine 4" disabled collapsed={collapsed} />

      {/* Footer fixo */}
      <div
        className="sidebarFooter"
        style={{
          opacity: collapsed ? 0 : 1,
          height: 18,
          overflow: "hidden",
          transition: "opacity 120ms ease",
        }}
      >
        © {year}
      </div>
    </aside>
  );
}

/* =========================
   SidebarLink
   ========================= */
function SidebarLink({
  to,
  label,
  disabled = false,
  collapsed = false,
}: {
  to: string;
  label: string;
  disabled?: boolean;
  collapsed?: boolean;
}) {
  const short = label.slice(0, 1).toUpperCase();

  if (disabled) {
    return (
      <div
        className="navItem"
        title={label}
        style={{
          opacity: 0.4,
          cursor: "not-allowed",
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        {collapsed ? short : label}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) =>
        `navItem ${isActive ? "navItem--active" : ""}`
      }
      style={{
        display: "flex",
        justifyContent: collapsed ? "center" : "flex-start",
      }}
    >
      {collapsed ? short : label}
    </NavLink>
  );
}

export default memo(Sidebar);