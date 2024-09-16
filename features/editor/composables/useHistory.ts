import { fabric } from "fabric";
import { JSON_KEYS } from "@/features/editor/types";

interface UseHistoryProps {
    saveCallback?: (values: {
        json: string;
        height: number;
        width: number;
    }) => void;
};

export const useHistory = ({ saveCallback }: UseHistoryProps) => {
    const historyIndex = ref(0);
    const canvasHistory = ref<string[]>([]);
    const skipSave = ref(false);
    let canvas: fabric.Canvas | undefined;

    const setHistoryIndex = (current: number): void => {
        historyIndex.value = current;
    }

    const canUndo = computed(() => {
        return historyIndex.value > 0;
    });

    const canRedo = computed(() => {
        return historyIndex.value < canvasHistory.value.length - 1;
    });

    const save = (skip = false) => {
        if (!canvas) return;

        const currentState = canvas.toJSON(JSON_KEYS);
        const json = JSON.stringify(currentState);

        if (!skip && !skipSave.value) {
            canvasHistory.value.push(json);
            setHistoryIndex(canvasHistory.value.length - 1);
        }

        const workspace = canvas
            .getObjects()
            .find((object) => object.name === "clip");
        const height = workspace?.height || 0;
        const width = workspace?.width || 0;

        saveCallback?.({ json, height, width });
    };

    const undo = () => {
        if (!canvas) return;

        if (canUndo.value) {
            skipSave.value = true;
            canvas?.clear().renderAll();

            const previousIndex = historyIndex.value - 1;
            const previousState = JSON.parse(
                canvasHistory.value[previousIndex]
            );
            canvas?.loadFromJSON(previousState, () => {
                canvas?.renderAll();
                historyIndex.value = previousIndex;
                skipSave.value = false;
            });
            canvas?.renderAll();
        }
    };

    const redo = () => {
        if (canRedo.value) {
            skipSave.value = true;
            canvas?.clear().renderAll();

            const nextIndex = historyIndex.value + 1;
            const nextState = JSON.parse(
                canvasHistory.value[nextIndex]
            );

            canvas?.loadFromJSON(nextState, () => {
                canvas?.renderAll();
                historyIndex.value = nextIndex;
                skipSave.value = false;
            });
        }
    };

    const setHistoryCanvas = (data: fabric.Canvas) => {
        canvas = data;
    }

    return {
        save,
        canUndo,
        canRedo,
        undo,
        redo,
        setHistoryIndex,
        canvasHistory,
        setHistoryCanvas,
    };
};
