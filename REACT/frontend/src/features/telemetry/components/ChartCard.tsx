import { useEffect, useRef, useState } from "react";
import { useMeasurementsSeries } from "../hooks/useMeasurements";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const ASSET_ID = "AQ21BR02" as const;
const MAX_POINTS = 200;

type SeriesPoint = {
  timestamp: string;
  value: number;
};

function useLiveSeries(
  incoming: Array<SeriesPoint> | undefined,
  maxPoints = MAX_POINTS
) {
  const [buf, setBuf] = useState<Array<SeriesPoint>>([]);
  const lastTsRef = useRef<string | null>(null);

  useEffect(() => {
    if (!incoming || incoming.length === 0) return;

    const last = incoming[incoming.length - 1];

    setBuf((prev) => {
      if (prev.length === 0) {
        lastTsRef.current = last.timestamp;
        return incoming.slice(-maxPoints);
      }

      if (lastTsRef.current === last.timestamp) return prev;

      lastTsRef.current = last.timestamp;
      return [...prev, last].slice(-maxPoints);
    });
  }, [incoming, maxPoints]);

  return buf;
}

function ChartCard({
  title,
  unit,
  series,
  loading,
}: {
  title: string;
  unit: string;
  series: Array<SeriesPoint>;
  loading: boolean;
}) {
  return (
    <div
      style={{
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
        borderRadius: 14,
        padding: 16,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      <div style={{ fontWeight: 700, color: "white", marginBottom: 8 }}>
        {title}
      </div>

      {loading && series.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            color: "white",
            opacity: 0.7,
          }}
        >
          Carregando gráfico…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.12} vertical={false} />

            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
              height={24}
            />

            <YAxis
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
              width={70}
              domain={["auto", "auto"]}
            />

            <Tooltip
              isAnimationActive={false}
              contentStyle={{
                background: "#1a1a1a",
                border: "none",
                borderRadius: 8,
                color: "white",
              }}
              formatter={(value: unknown) => {
                const num = Number(value);
                return [
                  !isNaN(num) ? `${num.toFixed(3)} ${unit}` : `- ${unit}`,
                  title,
                ];
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default function TelemetryOverviewCharts() {
  const temp1Q = useMeasurementsSeries({
    assetId: ASSET_ID,
    field: "temp_1",
    refetchIntervalMs: 5_000,
    limit: MAX_POINTS,
  });

  const temp2Q = useMeasurementsSeries({
    assetId: ASSET_ID,
    field: "temp_2",
    refetchIntervalMs: 5_000,
    limit: MAX_POINTS,
  });

  const temp3Q = useMeasurementsSeries({
    assetId: ASSET_ID,
    field: "temp_3",
    refetchIntervalMs: 5_000,
    limit: MAX_POINTS,
  });

  const temp4Q = useMeasurementsSeries({
    assetId: ASSET_ID,
    field: "temp_4",
    refetchIntervalMs: 5_000,
    limit: MAX_POINTS,
  });

  const pressao1Q = useMeasurementsSeries({
    assetId: ASSET_ID,
    field: "pressao_1",
    refetchIntervalMs: 5_000,
    limit: MAX_POINTS,
  });

  const pressao2Q = useMeasurementsSeries({
    assetId: ASSET_ID,
    field: "pressao_2",
    refetchIntervalMs: 5_000,
    limit: MAX_POINTS,
  });

  const vazao1Q = useMeasurementsSeries({
    assetId: ASSET_ID,
    field: "vazao_1",
    refetchIntervalMs: 5_000,
    limit: MAX_POINTS,
  });

  const valvulaQ = useMeasurementsSeries({
    assetId: ASSET_ID,
    field: "valvula",
    refetchIntervalMs: 5_000,
    limit: MAX_POINTS,
  });

  const temp1Series = useLiveSeries(temp1Q.data?.series, MAX_POINTS);
  const temp2Series = useLiveSeries(temp2Q.data?.series, MAX_POINTS);
  const temp3Series = useLiveSeries(temp3Q.data?.series, MAX_POINTS);
  const temp4Series = useLiveSeries(temp4Q.data?.series, MAX_POINTS);

  const pressao1Series = useLiveSeries(pressao1Q.data?.series, MAX_POINTS);
  const pressao2Series = useLiveSeries(pressao2Q.data?.series, MAX_POINTS);

  const vazao1Series = useLiveSeries(vazao1Q.data?.series, MAX_POINTS);
  const valvulaSeries = useLiveSeries(valvulaQ.data?.series, MAX_POINTS);

  return (
    <div
      style={{
        minHeight: "90vh",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
        gap: 16,
        padding: 16,
      }}
    >
      <ChartCard
        title="Temperatura 1"
        unit="°C"
        series={temp1Series}
        loading={temp1Q.isLoading}
      />

      <ChartCard
        title="Temperatura 2"
        unit="°C"
        series={temp2Series}
        loading={temp2Q.isLoading}
      />

      <ChartCard
        title="Temperatura 3"
        unit="°C"
        series={temp3Series}
        loading={temp3Q.isLoading}
      />

      <ChartCard
        title="Temperatura 4"
        unit="°C"
        series={temp4Series}
        loading={temp4Q.isLoading}
      />

      <ChartCard
        title="Pressão 1"
        unit="bar"
        series={pressao1Series}
        loading={pressao1Q.isLoading}
      />

      <ChartCard
        title="Pressão 2"
        unit="bar"
        series={pressao2Series}
        loading={pressao2Q.isLoading}
      />

      <ChartCard
        title="Vazão 1"
        unit="L/h"
        series={vazao1Series}
        loading={vazao1Q.isLoading}
      />

      <ChartCard
        title="Abertura da Válvula"
        unit="%"
        series={valvulaSeries}
        loading={valvulaQ.isLoading}
      />
    </div>
  );
}