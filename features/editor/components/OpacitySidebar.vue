<script setup lang="ts">
import ToolSidebarClose from "@/features/editor/components/ToolSidebarClose.vue";
import ToolSidebarHeader from "@/features/editor/components/ToolSidebarHeader.vue";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";

import { type ActiveTool, type Editor } from "@/features/editor/types";

interface OpacitySidebarProps {
  editor: Editor | undefined;
}

const props = defineProps<OpacitySidebarProps>();

const emit = defineEmits<{
  (e: "onChangeActiveTool", tool: ActiveTool): void;
}>();

const initialValue = computed(() => props.editor?.getActiveOpacity() || 1);
const selectedObject = computed(() => props.editor?.selectedObjects[0]);

const opacity = ref();

const onChangeOpacity = (value: number) => {
  props.editor?.changeOpacity(value);
};

const onClose = () => {
  emit("onChangeActiveTool", "select");
};

onMounted(() => {
  opacity.value = [initialValue.value];
});

watch(
  () => props.editor?.selectedObjects,
  () => {
    if (selectedObject.value) {
      opacity.value = [selectedObject.value.get("opacity") || 1];
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <aside
    class="relative border-r z-[40] w-[360px] h-full flex flex-col visible"
  >
    <ToolSidebarHeader
      title="Opacity"
      description="Change the opacity of the selected object"
    />
    <ScrollArea>
      <div class="p-4 space-y-4 border-b">
        <Slider
          v-model="opacity"
          :max="1"
          :min="0"
          :step="0.01"
          @update:modelValue="onChangeOpacity"
        />
      </div>
    </ScrollArea>
    <ToolSidebarClose @onClick="onClose" />
  </aside>
</template>
