type JournalStep = "writing" | "reflecting" | "feedback";
type SheetPhase = 1 | 2; // Fase 1: Cuerpo, Fase 2: Mente

interface IJournal {
  id?: number;
  content: string;
  mood: number;
  sleep: number;
  socialBattery: number;
  focus: number;
  createdAt?: string;
}

export type { IJournal, JournalStep, SheetPhase };
