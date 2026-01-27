import { jsonToToon, toonToJson } from "toon-parser";

const expectedOutput = {
  resumen_clinico: "Example summary",
  indicadores: {
    estabilidad_emocional: 5,
    nivel_energia: 7,
    riesgo_burnout: 1,
  },
  hallazgos_clave: ["Finding 1", "Finding 2", "Finding 3"],
  alerta_roja: false,
  recomendacion_terapeutica: "Example recommendation",
};

console.log("Expected TOON Format:");
console.log(jsonToToon(expectedOutput));

const testToon1 = `
resumen_clinico: Example
indicadores:
  estabilidad_emocional: 5
  nivel_energia: 7
  riesgo_burnout: 1
hallazgos_clave:
  - Finding 1
  - Finding 2
alerta_roja: false
recomendacion_terapeutica: Test
`;

console.log("Testing List Syntax:");
try {
  console.log(JSON.stringify(toonToJson(testToon1), null, 2));
} catch (e: unknown) {
  console.log("List syntax failed:", (e as Error).message);
}

const testToon2 = `
resumen_clinico: Example
indicadores:
  estabilidad_emocional: 5
hallazgos_clave: Finding 1, Finding 2
alerta_roja: false
recomendacion_terapeutica: Test
`;

console.log("Testing Comma Syntax:");
try {
  console.log(JSON.stringify(toonToJson(testToon2), null, 2));
} catch (e: unknown) {
  console.log("Comma syntax failed:", (e as Error).message);
}

const testToon3 = `
resumen_clinico: Example
indicadores:
  estabilidad_emocional: 5
hallazgos_clave[2]: "Finding 1", "Finding 2, with comma"
alerta_roja: false
recomendacion_terapeutica: Test
`;

console.log("Testing Strict Array Syntax:");
try {
  console.log(JSON.stringify(toonToJson(testToon3), null, 2));
} catch (e: unknown) {
  console.log((e as Error).message);
}

const testToon4 = `
resumen_clinico: Example
indicadores:
  estabilidad_emocional: 5
hallazgos_clave[2]: "Finding 1","Finding 2, with comma"
alerta_roja: false
recomendacion_terapeutica: Test
`;

console.log("Testing No-Space Syntax:");
try {
  console.log(JSON.stringify(toonToJson(testToon4), null, 2));
} catch (e: unknown) {
  console.log((e as Error).message);
}
