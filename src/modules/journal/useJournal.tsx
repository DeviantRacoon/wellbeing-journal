import { useToast } from "@/commons/components";
import { FOCUS_LEVELS } from "@/commons/libs/constants";
import { api } from "@/commons/libs/request";
import { sanitizeText } from "@/commons/libs/sanitize";
import React, { useState } from "react";
import type { IJournal, JournalStep, SheetPhase } from "./journal.d";

export default function useJournal() {
  const { toast } = useToast();
  const [step, setStep] = useState<JournalStep>("writing");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetPhase, setSheetPhase] = useState<SheetPhase>(1);

  const [entry, setEntry] = useState<IJournal>({
    content: "",
    mood: 3,
    sleep: 7,
    socialBattery: 0,
    focus: 3,
  });

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setEntry((prev) => ({ ...prev, content: text }));
  };

  const startReflection = () => {
    if (entry.content.trim().length === 0) return;
    setStep("reflecting");
    setSheetPhase(1);
    setIsSheetOpen(true);
  };

  const submitEntry = async () => {
    const cleanContent = sanitizeText(entry.content);
    const { ok } = await api.post("dailies", {
      ...entry,
      content: cleanContent,
    });

    if (!ok) {
      toast.error("Error", "Hubo un problema, estamos trabajando en ello.");
      return;
    }

    setIsSheetOpen(false);
    setTimeout(() => {
      setStep("feedback");
      // Notify other components (like Dashboard) that data has changed
      window.dispatchEvent(new Event("journal-update"));
    }, 300);
  };

  const getFocusLabel = (val: number) => {
    if (val <= FOCUS_LEVELS.LOW.max) return FOCUS_LEVELS.LOW.label;
    if (val === FOCUS_LEVELS.MEDIUM.val) return FOCUS_LEVELS.MEDIUM.label;
    return FOCUS_LEVELS.HIGH.label;
  };

  return {
    step,
    isSheetOpen,
    sheetPhase,
    entry,
    handleContentChange,
    startReflection,
    submitEntry,
    getFocusLabel,
    setSheetPhase,
    setEntry,
    setIsSheetOpen,
    setStep,
  };
}
