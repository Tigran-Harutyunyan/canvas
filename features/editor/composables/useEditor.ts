import { fabric } from "fabric";
import { useAutoResize } from "~/features/editor/composables/useAutoResize";
import { useCanvasEvents } from "~/features/editor/composables/useCanvasEvents";
import { useHistory } from "~/features/editor/composables/useHistory";
import { useClipboard } from "~/features/editor/composables/useClipboard";
import { useHotkeys } from "~/features/editor/composables/useHotkeys";
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

    let canvas: fabric.Canvas;
    const container = ref<HTMLDivElement>();
    const selectedObjects = ref<fabric.Object[]>([]);

    let fontFamily = FONT_FAMILY;
    let fillColor = FILL_COLOR;
    let strokeColor = STROKE_COLOR;
    let strokeWidth = STROKE_WIDTH;
    let strokeDashArray = STROKE_DASH_ARRAY;

    const setSelectedObjects = (selected: fabric.Object[]) => {
        selectedObjects.value = selected;
    }
    const { copy, paste, setClipboardCanvas } = useClipboard();
    const { autoZoom, observe } = useAutoResize();
    const {
        save,
        undo,
        redo,
        canRedo,
        canUndo,
        canvasHistory,
        setHistoryCanvas,
    } = useHistory({
        saveCallback
    });

    const { setEvents } = useCanvasEvents({
        save,
        setSelectedObjects,
        clearSelectionCallback,
    });

    const buildEditor = ({
        canvas,
        fillColor,
        strokeColor,
        strokeWidth,
        strokeDashArray,
    }: BuildEditorProps) => {
        const generateSaveOptions = () => {
            const { width, height, left, top } = getWorkspace() as fabric.Rect;

            return {
                name: "Image",
                format: "png",
                quality: 1,
                width,
                height,
                left,
                top,
            };
        };

        const savePng = () => {
            const options = generateSaveOptions();

            canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
            const dataUrl = canvas.toDataURL(options);

            downloadFile(dataUrl, "png");
            autoZoom();
        };

        const saveSvg = () => {
            const options = generateSaveOptions();

            canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
            const dataUrl = canvas.toDataURL(options);

            downloadFile(dataUrl, "svg");
            autoZoom();
        };

        const saveJpg = () => {
            const options = generateSaveOptions();

            canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
            const dataUrl = canvas.toDataURL(options);

            downloadFile(dataUrl, "jpg");
            autoZoom();
        };

        const saveJson = async () => {
            const dataUrl = canvas.toJSON(JSON_KEYS);

            await transformText(dataUrl.objects);
            const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(dataUrl, null, "\t"),
            )}`;
            downloadFile(fileString, "json");
        };

        const loadJson = (json: string) => {
            const data = JSON.parse(json);

            canvas.loadFromJSON(data, () => {
                autoZoom();
            });
        };

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
            savePng,
            saveJpg,
            saveSvg,
            saveJson,
            loadJson,
            getWorkspace,
            changeFillColor: (value: string) => {
                fillColor = value;
                canvas.getActiveObjects().forEach((object) => {
                    object.set({ fill: value });
                });
                canvas.renderAll();
            },
            changeStrokeColor: (value: string) => {
                strokeColor = value;
                canvas.getActiveObjects().forEach((object) => {
                    // Text types don't have stroke
                    if (isTextType(object.type)) {
                        object.set({ fill: value });
                        return;
                    }

                    object.set({ stroke: value });
                });
                canvas.freeDrawingBrush.color = value;
                canvas.renderAll();
            },
            changeStrokeWidth: (value: number) => {
                strokeWidth = value;
                canvas.getActiveObjects().forEach((object) => {
                    object.set({ strokeWidth: value });
                });
                canvas.freeDrawingBrush.width = value;
                canvas.renderAll();
            },
            changeStrokeDashArray: (value: number[]) => {
                strokeDashArray = value;
                canvas.getActiveObjects().forEach((object) => {
                    object.set({ strokeDashArray: value });
                });
                canvas.renderAll();
            },
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
            getActiveFontWeight: () => {
                const selectedObject = selectedObjects.value[0];

                if (!selectedObject) {
                    return FONT_WEIGHT;
                }

                // @ts-ignore
                // Faulty TS library, fontWeight exists.
                const value = selectedObject.get("fontWeight") || FONT_WEIGHT;

                return value;
            },
            getActiveFontFamily: () => {
                const selectedObject = selectedObjects.value[0];

                if (!selectedObject) {
                    return fontFamily;
                }

                // @ts-ignore
                // Faulty TS library, fontFamily exists.
                const value = selectedObject.get("fontFamily") || fontFamily;

                return value;
            },
            getActiveFillColor: () => {
                const selectedObject = selectedObjects.value[0];

                if (!selectedObject) {
                    return fillColor;
                }

                const value = selectedObject.get("fill") || fillColor;

                // Currently, gradients & patterns are not supported
                return value as string;
            },
            getActiveStrokeColor: () => {
                const selectedObject = selectedObjects.value[0];

                if (!selectedObject) {
                    return strokeColor;
                }

                const value = selectedObject.get("stroke") || strokeColor;

                return value;
            },
            getActiveStrokeWidth: () => {
                const selectedObject = selectedObjects.value[0];

                if (!selectedObject) {
                    return strokeWidth;
                }

                const value = selectedObject.get("strokeWidth") || strokeWidth;

                return value;
            },
            getActiveStrokeDashArray: () => {
                const selectedObject = selectedObjects.value[0];

                if (!selectedObject) {
                    return strokeDashArray;
                }

                const value = selectedObject.get("strokeDashArray") || strokeDashArray;

                return value;
            },
            addText: (value, options) => {
                const object = markRaw(new fabric.Textbox(value, {
                    ...TEXT_OPTIONS,
                    fill: fillColor,
                    ...options,
                }));

                addToCanvas(object);
            },
            getActiveOpacity: () => {
                const selectedObject = selectedObjects.value[0];

                if (!selectedObject) {
                    return 1;
                }

                const value = selectedObject.get("opacity") || 1;

                return value;
            },
            changeFontSize: (value: number) => {
                canvas.getActiveObjects().forEach((object) => {
                    if (isTextType(object.type)) {
                        // @ts-ignore
                        // Faulty TS library, fontSize exists.
                        object.set({ fontSize: value });
                    }
                });
                canvas.renderAll();
            },
            getActiveFontSize: () => {
                const selectedObject = selectedObjects.value[0];

                if (!selectedObject) {
                    return FONT_SIZE;
                }

                // @ts-ignore
                // Faulty TS library, fontSize exists.
                const value = selectedObject.get("fontSize") || FONT_SIZE;

                return value;
            },
            changeTextAlign: (value: string) => {
                canvas.getActiveObjects().forEach((object) => {
                    if (isTextType(object.type)) {
                        // @ts-ignore
                        // Faulty TS library, textAlign exists.
                        object.set({ textAlign: value });
                    }
                });
                canvas.renderAll();
            },
            getActiveTextAlign: () => {
                const selectedObject = selectedObjects.value[0];

                if (!selectedObject) {
                    return "left";
                }

                // @ts-ignore
                // Faulty TS library, textAlign exists.
                const value = selectedObject.get("textAlign") || "left";

                return value;
            },
            changeFontUnderline: (value: boolean) => {
                canvas.getActiveObjects().forEach((object) => {
                    if (isTextType(object.type)) {
                        // @ts-ignore
                        // Faulty TS library, underline exists.
                        object.set({ underline: value });
                    }
                });
                canvas.renderAll();
            },
            getActiveFontUnderline: () => {
                const selectedObject = selectedObjects.value[0];

                if (!selectedObject) {
                    return false;
                }

                // @ts-ignore
                // Faulty TS library, underline exists.
                const value = selectedObject.get("underline") || false;

                return value;
            },
            changeFontLinethrough: (value: boolean) => {
                canvas.getActiveObjects().forEach((object) => {
                    if (isTextType(object.type)) {
                        // @ts-ignore
                        // Faulty TS library, linethrough exists.
                        object.set({ linethrough: value });
                    }
                });
                canvas.renderAll();
            },
            getActiveFontLinethrough: () => {
                const selectedObject = selectedObjects.value[0];

                if (!selectedObject) {
                    return false;
                }

                // @ts-ignore
                // Faulty TS library, linethrough exists.
                const value = selectedObject.get("linethrough") || false;

                return value;
            },
            changeFontStyle: (value: string) => {
                canvas.getActiveObjects().forEach((object) => {
                    if (isTextType(object.type)) {
                        // @ts-ignore
                        // Faulty TS library, fontStyle exists.
                        object.set({ fontStyle: value });
                    }
                });
                canvas.renderAll();
            },
            getActiveFontStyle: () => {
                const selectedObject = selectedObjects.value[0];

                if (!selectedObject) {
                    return "normal";
                }

                // @ts-ignore
                // Faulty TS library, fontStyle exists.
                const value = selectedObject.get("fontStyle") || "normal";

                return value;
            },
            changeFontWeight: (value: number) => {
                canvas.getActiveObjects().forEach((object) => {
                    if (isTextType(object.type)) {
                        // @ts-ignore
                        // Faulty TS library, fontWeight exists.
                        object.set({ fontWeight: value });
                    }
                });
                canvas.renderAll();
            },
            changeOpacity: (value: number) => {
                canvas.getActiveObjects().forEach((object) => {
                    object.set({ opacity: value });
                });
                canvas.renderAll();
            },
            changeFontFamily: (value: string) => {
                fontFamily = value;
                canvas.getActiveObjects().forEach((object) => {
                    if (isTextType(object.type)) {
                        // @ts-ignore
                        // Faulty TS library, fontFamily exists.
                        object.set({ fontFamily: value });
                    }
                });
                canvas.renderAll();
            },
            bringForward: () => {
                canvas.getActiveObjects().forEach((object) => {
                    canvas.bringForward(object);
                });

                canvas.renderAll();

                const workspace = getWorkspace();
                workspace?.sendToBack();
            },
            sendBackwards: () => {
                canvas.getActiveObjects().forEach((object) => {
                    canvas.sendBackwards(object);
                });

                canvas.renderAll();
                const workspace = getWorkspace();
                workspace?.sendToBack();
            },
            delete: () => {
                canvas.getActiveObjects().forEach((object) => canvas.remove(object));
                canvas.discardActiveObject();
                canvas.renderAll();
            },
            autoZoom,
            onUndo: () => undo(),
            onRedo: () => redo(),
            onCopy: () => copy(),
            onPaste: () => paste(),
            zoomIn: () => {
                let zoomRatio = canvas.getZoom();
                zoomRatio += 0.05;
                const center = canvas.getCenter();
                canvas.zoomToPoint(
                    new fabric.Point(center.left, center.top),
                    zoomRatio > 1 ? 1 : zoomRatio
                );
            },
            zoomOut: () => {
                let zoomRatio = canvas.getZoom();
                zoomRatio -= 0.05;
                const center = canvas.getCenter();
                canvas.zoomToPoint(
                    new fabric.Point(center.left, center.top),
                    zoomRatio < 0.2 ? 0.2 : zoomRatio,
                );
            },
            changeSize: (value: { width: number; height: number }) => {
                const workspace = getWorkspace();

                workspace?.set(value);
                autoZoom();
                save();
            },
            changeBackground: (value: string) => {
                const workspace = getWorkspace();
                workspace?.set({ fill: value });
                canvas.renderAll();
                save();
            },
            enableDrawingMode: () => {
                canvas.discardActiveObject();
                canvas.renderAll();
                canvas.isDrawingMode = true;
                canvas.freeDrawingBrush.width = strokeWidth;
                canvas.freeDrawingBrush.color = strokeColor;
            },
            disableDrawingMode: () => {
                canvas.isDrawingMode = false;
            },
            changeImageFilter: (value: string) => {
                const objects = canvas.getActiveObjects();
                objects.forEach((object) => {
                    if (object.type === "image") {
                        const imageObject = object as fabric.Image;

                        const effect = createFilter(value);

                        imageObject.filters = effect ? [effect] : [];
                        imageObject.applyFilters();
                        canvas.renderAll();
                    }
                });
            },
            addImage: (value: string) => {
                fabric.Image.fromURL(
                    value,
                    (image) => {
                        const workspace = getWorkspace();

                        image.scaleToWidth(workspace?.width || 0);
                        image.scaleToHeight(workspace?.height || 0);

                        addToCanvas(image);
                    },
                    {
                        crossOrigin: "anonymous",
                    },
                );
            },
            canUndo,
            canRedo,
            canvasHistory,
            selectedObjects,
            canvas,
        };
    };


    const editor = ref();

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

        const initialWorkspace = markRaw(new fabric.Rect({
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
        }));

        initialCanvas.setWidth(initialContainer.offsetWidth);
        initialCanvas.setHeight(initialContainer.offsetHeight);

        initialCanvas.add(initialWorkspace);
        initialCanvas.centerObject(initialWorkspace);
        initialCanvas.clipPath = initialWorkspace;

        canvas = initialCanvas;
        container.value = initialContainer;

        observe({
            canvas: canvas,
            container: container.value,
        });

        editor.value = buildEditor({
            canvas,
            fillColor,
            strokeWidth,
            strokeColor,
        });

        setHistoryCanvas(canvas);

        setEvents(canvas);
        setClipboardCanvas(canvas);

        useHotkeys({
            undo,
            redo,
            copy,
            paste,
            save,
            canvas,
        });

    }

    return {
        init,
        editor,
    }
}