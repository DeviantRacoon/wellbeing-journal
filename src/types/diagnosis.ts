export interface DiagnosisResponse {
  resumen_clinico: string;
  indicadores: {
    estabilidad_emocional: number; // 1-10
    nivel_energia: number; // 1-10
    riesgo_burnout: number; // 1-10
  };
  hallazgos_clave: string[];
  alerta_roja: boolean;
  recomendacion_terapeutica: string;
}
