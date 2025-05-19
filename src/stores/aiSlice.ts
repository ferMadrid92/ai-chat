import type { StateCreator } from "zustand";
import AIService from "../services/AIService";
import { MODELS } from "../lib/models";

export type AiSlice = {
  response: string;
  reasoning: string;
  isGenerating: boolean;
  model: string;
  useReasoning: boolean;
  setModel: (model: string) => void;
  setUseReasoning: (on: boolean) => void;
  generateResponse: (prompt: string) => Promise<void>;
};

export const createAiSlice: StateCreator<AiSlice> = (set, get) => ({
  response: "",
  reasoning: "",
  isGenerating: false,
  model: MODELS[0].id,
  useReasoning: false,
  setModel: (model) => set({ model }),
  setUseReasoning: (on) => set({ useReasoning: on }),

  generateResponse: async (prompt: string) => {
    set({ response: "", reasoning: "", isGenerating: true });
    try {
      const modelObj = MODELS.find((m) => m.id === get().model);
      const supports = modelObj?.reasoning ?? false;

      const stream = AIService.generateResponse(
        prompt,
        get().model,
        supports && get().useReasoning
      );

      for await (const part of stream as AsyncIterable<any>) {
        // Solo procesamos text-delta y reasoning
        if (part.type === "text-delta") {
          set((s) => ({ response: s.response + part.textDelta }));
        } else if (part.type === "reasoning") {
          set((s) => ({ reasoning: s.reasoning + part.textDelta }));
        }
        // else → lo descartamos
      }
    } catch {
      set({ response: "Error generating response" });
    } finally {
      set({ isGenerating: false });
    }
  },
});