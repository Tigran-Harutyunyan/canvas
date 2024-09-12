<script lang="ts" setup>
import { fabric } from "fabric";
import { ref, onMounted } from "vue";
import { useEditor } from "@/features/editor/composables/useEditor";

interface EditorProjectIdPageProps {
  params: {
    projectId: string;
  };
}

const canvasRef = ref(null);
const containerRef = ref(null);

const { init } = useEditor();

let canvas = ref();

onMounted(() => {
  if (canvasRef.value && containerRef.value) {
    canvas.value = new fabric.Canvas(canvasRef.value, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas.value,
      initialContainer: containerRef.value,
    });
  }
});
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
      <main class="bg-muted flex-1 overflow-auto relative flex flex-col">
        <div class="flex-1 h-[calc(100%-124px)] bg-muted" ref="containerRef">
          <canvas ref="canvasRef" />
        </div>
      </main>
    </div>
  </div>
</template>
