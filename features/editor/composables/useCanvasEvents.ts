import { fabric } from "fabric";

interface UseCanvasEventsProps {
    save: () => void;
    setSelectedObjects: (objects: fabric.Object[]) => void;
    clearSelectionCallback?: () => void;
};
export const useCanvasEvents = ({
    save,
    setSelectedObjects,
    clearSelectionCallback,
}: UseCanvasEventsProps) => {
    const clearEvents = (canvas: fabric.Canvas | undefined) => {
        if (canvas) {
            canvas.off("object:added");
            canvas.off("object:removed");
            canvas.off("object:modified");
            canvas.off("selection:created");
            canvas.off("selection:updated");
            canvas.off("selection:cleared");
        }
    }

    const setEvents = (canvas: fabric.Canvas | undefined) => {
        if (canvas) {
            clearEvents(canvas);
            canvas.on("object:added", () => save());
            canvas.on("object:removed", () => save());
            canvas.on("object:modified", () => save());
            canvas.on("selection:created", (e) => {
                setSelectedObjects(e.selected || []);
            });
            canvas.on("selection:updated", (e) => {
                setSelectedObjects(e.selected || []);
            });
            canvas.on("selection:cleared", () => {
                setSelectedObjects([]);
                clearSelectionCallback?.();
            });
        }
    };

    return {
        setEvents
    }
};