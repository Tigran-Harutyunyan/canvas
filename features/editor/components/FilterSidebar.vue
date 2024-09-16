<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type ActiveTool, type Editor, filters } from "@/features/editor/types";

import ToolSidebarClose from "@/features/editor/components/ToolSidebarClose.vue";
import ToolSidebarHeader from "@/features/editor/components/ToolSidebarHeader.vue";

interface FiltersSidebar {
  editor: Editor | undefined;
}

const props = defineProps<FiltersSidebar>();

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
    <ToolSidebarHeader
      title="Filters"
      description="Apply a filter to selected image"
    />
    <ScrollArea>
      <div class="p-4 space-y-1 border-b">
        <Button
          v-for="filter in filters"
          :key="filter"
          variant="secondary"
          size="lg"
          class="w-full h-16 justify-start text-left"
          @click="editor?.changeImageFilter(filter)"
        >
          {{ filter }}
        </Button>
      </div>
    </ScrollArea>
    <ToolSidebarClose @onClick="onClose" />
  </aside>
</template>
