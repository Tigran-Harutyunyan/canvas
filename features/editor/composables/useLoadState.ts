import { fabric } from "fabric";
import { JSON_KEYS } from "@/features/editor/types";

interface UseLoadStateProps {
    autoZoom: () => void;
    canvas: fabric.Canvas | null;
    initialState: string | undefined;
    canvasHistory: string[];
    setHistoryIndex: (index: number) => void;
};
export const useLoadState = ({
    canvas,
    autoZoom,
    initialState,
    canvasHistory,
    setHistoryIndex,
}: UseLoadStateProps) => {
    const initialized = ref(false);

    if (!initialized.value && initialState && canvas) {
        const data = JSON.parse(initialState);

        canvas.loadFromJSON(data, () => {
            const currentState = JSON.stringify(
                canvas.toJSON(JSON_KEYS),
            );

            canvasHistory = [currentState];
            setHistoryIndex(0);
            autoZoom();
        });
        initialized.value = true;
    }
};
