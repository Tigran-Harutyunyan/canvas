import { fabric } from "fabric";
import { useAutoResize } from "~/features/editor/composables/useAutoResize";
import { useCanvasEvents } from "~/features/editor/composables/useCanvasEvents";
import { useHistory } from "~/features/editor/composables/useHistory";
import {
    createFilter,
    downloadFile,
    isTextType,
    transformText
} from "@/features/editor/utils";
import {
    type Editor,
    FILL_COLOR,
    STROKE_WIDTH,
    STROKE_COLOR,
    CIRCLE_OPTIONS,
    DIAMOND_OPTIONS,
    TRIANGLE_OPTIONS,
    type BuildEditorProps,
    RECTANGLE_OPTIONS,
    type EditorHookProps,
    STROKE_DASH_ARRAY,
    TEXT_OPTIONS,
    FONT_FAMILY,
    FONT_WEIGHT,
    FONT_SIZE,
    JSON_KEYS,
} from "@/features/editor/types";
export const useEditor = ({
    defaultState,
    defaultHeight,
    defaultWidth,
    clearSelectionCallback,
    saveCallback,
}: EditorHookProps) => {

    const canvas = ref<fabric.Canvas>();
    const container = ref<HTMLDivElement>();
    const selectedObjects = ref<fabric.Object[]>([]);

    const fontFamily = FONT_FAMILY;
    const fillColor = FILL_COLOR;
    const strokeColor = STROKE_COLOR;
    const strokeWidth = STROKE_WIDTH;

    const setSelectedObjects = (selected: fabric.Object[]) => {
        selectedObjects.value = selected;
    }

    const { autoZoom, observe } = useAutoResize();
    const {
        save,
        canRedo,
        canUndo,
        undo,
        redo,
        canvasHistory,
        setHistoryIndex,
    } = useHistory({
        canvas: canvas.value,
        saveCallback
    });

    const { setEvents } = useCanvasEvents({
        save,
        setSelectedObjects,
        clearSelectionCallback,
    });

    const addToCanvas = (object: fabric.Object) => {
        if (!canvas.value) return;
        // center(object);
        canvas.value.add(object);
        canvas.value.setActiveObject(object);
    };

    const buildEditor = ({
        canvas,
        fillColor,
        strokeColor,
        strokeWidth,
        strokeDashArray,
    }: BuildEditorProps) => {

        const getWorkspace = () => {
            return canvas
                .getObjects()
                .find((object) => object.name === "clip");
        };

        const center = (object: fabric.Object) => {
            const workspace = getWorkspace();
            const center = workspace?.getCenterPoint();

            if (!center) return;

            // @ts-ignore
            canvas._centerObject(object, center);
        };

        const addToCanvas = (object: fabric.Object) => {
            center(object);
            canvas.add(object);
            canvas.setActiveObject(object);
        };

        return {
            getWorkspace,
            addCircle: () => {
                const object = markRaw(new fabric.Circle({
                    ...CIRCLE_OPTIONS,
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    strokeDashArray: strokeDashArray,
                }));

                addToCanvas(object);
            },
            addSoftRectangle: () => {
                const object = markRaw(new fabric.Rect({
                    ...RECTANGLE_OPTIONS,
                    rx: 50,
                    ry: 50,
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    strokeDashArray: strokeDashArray,
                }));

                addToCanvas(object);
            },
            addRectangle: () => {
                const object = markRaw(new fabric.Rect({
                    ...RECTANGLE_OPTIONS,
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    strokeDashArray: strokeDashArray,
                }));

                addToCanvas(object);
            },
            addTriangle: () => {
                const object = markRaw(new fabric.Triangle({
                    ...TRIANGLE_OPTIONS,
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    strokeDashArray: strokeDashArray,
                }));

                addToCanvas(object);
            },
            addInverseTriangle: () => {
                const HEIGHT = TRIANGLE_OPTIONS.height;
                const WIDTH = TRIANGLE_OPTIONS.width;

                const object = markRaw(new fabric.Polygon(
                    [
                        { x: 0, y: 0 },
                        { x: WIDTH, y: 0 },
                        { x: WIDTH / 2, y: HEIGHT },
                    ],
                    {
                        ...TRIANGLE_OPTIONS,
                        fill: fillColor,
                        stroke: strokeColor,
                        strokeWidth: strokeWidth,
                        strokeDashArray: strokeDashArray,
                    }
                ));

                addToCanvas(object);
            },
            addDiamond: () => {
                const HEIGHT = DIAMOND_OPTIONS.height;
                const WIDTH = DIAMOND_OPTIONS.width;

                const object = markRaw(new fabric.Polygon(
                    [
                        { x: WIDTH / 2, y: 0 },
                        { x: WIDTH, y: HEIGHT / 2 },
                        { x: WIDTH / 2, y: HEIGHT },
                        { x: 0, y: HEIGHT / 2 },
                    ],
                    {
                        ...DIAMOND_OPTIONS,
                        fill: fillColor,
                        stroke: strokeColor,
                        strokeWidth: strokeWidth,
                        strokeDashArray: strokeDashArray,
                    }
                ));
                addToCanvas(object);
            },
            canvas,

        };
    };


    const editor = ref({});

    const init = ({
        initialCanvas,
        initialContainer,
    }: {
        initialCanvas: fabric.Canvas
        initialContainer: HTMLDivElement
    }) => {
        fabric.Object.prototype.set({
            cornerColor: "#FFF",
            cornerStyle: "circle",
            borderColor: "#3b82f6",
            borderScaleFactor: 1.5,
            transparentCorners: false,
            borderOpacityWhenMoving: 1,
            cornerStrokeColor: "#3b82f6",
        });

        const initialWorkspace = new fabric.Rect({
            width: 900,
            height: 1200,
            name: "clip",
            fill: "white",
            selectable: false,
            hasControls: false,
            shadow: new fabric.Shadow({
                color: "rgba(0,0,0,0.8)",
                blur: 5,
            }),
        });

        initialCanvas.setWidth(initialContainer.offsetWidth);
        initialCanvas.setHeight(initialContainer.offsetHeight);

        initialCanvas.add(initialWorkspace);
        initialCanvas.centerObject(initialWorkspace);
        initialCanvas.clipPath = initialWorkspace;

        canvas.value = initialCanvas;
        container.value = initialContainer;

        observe({
            canvas: canvas.value,
            container: container.value,
        });

        editor.value = buildEditor({
            canvas: canvas.value,
            fillColor,
            strokeWidth,
            strokeColor,
        });

        setEvents(canvas.value);
    }

    return {
        init,
        editor
    }
}