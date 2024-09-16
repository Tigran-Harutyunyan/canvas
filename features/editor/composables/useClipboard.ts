import { fabric } from "fabric";

export const useClipboard = () => {
    const clipboard = ref<any>(null);
    let canvas: fabric.Canvas | undefined;

    const copy = () => {
        canvas?.getActiveObject()?.clone((cloned: any) => {
            clipboard.value = cloned;
        });
    }

    const paste = () => {
        if (!clipboard.value) return;

        clipboard.value.clone((clonedObj: any) => {
            canvas?.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });

            if (clonedObj.type === "activeSelection") {
                clonedObj.canvas = canvas;
                clonedObj.forEachObject((obj: any) => {
                    canvas?.add(obj);
                });
                clonedObj.setCoords();
            } else {
                canvas?.add(clonedObj);
            }

            clipboard.value.top += 10;
            clipboard.value.left += 10;
            canvas?.setActiveObject(clonedObj);
            canvas?.requestRenderAll();
        });
    }

    const setClipboardCanvas = (newCanvas: fabric.Canvas) => {
        canvas = newCanvas;
    }

    return { copy, paste, setClipboardCanvas };
}