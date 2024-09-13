<script lang="ts" setup>
import { fabric } from "fabric";
import { ref, onMounted, onUnmounted } from "vue";
import { useEditor } from "@/features/editor/composables/useEditor";
import Navbar from "./Navbar.vue";
import Sidebar from "./Sidebar.vue";
import ShapeSidebar from "./ShapeSidebar.vue";
import SettingsSidebar from "./SettingsSidebar.vue";
import Toolbar from "./Toolbar.vue";
import Footer from "./Footer.vue";
import type { ActiveTool, Editor } from "@/features/editor/types";
//import { type ResponseType } from "@/features/projects/api/use-get-project";

interface EditorProps {
  // initialData: ResponseType["data"];
  initialData: ResponseType["default"];
}

const props = defineProps<EditorProps>();

const canvasRef = ref(null);
const containerRef = ref(null);

const activeTool = ref<ActiveTool>("select");

const { init, editor } = useEditor({
  defaultState: props.initialData?.json,
  defaultWidth: props.initialData?.width,
  defaultHeight: props.initialData?.height,
  // clearSelectionCallback: onClearSelection,
  // saveCallback: debouncedSave,
});

let canvas: fabric.Canvas | null = null;

const onChangeActiveTool = (tool: ActiveTool) => {
  if (tool === "draw") {
    // editor?.enableDrawingMode();
  }

  if (activeTool.value === "draw") {
    // editor?.disableDrawingMode();
  }

  if (tool === activeTool.value) {
    return (activeTool.value = "select");
  }

  activeTool.value = tool;
};

onMounted(() => {
  if (canvasRef.value && containerRef.value) {
    canvas = new fabric.Canvas(canvasRef.value, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.value,
    });
  }
});

onUnmounted(() => {
  if (canvas) {
    canvas?.dispose();
  }
});
</script>

<template>
  <div class="h-full flex flex-col">
    <Navbar :activeTool="activeTool" @onChangeActiveTool="onChangeActiveTool" />
    <div class="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
      <Sidebar
        :activeTool="activeTool"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <ShapeSidebar
        :activeTool="activeTool"
        :editor="editor"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <SettingsSidebar
        :activeTool="activeTool"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <main class="bg-muted flex-1 overflow-auto relative flex flex-col">
        <Toolbar
          :activeTool="activeTool"
          @onChangeActiveTool="onChangeActiveTool"
        />
        <div class="flex-1 h-[calc(100%-124px)] bg-muted" ref="containerRef">
          <canvas ref="canvasRef" />
        </div>
        <Footer />
      </main>
    </div>
  </div>
</template>
