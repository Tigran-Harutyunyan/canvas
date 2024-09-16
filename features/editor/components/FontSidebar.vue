<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { type ActiveTool, type Editor, fonts } from "@/features/editor/types";

import ToolSidebarClose from "@/features/editor/components/ToolSidebarClose.vue";
import ToolSidebarHeader from "@/features/editor/components/ToolSidebarHeader.vue";
import { cn } from "@/lib/utils";

interface FontSidebar {
  editor: Editor | undefined;
}

const props = defineProps<FontSidebar>();

const emit = defineEmits<{
  (e: "onChangeActiveTool", tool: ActiveTool): void;
}>();

const onClose = () => {
  emit("onChangeActiveTool", "select");
};

const activeFont = ref(props.editor?.getActiveFontFamily());

const changeFont = (font: string) => {
  props.editor?.changeFontFamily(font);
  activeFont.value = font;
};

watch(
  () => props.editor?.selectedObjects,
  () => {
    activeFont.value = props.editor?.getActiveFontFamily();
  }
);
</script>

<template>
  <aside
    class="bg-white relative border-r z-[40] w-[360px] h-full flex flex-col visible"
  >
    <ToolSidebarHeader title="Font" description="Change the text font" />
    <ScrollArea>
      <div class="p-4 space-y-1 border-b">
        <Button
          :key="index"
          v-for="(font, index) in fonts"
          variant="secondary"
          size="lg"
          :class="
            cn(
              'w-full h-16 justify-start text-left',
              activeFont === font && 'border-2 border-blue-500'
            )
          "
          :style="{
            fontFamily: font,
            fontSize: '16px',
            padding: '8px 16px',
          }"
          @click="changeFont(font)"
        >
          {{ font }}
        </Button>
      </div>
    </ScrollArea>
    <ToolSidebarClose @onClick="onClose" />
  </aside>
</template>
