import { fabric } from "fabric";
interface UseAutoResizeProps {
    canvas: fabric.Canvas;
    container: HTMLDivElement;
}

export const useAutoResize = () => {
    let resizeObserver: ResizeObserver | null = null;

    let canvas: fabric.Canvas;
    let container: HTMLDivElement;

    const autoZoom = () => {

        if (!canvas && !container) return;

        if (!container.offsetWidth || !container.offsetHeight) return;

        const width = container.offsetWidth;
        const height = container.offsetHeight;

        if (width) canvas.setWidth(width);
        if (height) canvas.setHeight(height);

        const center = canvas.getCenter();

        const zoomRatio = 0.85;
        const localWorkspace = canvas
            .getObjects()
            .find((object) => object.name === "clip");

        // @ts-ignore
        const scale = fabric.util.findScaleToFit(localWorkspace, {
            width: width,
            height: height,
        });

        const zoom = zoomRatio * scale;

        canvas.setViewportTransform(fabric.iMatrix.concat());
        canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);

        if (!localWorkspace) return;

        const workspaceCenter = localWorkspace.getCenterPoint();
        const viewportTransform = canvas.viewportTransform;

        if (
            canvas.width === undefined ||
            canvas.height === undefined ||
            !viewportTransform
        ) {
            return;
        }

        viewportTransform[4] = canvas.width / 2 - workspaceCenter.x * viewportTransform[0];

        viewportTransform[5] = canvas.height / 2 - workspaceCenter.y * viewportTransform[3];

        canvas.setViewportTransform(viewportTransform);

        localWorkspace.clone((cloned: fabric.Rect) => {
            canvas.clipPath = cloned;
            canvas.requestRenderAll();
        });
    }


    const observe = ({ canvas: updatedCanvas, container: updatedContainer }: UseAutoResizeProps) => {
        canvas = updatedCanvas;
        container = updatedContainer;

        if (canvas && container) {
            if (resizeObserver) {
                resizeObserver.disconnect();
            }

            resizeObserver = new ResizeObserver(() => {
                autoZoom();
            });

            resizeObserver.observe(container);
        }
    };

    return {
        autoZoom,
        observe,
    }
}