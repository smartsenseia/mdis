import { useQuery, keepPreviousData, type UseQueryResult } from "@tanstack/react-query";
import { getMeasurements, type MeasurementDTO } from "../api/telemetry.api";

export type MeasurementField =
  | "temp_1"
  | "temp_2"
  | "temp_3"
  | "temp_4"
  | "temp_5"
  | "temp_6"
  | "temp_7"
  | "temp_8"
  | "temp_9"
  | "temp_10"
  | "temp_11"
  | "temp_A"
  | "temp_B"
  | "pressao_1"
  | "pressao_2"
  | "pressao_3"
  | "pressao_4"
  | "pressao_5"
  | "vazao_1"
  | "vazao_2"
  | "vazao_3"
  | "vazao_4"
  | "valvula";

type SeriesPoint = {
  timestamp: string;
  value: number;
};

export function useMeasurementsSeries(options: {
  assetId: string;
  field: MeasurementField;
  limit?: number;
  refetchIntervalMs?: number;
}): UseQueryResult<{ series: SeriesPoint[] }, Error> {
  const { assetId, field, limit = 200, refetchIntervalMs = 10_000 } = options;

  return useQuery<{ series: SeriesPoint[] }, Error>({
    queryKey: ["measurements", "series", assetId, field, limit] as const,

    queryFn: async () => {
      const rows: MeasurementDTO[] = await getMeasurements({
        skip: 0,
        limit,
        assetId,
      });

      const series = rows
        .map((m) => {
          const value = m[field];

          return {
            timestamp: m.timestamp,
            value: typeof value === "number" ? value : Number(value),
          };
        })
        .filter((p) => Number.isFinite(p.value))
        .reverse();

      return { series };
    },

    enabled: Boolean(assetId),

    refetchInterval: refetchIntervalMs,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,

    placeholderData: keepPreviousData,
    retry: 2,
  });
}