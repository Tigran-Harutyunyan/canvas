<script setup lang="ts">
import {
  type ActiveTool,
  type Editor,
  STROKE_COLOR,
} from "@/features/editor/types";
import ToolSidebarClose from "@/features/editor/components/ToolSidebarClose.vue";
import ToolSidebarHeader from "@/features/editor/components/ToolSidebarHeader.vue";
import ColorPicker from "@/features/editor/components/ColorPicker.vue";

import { ScrollArea } from "@/components/ui/scroll-area";

interface StrokeColorSidebarProps {
  editor: Editor | undefined;
}

const props = defineProps<StrokeColorSidebarProps>();

const emit = defineEmits<{
  (e: "onChangeActiveTool", tool: ActiveTool): void;
}>();

const onClose = () => {
  emit("onChangeActiveTool", "select");
};

const color = ref();
color.value = props.editor?.getActiveStrokeColor() || STROKE_COLOR;

const onChange = (value: string) => {
  props.editor?.changeStrokeColor(value);
};

watch(
  () => props.editor?.selectedObjects,
  () => {
    color.value = props.editor?.getActiveStrokeColor();
  }
);
</script>
<template>
  <aside
    class="bg-white relative border-r z-[40] w-[360px] h-full flex flex-col visible"
  >
    <ToolSidebarHeader
      title="Stroke color"
      description="Add stroke color to your element"
    />
    <ScrollArea>
      <div class="p-4 space-y-6">
        <ColorPicker :value="color" @onChange="onChange" />
      </div>
    </ScrollArea>
    <ToolSidebarClose @onClick="onClose" />
  </aside>
</template>
