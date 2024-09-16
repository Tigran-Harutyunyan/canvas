<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  type ActiveTool,
  type Editor,
  STROKE_COLOR,
  STROKE_WIDTH,
} from "@/features/editor/types";
import ToolSidebarClose from "@/features/editor/components/ToolSidebarClose.vue";
import ToolSidebarHeader from "@/features/editor/components/ToolSidebarHeader.vue";
import ColorPicker from "@/features/editor/components/ColorPicker.vue";

interface DrawSidebarProps {
  editor: Editor | undefined;
}

const props = defineProps<DrawSidebarProps>();

const emit = defineEmits<{
  (e: "onChangeActiveTool", tool: ActiveTool): void;
}>();

const onClose = () => {
  props.editor?.disableDrawingMode();
  emit("onChangeActiveTool", "select");
};

const onColorChange = (value: string) => {
  props.editor?.changeStrokeColor(value);
};

const onWidthChange = (value: number) => {
  props.editor?.changeStrokeWidth(value);
};

const color = ref();
const width = ref();

watch(
  () => props.editor?.selectedObjects,
  () => {
    color.value = props.editor?.getActiveStrokeColor() || STROKE_COLOR;
    width.value = [props.editor?.getActiveStrokeWidth() || STROKE_WIDTH];
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <aside
    class="bg-white relative border-r z-[40] w-[360px] h-full flex flex-col visible"
  >
    <ToolSidebarHeader
      title="Drawing mode"
      description="Modify brush settings"
    />
    <ScrollArea>
      <div class="p-4 space-y-6 border-b">
        <Label class="text-sm"> Brush width </Label>
        <Slider v-model="width" @update:modelValue="onWidthChange" />
      </div>
      <div class="p-4 space-y-6">
        <ColorPicker :value="color" @onChange="onColorChange" />
      </div>
    </ScrollArea>
    <ToolSidebarClose @onClick="onClose" />
  </aside>
</template>
