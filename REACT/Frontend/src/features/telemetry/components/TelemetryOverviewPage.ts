import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useMeasurementsSeries } from "../hooks/useMeasurements";
import { useMeasurementLatest } from "../hooks/useMeasurementsLatest";

function formatNumber(value: unknown, digits = 2) {
  const n = Number(value);
  if (Number.isNaN(n)) return "--";
  return n.toFixed(digits);
}

function formatTime(value: unknown) {
  if (!value) return "--";

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function KpiCard({
  title,
  value,
  unit,
}: {
  title: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-200">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2 text-gray-900">
        {value} {unit && <span className="text-lg text-gray-500">{unit}</span>}
      </h2>
    </div>
  );
}

function ChartCard({
  title,
  data,
  dataKey,
  unit,
}: {
  title: string;
  data: any[];
  dataKey: string;
  unit?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 min-h-[350px]">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">{title}</h3>

      {data.length === 0 ? (
        <div className="w-full h-[250px] flex items-center justify-center border border-dashed border-gray-300 rounded-xl text-gray-400">
          Sem dados para renderizar
        </div>
      ) : (
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeLabel" minTickGap={20} />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => `Horário: ${label}`}
                formatter={(value) => [`${value} ${unit ?? ""}`, title]}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default function TelemetryOverviewPage() {
  const {
    data: measurements = [],
    isLoading: isSeriesLoading,
    error: seriesError,
  } = useMeasurementsSeries();

  const {
    data: latest,
    isLoading: isLatestLoading,
    error: latestError,
  } = useMeasurementLatest();

  const chartData = useMemo(() => {
    return measurements.map((item: any) => ({
      ...item,
      timeLabel: formatTime(
        item.timestamp ?? item.created_at ?? item.datetime ?? item.time
      ),
      temperature:
        Number(item.temperature ?? item.temperatura ?? item.temp ?? 0),
      pressure:
        Number(item.pressure ?? item.pressao ?? item.p_ant ?? item.p0 ?? 0),
      flow:
        Number(item.flow ?? item.vazao ?? item.flow_rate ?? item.q ?? 0),
    }));
  }, [measurements]);

  const last: any = latest ?? measurements?.[measurements.length - 1] ?? null;

  const temperature = formatNumber(
    last?.temperature ?? last?.temperatura ?? last?.temp
  );

  const pressure = formatNumber(
    last?.pressure ?? last?.pressao ?? last?.p_ant ?? last?.p0
  );

  const flow = formatNumber(
    last?.flow ?? last?.vazao ?? last?.flow_rate ?? last?.q
  );

  const lastUpdate = formatTime(
    last?.timestamp ?? last?.created_at ?? last?.datetime ?? last?.time
  );

  const loading = isSeriesLoading || isLatestLoading;
  const hasError = seriesError || latestError;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Telemetry Overview
            </h1>
            <p className="text-gray-600 mt-1">
              Monitoramento em tempo real dos dados recebidos via API
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Última atualização</p>
            <p className="font-semibold text-gray-900">{lastUpdate}</p>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-200 text-gray-600">
            Carregando dados da API...
          </div>
        )}

        {hasError && (
          <div className="bg-red-50 rounded-2xl shadow-sm p-4 border border-red-200 text-red-700">
            Erro ao buscar dados da API. Verifique se o FastAPI está rodando em
            http://192.168.0.50:8000 e se a rota GET está correta.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard title="Temperatura" value={temperature} unit="°C" />
          <KpiCard title="Pressão" value={pressure} unit="bar" />
          <KpiCard title="Vazão" value={flow} unit="L/min" />
          <KpiCard
            title="Status"
            value={hasError ? "ERRO" : loading ? "CARREGANDO" : "ONLINE"}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard
            title="Temperatura"
            data={chartData}
            dataKey="temperature"
            unit="°C"
          />

          <ChartCard
            title="Pressão"
            data={chartData}
            dataKey="pressure"
            unit="bar"
          />

          <ChartCard
            title="Vazão"
            data={chartData}
            dataKey="flow"
            unit="L/min"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Últimos dados recebidos
          </h3>

          <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-auto text-sm">
            {JSON.stringify(last, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
