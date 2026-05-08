// src/app/routes/index.tsx
import { Routes, Route } from "react-router-dom";

import AppLayout from "../layout/AppLayout";

function Home() {
  return <h1>SmartSense Telemetry Dashboard</h1>;
}

export default function AppRoutes() {
  return (
    <Routes>

      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

    </Routes>
  );
}