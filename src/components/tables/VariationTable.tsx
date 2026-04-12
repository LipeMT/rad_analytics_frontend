import { TrendingDown, TrendingUp } from "lucide-react";
import React, { useMemo } from "react";
import { activityKeysDescription } from "../../utils/chartKeys";

export type ApiResponse = Record<string, Record<string, number>>;

interface VariationTableProps {
  data: ApiResponse;
}

type Activity = keyof typeof activityKeysDescription;

type RowData = {
  activity: Activity
  values: Record<string, number>;
  variations: Record<string, number | null>;
};

function comparePeriod(a: string, b: string) {
  const [ay, as_] = a.split("/").map(Number);
  const [by, bs] = b.split("/").map(Number);
  if (ay !== by) return ay - by;
  return as_ - bs;
}

export const VariationTable: React.FC<VariationTableProps> = ({ data }) => {
  const sortedPeriods = useMemo(() => {
    return Object.keys(data).sort(comparePeriod);
  }, [data]);

  const activities: Activity[] = useMemo(() => {
    const set = new Set<Activity>();
    Object.values(data).forEach((row) => {
      Object.keys(row).forEach((act) => set.add(act as Activity));
    });
    return Array.from(set).sort();
  }, [data]);

  const rows: RowData[] = useMemo(() => {
    return activities.map((act) => {
      const values: Record<string, number> = {};
      const variations: Record<string, number | null> = {};
      let prev: number | null = null;
      sortedPeriods.forEach((p) => {
        const val = data[p]?.[act] ?? 0;
        values[p] = val;
        if (prev === null || prev === 0) {
          variations[p] = null;
        } else {
          variations[p] = ((val - prev) / prev) * 100;
        }
        prev = val;
      });
      return { activity: act, values, variations };
    });
  }, [activities, sortedPeriods, data]);

  if (sortedPeriods.length === 0 || activities.length === 0) {
    return (
      <div className="text-sm text-gray-600">Nenhum dado disponível.</div>
    );
  }

  const activityLabels = Object.fromEntries(
    (Object.keys(activityKeysDescription) as Activity[]).map((activity) => [
      activity,
      activityKeysDescription[activity]?.label ?? activity,
    ])
  ) as Record<Activity, string>;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 scrollbar-thin scrollbar-thumb-gray-300">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Atividade
            </th>
            {sortedPeriods.map((p) => (
              <th
                key={p}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((r) => (
            <tr key={r.activity}>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-medium">
                {activityLabels[r.activity]}
              </td>
              {sortedPeriods.map((p) => {
                const value = r.values[p];
                const variation = r.variations[p];
                const isBgGreen = variation !== null && variation >= 0;
                // const isBgRed = variation !== null && variation < 0;

                return (
                  <td
                    key={p}
                    className={`whitespace-nowrap px-4 py-3 text-sm`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-900 font-medium">
                        {value.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                      </span>
                      {variation !== null && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                            isBgGreen
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isBgGreen ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {variation.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%
                        </span>
                      )}
                      {variation === null && <span className="text-gray-400 text-xs">-</span>}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
