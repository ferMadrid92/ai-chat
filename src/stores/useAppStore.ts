import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { AiSlice } from "./aiSlice"
import { createAiSlice } from "./aiSlice"
import { createNotificationSlice, type NotificationSliceType } from "./notificationSlice"

export const useAppStore = create<AiSlice & NotificationSliceType>()(
    devtools( (...a) => ({
        ...createAiSlice(...a),
        ...createNotificationSlice(...a)
    })))