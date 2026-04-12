export type FilterSummary = {
    campus: string;
    startPeriod: string;
    endPeriod: string;
};

export function buildFilterSubtitle(filters: FilterSummary, prefix?: string) {
    const campusLabel = filters.campus ? filters.campus : "Todos os campi";
    const periodLabel = filters.startPeriod && filters.endPeriod
        ? `${filters.startPeriod} até ${filters.endPeriod}`
        : "Todos os períodos";

    const parts = [
        prefix?.trim(),
        `Campus: ${campusLabel}`,
        `Período: ${periodLabel}`,
    ].filter(Boolean);

    return parts.join(" • ");
}
