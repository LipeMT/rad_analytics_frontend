export type KeyDescription = {
    label: string;
    color: string;
};

export type KeysDescription = Record<string, KeyDescription>;

export const activityKeysDescription: KeysDescription = {
    aula: { label: "Aula", color: "#3B82F6" },
    administracao_representacao: { label: "Administração/Representação", color: "#6B7280" },
    ensino: { label: "Ensino", color: "#10B981" },
    capacitacao: { label: "Capacitação", color: "#F59E0B" },
    extensao: { label: "Extensão", color: "#EF4444" },
    pesquisa: { label: "Pesquisa", color: "#8B5CF6" },
};

export const intersectionKeysDescription: KeysDescription = {
    intersection: { label: "Intersecção", color: "#9333EA" },
};

export const totalRecordsKeysDescription: KeysDescription = {
    total: { label: "Total", color: "#1086b9" },
};

export const approvedKeysDescription: KeysDescription = {
    approved: { label: "Homologado", color: "#10B981" },
};

export const activityRadarLabels: Record<string, string> = {
    aula: "Aula",
    ensino: "Ensino",
    capacitacao: "Capacitação",
    pesquisa: "Pesquisa",
    extensao: "Extensão",
    administracao_representacao: "Administração/Representação",
};
