<script setup lang="ts">
import { Minimize, ZoomIn, ZoomOut } from "lucide-vue-next";

import { type Editor } from "@/features/editor/types";

import Hint from "@/components/Hint.vue";
import { Button } from "@/components/ui/button";

interface FooterProps {
  editor: Editor | undefined;
}

defineProps<FooterProps>();
</script>
<template>
  <footer
    class="h-[52px] border-t bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-1 shrink-0 px-4 flex-row-reverse"
  >
    <Hint label="Reset" side="top" :sideOffset="10">
      <Button
        @click="editor?.autoZoom()"
        size="icon"
        variant="ghost"
        class="h-full"
      >
        <Minimize class="size-4" />
      </Button>
    </Hint>
    <Hint label="Zoom in" side="top" :sideOffset="10">
      <Button
        @click="editor?.zoomIn()"
        size="icon"
        variant="ghost"
        class="h-full"
      >
        <ZoomIn class="size-4" />
      </Button>
    </Hint>
    <Hint label="Zoom out" side="top" :sideOffset="10">
      <Button
        @click="editor?.zoomOut()"
        size="icon"
        variant="ghost"
        class="h-full"
      >
        <ZoomOut class="size-4" />
      </Button>
    </Hint>
  </footer>
</template>
