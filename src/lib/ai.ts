import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const openrouterWithFallback = (
  modelId: string,
  enableReasoning: boolean
) => {
  // Intentar crear modelo con nueva sintaxis
  if (enableReasoning) {
    try {
      return createOpenRouter({
        apiKey: import.meta.env.VITE_OPENROUTER_API_KEY!,
      })(modelId, {
        extraBody: {
          reasoning: { effort: "high", exclude: false },
        },
      });
    } catch (err) {
      console.warn(
        `[OpenRouter] model ${modelId} no soporta 'reasoning', usando 'include_reasoning'`,
        err
      );
      // Fallback legacy
      return createOpenRouter({
        apiKey: import.meta.env.VITE_OPENROUTER_API_KEY!,
      })(modelId, {
        extraBody: { include_reasoning: true },
      });
    }
  }
  // Si no pide reasoning, devolvemos modelo normal
  return createOpenRouter({ apiKey: import.meta.env.VITE_OPENROUTER_API_KEY! })(modelId);
};
