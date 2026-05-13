import { useEffect, useMemo, useState } from "react";
import { useMeasurementLatest } from "../hooks/useMeasurementsLatest";

const ASSET_ID = "AQ21BR02" as const;

type NumericValue = number | null;

type CardItem = {
  key: string;
  label: string;
  value: number;
  unit: string;
};

type LastValues = {
  temp_1: NumericValue;
  temp_2: NumericValue;
  temp_3: NumericValue;
  temp_4: NumericValue;
  temp_5: NumericValue;
  temp_6: NumericValue;
  temp_7: NumericValue;
  temp_8: NumericValue;
  temp_9: NumericValue;
  temp_10: NumericValue;
  temp_11: NumericValue;
  temp_A: NumericValue;
  temp_B: NumericValue;

  pressao_1: NumericValue;
  pressao_2: NumericValue;
  pressao_3: NumericValue;
  pressao_4: NumericValue;
  pressao_5: NumericValue;

  vazao_1: NumericValue;
  vazao_2: NumericValue;
  vazao_3: NumericValue;
  vazao_4: NumericValue;

  valvula: NumericValue;
};

const initialLastValues: LastValues = {
  temp_1: null,
  temp_2: null,
  temp_3: null,
  temp_4: null,
  temp_5: null,
  temp_6: null,
  temp_7: null,
  temp_8: null,
  temp_9: null,
  temp_10: null,
  temp_11: null,
  temp_A: null,
  temp_B: null,

  pressao_1: null,
  pressao_2: null,
  pressao_3: null,
  pressao_4: null,
  pressao_5: null,

  vazao_1: null,
  vazao_2: null,
  vazao_3: null,
  vazao_4: null,

  valvula: null,
};

export default function DecisiveIndicatorsCard() {
  const { data, isLoading } = useMeasurementLatest({
    assetId: ASSET_ID,
    refetchIntervalMs: 2000,
  });

  const [last, setLast] = useState<LastValues>(initialLastValues);

  useEffect(() => {
    if (!data) return;

    setLast((prev) => {
      const next = { ...prev };

      const fields = Object.keys(initialLastValues) as (keyof LastValues)[];

      fields.forEach((field) => {
        const value = data[field as keyof typeof data];

        if (typeof value === "number" && Number.isFinite(value)) {
          next[field] = value;
        }
      });

      const changed = fields.some((field) => next[field] !== prev[field]);
      return changed ? next : prev;
    });
  }, [data]);

  const temperatureItems: CardItem[] = useMemo(() => {
    const labels = [
      { key: "temp_1", label: "T1" },
      { key: "temp_2", label: "T2" },
      { key: "temp_3", label: "T3" },
      { key: "temp_4", label: "T4" },
      { key: "temp_5", label: "T5" },
      { key: "temp_6", label: "T6" },
      { key: "temp_7", label: "T7" },
      { key: "temp_8", label: "T8" },
      { key: "temp_9", label: "T9" },
      { key: "temp_10", label: "T10" },
      { key: "temp_11", label: "T11" },
      { key: "temp_A", label: "Temperatura A" },
      { key: "temp_B", label: "Temperatura B" },
    ] as const;

    return labels
      .map((item) => {
        const value = last[item.key];
        if (typeof value !== "number") return null;
        return { key: item.key, label: item.label, value, unit: "°C" };
      })
      .filter(Boolean) as CardItem[];
  }, [last]);

  const pressureItems: CardItem[] = useMemo(() => {
    const labels = [
      { key: "pressao_1", label: "Pressão 1" },
      { key: "pressao_2", label: "Pressão 2" },
      { key: "pressao_3", label: "Pressão 3" },
      { key: "pressao_4", label: "Pressão 4" },
      { key: "pressao_5", label: "Pressão 5" },
    ] as const;

    return labels
      .map((item) => {
        const value = last[item.key];
        if (typeof value !== "number") return null;
        return { key: item.key, label: item.label, value, unit: "bar" };
      })
      .filter(Boolean) as CardItem[];
  }, [last]);

  const flowItems: CardItem[] = useMemo(() => {
    const labels = [
      { key: "vazao_1", label: "Vazão 1" },
      { key: "vazao_2", label: "Vazão 2" },
      { key: "vazao_3", label: "Vazão 3" },
      { key: "vazao_4", label: "Vazão 4" },
    ] as const;

    return labels
      .map((item) => {
        const value = last[item.key];
        if (typeof value !== "number") return null;
        return { key: item.key, label: item.label, value, unit: "L/h" };
      })
      .filter(Boolean) as CardItem[];
  }, [last]);

  const actuatorItems: CardItem[] = useMemo(() => {
    if (typeof last.valvula !== "number") return [];

    return [
      {
        key: "valvula",
        label: "Abertura da Válvula",
        value: last.valvula,
        unit: "%",
      },
    ];
  }, [last.valvula]);

  const showInitialLoading =
    isLoading &&
    temperatureItems.length === 0 &&
    pressureItems.length === 0 &&
    flowItems.length === 0 &&
    actuatorItems.length === 0;

  const renderSection = (title: string, items: CardItem[]) => {
    if (items.length === 0) return null;

    return (
      <div style={{ marginTop: 18 }}>
        <div
          style={{
            fontWeight: 600,
            color: "white",
            marginBottom: 10,
            fontSize: 14,
            opacity: 0.9,
          }}
        >
          {title}
        </div>

        {items.map((it) => (
          <div key={it.key} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.7, color: "white" }}>
              {it.label}
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "white",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {it.value.toFixed(3)}{" "}
              <span style={{ fontSize: 12, opacity: 0.7 }}>{it.unit}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        borderRadius: 14,
        padding: 16,
        background: "rgba(255,255,255,0.06)",
        marginBottom: 16,
      }}
    >
      <div style={{ fontWeight: 700, color: "white", marginBottom: 12 }}>
        Dados Atuais do CLP
      </div>

      {showInitialLoading ? (
        <div style={{ color: "white", opacity: 0.7, fontSize: 13 }}>
          Carregando…
        </div>
      ) : temperatureItems.length === 0 &&
        pressureItems.length === 0 &&
        flowItems.length === 0 &&
        actuatorItems.length === 0 ? (
        <div style={{ color: "white", opacity: 0.7, fontSize: 13 }}>
          Sem dados no momento.
        </div>
      ) : (
        <>
          {renderSection("Temperaturas", temperatureItems)}
          {renderSection("Pressões", pressureItems)}
          {renderSection("Vazões", flowItems)}
          {renderSection("Atuador", actuatorItems)}
        </>
      )}
    </div>
  );
}