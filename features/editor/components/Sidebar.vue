<script setup lang="ts">
import {
  LayoutTemplate,
  ImageIcon,
  Pencil,
  Settings,
  Shapes,
  Sparkles,
  Type,
} from "lucide-vue-next";

import { type ActiveTool, TOOLS } from "@/features/editor/types";
import SidebarItem from "@/features/editor/components/SidebarItem.vue";

interface SidebarProps {
  activeTool: ActiveTool;
}

defineProps<SidebarProps>();

const emit = defineEmits<{
  (e: "onChangeActiveTool", tool: ActiveTool): void;
}>();

const handleClick = (activeTool: ActiveTool) => {
  emit("onChangeActiveTool", activeTool);
};
</script>
<template>
  <aside
    class="bg-white flex flex-col w-[100px] h-full border-r overflow-y-auto"
  >
    <ul class="flex flex-col">
      <SidebarItem
        label="Design"
        :isActive="activeTool === TOOLS.TEMPLATES"
        @click="handleClick(TOOLS.TEMPLATES)"
      >
        <template #icon>
          <LayoutTemplate />
        </template>
      </SidebarItem>

      <SidebarItem
        label="Image"
        :isActive="activeTool === TOOLS.IMAGES"
        @click="handleClick(TOOLS.IMAGES)"
      >
        <template #icon>
          <ImageIcon />
        </template>
      </SidebarItem>

      <SidebarItem
        label="Text"
        :isActive="activeTool === TOOLS.TEXT"
        @click="handleClick(TOOLS.TEXT)"
      >
        <template #icon>
          <Type />
        </template>
      </SidebarItem>

      <SidebarItem
        label="Shapes"
        :isActive="activeTool === TOOLS.SHAPES"
        @click="handleClick(TOOLS.SHAPES)"
      >
        <template #icon>
          <Shapes />
        </template>
      </SidebarItem>

      <SidebarItem
        label="Draw"
        :isActive="activeTool === TOOLS.DRAW"
        @click="handleClick(TOOLS.DRAW)"
      >
        <template #icon>
          <Pencil />
        </template>
      </SidebarItem>

      <SidebarItem
        label="AI"
        :isActive="activeTool === TOOLS.AI"
        @click="handleClick(TOOLS.AI)"
      >
        <template #icon>
          <Sparkles />
        </template>
      </SidebarItem>

      <SidebarItem
        label="Settings"
        :isActive="activeTool === TOOLS.SETTINGS"
        @click="handleClick(TOOLS.SETTINGS)"
      >
        <template #icon>
          <Settings />
        </template>
      </SidebarItem>
    </ul>
  </aside>
</template>
