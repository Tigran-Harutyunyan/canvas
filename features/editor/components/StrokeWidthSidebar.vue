<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";

import {
  type ActiveTool,
  type Editor,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
} from "@/features/editor/types";

import ToolSidebarClose from "@/features/editor/components/ToolSidebarClose.vue";
import ToolSidebarHeader from "@/features/editor/components/ToolSidebarHeader.vue";

interface StrokeWidthSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
}

const props = defineProps<StrokeWidthSidebarProps>();

const emit = defineEmits<{
  (e: "onChangeActiveTool", tool: ActiveTool): void;
}>();

const initialWidth = computed(() => [
  props.editor?.getActiveStrokeWidth() || STROKE_WIDTH,
]);

const initialType = computed(() => [
  props.editor?.getActiveStrokeDashArray() || STROKE_DASH_ARRAY,
]);

const widthValue = ref();

const typeValue = ref();

const onChangeStrokeWidth = (value: number[]) => {
  props.editor?.changeStrokeWidth(value[0]);
};

const onChangeStrokeType = (value: number[]) => {
  props.editor?.changeStrokeDashArray(value);
  typeValue.value = value;
};

const onClose = () => {
  emit("onChangeActiveTool", "select");
};
onMounted(() => {
  widthValue.value = initialWidth.value || STROKE_WIDTH;
});

watch(
  () => initialWidth.value,
  () => {
    widthValue.value = initialWidth.value;
  }
),
  {
    immediate: true,
  };

watch(
  () => initialType.value,
  () => {
    typeValue.value = initialType.value[0];
  }
),
  {
    immediate: true,
  };
</script>
<template>
  <aside
    class="bg-white relative border-r z-[40] w-[360px] h-full flex flex-col visible"
  >
    <ToolSidebarHeader
      title="Stroke options"
      description="Modify the stroke of your element"
    />
    <ScrollArea>
      <div class="p-4 space-y-4 border-b">
        <Label class="text-sm"> Stroke width </Label>
        <Slider v-model="widthValue" @update:modelValue="onChangeStrokeWidth" />
      </div>
      <div class="p-4 space-y-4 border-b">
        <Label class="text-sm"> Stroke type </Label>
        <Button
          @click="onChangeStrokeType([])"
          variant="secondary"
          size="lg"
          :class="
            cn(
              'w-full h-16 justify-start text-left',
              typeValue && typeValue.length === 0 && 'border-2 border-blue-500'
            )
          "
          :style="{
            padding: '8px 16px',
          }"
        >
          <div class="w-full border-black rounded-full border-4" />
        </Button>
        <Button
          @click="onChangeStrokeType([5, 5])"
          variant="secondary"
          size="lg"
          :class="
            cn(
              'w-full h-16 justify-start text-left',
              typeValue && typeValue.length === 2 && 'border-2 border-blue-500'
            )
          "
          :style="{
            padding: '8px 16px',
          }"
        >
          <div
            class="w-full border-black rounded-full border-4 border-dashed"
          />
        </Button>
      </div>
    </ScrollArea>
    <ToolSidebarClose :onClick="onClose" />
  </aside>
</template>
