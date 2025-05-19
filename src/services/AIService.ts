import { streamText } from "ai";
import { openrouterWithFallback } from "../lib/ai";
import { MODELS } from "../lib/models";

export default {
  generateResponse(
    prompt: string,
    modelId: string,
    enableReasoning: boolean
  ) {
    const supports = MODELS.find((m) => m.id === modelId)?.reasoning ?? false;
    const routerModel = openrouterWithFallback(modelId, supports && enableReasoning);

    const result = streamText({
      model: routerModel,
      prompt,
      temperature: 0.2,
    });

    return supports && enableReasoning ? result.fullStream : result.textStream;
  },
};
