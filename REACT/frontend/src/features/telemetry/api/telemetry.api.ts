import { http } from "@/shared/api/http";

export type MeasurementDTO = {
  id: number;
  timestamp: string;

  temp_1?: number | null;
  temp_2?: number | null;
  temp_3?: number | null;
  temp_4?: number | null;
  temp_5?: number | null;
  temp_6?: number | null;
  temp_7?: number | null;
  temp_8?: number | null;
  temp_9?: number | null;
  temp_10?: number | null;
  temp_11?: number | null;

  temp_A?: number | null;
  temp_B?: number | null;

  pressao_1?: number | null;
  pressao_2?: number | null;
  pressao_3?: number | null;
  pressao_4?: number | null;
  pressao_5?: number | null;

  vazao_1?: number | null;
  vazao_2?: number | null;
  vazao_3?: number | null;
  vazao_4?: number | null;

  valvula?: number | null;
};

export async function getMeasurements(params: {
  skip?: number;
  limit?: number;
}): Promise<MeasurementDTO[]> {
  const { skip = 0, limit = 200 } = params;

  const { data } = await http.get<MeasurementDTO[]>("/api/v1/endpoints/", {
    params: {
      skip,
      limit,
    },
  });

  return data;
}