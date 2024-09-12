<script lang="ts" setup>
import { fabric } from "fabric";
import { ref, onMounted, onUnmounted } from "vue";
import { useEditor } from "@/features/editor/composables/useEditor";
import Navbar from "./Navbar.vue";
import Sidebar from "./Sidebar.vue";
import Toolbar from "./Toolbar.vue";
import Footer from "./Footer.vue";

interface EditorProjectIdPageProps {
  params: {
    projectId: string;
  };
}

const canvasRef = ref(null);
const containerRef = ref(null);

const { init } = useEditor();

let canvas: fabric.Canvas | null = null;

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
    <Navbar />
    <div class="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
      <Sidebar />
      <main class="bg-muted flex-1 overflow-auto relative flex flex-col">
        <Toolbar />
        <div class="flex-1 h-[calc(100%-124px)] bg-muted" ref="containerRef">
          <canvas ref="canvasRef" />
        </div>
        <Footer />
      </main>
    </div>
  </div>
</template>
