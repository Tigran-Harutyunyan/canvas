<script setup lang="ts">
import { IoTriangle } from "vue3-icons/io5";
import { FaDiamond } from "vue3-icons/fa6";
import { FaCircle, FaSquare, FaSquareFull } from "vue3-icons/fa";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type ActiveTool, type Editor } from "@/features/editor/types";
import ShapeTool from "@/features/editor/components/ShapeTool.vue";
import ToolSidebarClose from "@/features/editor/components/ToolSidebarClose.vue";
import ToolSidebarHeader from "@/features/editor/components/ToolSidebarHeader.vue";

interface ShapeSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
}

const props = defineProps<ShapeSidebarProps>();

const emit = defineEmits<{
  (e: "onChangeActiveTool", tool: ActiveTool): void;
}>();

const onClose = () => {
  emit("onChangeActiveTool", "select");
};
</script>
<template>
  <aside
    :class="
      cn(
        'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
        props.activeTool === 'shapes' ? 'visible' : 'hidden'
      )
    "
  >
    <ToolSidebarHeader title="Shapes" description="Add shapes to your canvas" />
    <ScrollArea>
      <div class="grid grid-cols-3 gap-4 p-4">
        <ShapeTool @click="props.editor?.addCircle()">
          <FaCircle />
        </ShapeTool>

        <ShapeTool @click="props.editor?.addSoftRectangle()">
          <FaSquare />
        </ShapeTool>

        <ShapeTool @click="props.editor?.addRectangle()">
          <FaSquareFull />
        </ShapeTool>

        <ShapeTool @click="props.editor?.addTriangle()">
          <IoTriangle />
        </ShapeTool>

        <ShapeTool
          @click="props.editor?.addInverseTriangle()"
          iconclass="rotate-180"
        >
          <IoTriangle />
        </ShapeTool>

        <ShapeTool @click="props.editor?.addDiamond()" iconclass="rotate-180">
          <FaDiamond />
        </ShapeTool>
      </div>
    </ScrollArea>
    <ToolSidebarClose @onClick="onClose" />
  </aside>
</template>
