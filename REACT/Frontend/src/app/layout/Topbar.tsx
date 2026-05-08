import { useLocation } from "react-router-dom";

/**
 * Topbar
 * ------
 * Barra superior da aplicação.
 *
 * Responsabilidades:
 * - Exibir o título da página atual
 * - Reservar espaço para ações globais (filtros, usuário, status)
 *
 * Observação:
 * - Não contém lógica de negócio
 * - O título é derivado da rota atual
 */
export default function Topbar() {
  const location = useLocation();
  const title = getTitleFromPath(location.pathname);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",          // garante largura total
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Título da página */}
      <h2
        style={{
          margin: 0,
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "white",
        }}
      >
        {title}
      </h2>

      {/* Área de ações globais (lado direito) */}
      <div
        style={{
          marginLeft: "auto",    // empurra para o extremo direito
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "0.85rem",
          opacity: 0.75,
          color: "white",
        }}
      >
        <span>Status: conectado</span>
      </div>
    </div>
  );
}

/**
 * Mapeia pathname → título amigável
 * Centralizar isso aqui evita espalhar lógica nas páginas.
 */
function getTitleFromPath(pathname: string): string {
  if (pathname.startsWith("/telemetry")) return "DASHBOARD VCI MONITOR - MACHINE 1";
  if (pathname.startsWith("/alerts")) return "Alerts";
  if (pathname.startsWith("/login")) return "Login";
  return "Dashboard";
}