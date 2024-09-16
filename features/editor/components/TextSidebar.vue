<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { type ActiveTool, type Editor } from "@/features/editor/types";

import ToolSidebarClose from "@/features/editor/components/ToolSidebarClose.vue";
import ToolSidebarHeader from "@/features/editor/components/ToolSidebarHeader.vue";

interface TextSidebarProps {
  editor: Editor | undefined;
}

const props = defineProps<TextSidebarProps>();

const emit = defineEmits<{
  (e: "onChangeActiveTool", tool: ActiveTool): void;
}>();

const onClose = () => {
  emit("onChangeActiveTool", "select");
};
</script>

<template>
  <aside
    class="bg-white relative border-r z-[40] w-[360px] h-full flex flex-col visible"
  >
    <ToolSidebarHeader title="Text" description="Add text to your canvas" />
    <ScrollArea>
      <div class="p-4 space-y-4 border-b">
        <Button class="w-full" @click="editor?.addText('Textbox')">
          Add a textbox
        </Button>
        <Button
          class="w-full h-16"
          variant="secondary"
          size="lg"
          @click="
            editor?.addText('Heading', {
              fontSize: 80,
              fontWeight: 700,
            })
          "
        >
          <span class="text-3xl font-bold"> Add a heading </span>
        </Button>
        <Button
          class="w-full h-16"
          variant="secondary"
          size="lg"
          @click="
            editor?.addText('Subheading', {
              fontSize: 44,
              fontWeight: 600,
            })
          "
        >
          <span class="text-xl font-semibold"> Add a subheading </span>
        </Button>
        <Button
          class="w-full h-16"
          variant="secondary"
          size="lg"
          @click="
            editor?.addText('Paragraph', {
              fontSize: 32,
            })
          "
        >
          Paragraph
        </Button>
      </div>
    </ScrollArea>
    <ToolSidebarClose @onClick="onClose" />
  </aside>
</template>
