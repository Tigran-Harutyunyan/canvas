<script lang="ts" setup>
import { fabric } from "fabric";
import { ref, onMounted, onUnmounted } from "vue";
import { useEditor } from "@/features/editor/composables/useEditor";
import Navbar from "./Navbar.vue";
import Sidebar from "./Sidebar.vue";
import ShapeSidebar from "./ShapeSidebar.vue";
import SettingsSidebar from "./SettingsSidebar.vue";
import FillColorSidebar from "./FillColorSidebar.vue";
import StrokeColorSidebar from "./StrokeColorSidebar.vue";
import StrokeWidthSidebar from "./StrokeWidthSidebar.vue";
import OpacitySidebar from "./OpacitySidebar.vue";
import TextSidebar from "./TextSidebar.vue";
import FontSidebar from "./FontSidebar.vue";
import DrawSidebar from "./DrawSidebar.vue";
import FilterSidebar from "./FilterSidebar.vue";
import ImageSidebar from "./ImageSidebar.vue";
import TemplateSidebar from "./TemplateSidebar.vue";
import Toolbar from "./Toolbar.vue";
import Footer from "./Footer.vue";
import {
  type ActiveTool,
  type Editor,
  activeToolValues,
} from "@/features/editor/types";
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
  if (tool === activeToolValues.DRAW) {
    editor.value?.enableDrawingMode();
  }

  if (activeTool.value === activeToolValues.DRAW) {
    editor.value?.disableDrawingMode();
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
    <Navbar
      :activeTool="activeTool"
      :editor="editor"
      @onChangeActiveTool="onChangeActiveTool"
    />
    <div class="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
      <Sidebar
        :activeTool="activeTool"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <TemplateSidebar
        v-if="activeTool === activeToolValues.TEMPLATES"
        :editor="editor"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <ShapeSidebar
        v-if="activeTool === activeToolValues.SHAPES"
        :editor="editor"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <FillColorSidebar
        v-if="activeTool === activeToolValues.FILL"
        :editor="editor"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <StrokeColorSidebar
        v-if="activeTool === activeToolValues.STROKE_COLOR"
        :editor="editor"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <StrokeWidthSidebar
        v-if="activeTool === activeToolValues.STROKE_WIDTH"
        :editor="editor"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <OpacitySidebar
        v-if="activeTool === activeToolValues.OPACITY"
        :editor="editor"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <TextSidebar
        v-if="activeTool === activeToolValues.TEXT"
        :editor="editor"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <FontSidebar
        v-if="activeTool === activeToolValues.FONT"
        :editor="editor"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <DrawSidebar
        v-if="activeTool === activeToolValues.DRAW"
        :editor="editor"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <FilterSidebar
        v-if="activeTool === activeToolValues.FILTER"
        :editor="editor"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <ImageSidebar
        v-show="activeTool === activeToolValues.IMAGES"
        :editor="editor"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <SettingsSidebar
        v-if="activeTool === activeToolValues.SETTINGS"
        :editor="editor"
        @onChangeActiveTool="onChangeActiveTool"
      />
      <main class="bg-muted flex-1 overflow-auto relative flex flex-col">
        <Toolbar
          v-if="editor"
          :activeTool="activeTool"
          :editor="editor"
          @onChangeActiveTool="onChangeActiveTool"
        />
        <div class="flex-1 h-[calc(100%-124px)] bg-muted" ref="containerRef">
          <canvas ref="canvasRef" />
        </div>
        <Footer :editor="editor" />
      </main>
    </div>
  </div>
</template>
