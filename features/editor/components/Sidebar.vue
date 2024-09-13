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

import { type ActiveTool } from "@/features/editor/types";
import SidebarItem from "@/features/editor/components/SidebarItem.vue";

interface SidebarProps {
  activeTool: ActiveTool;
}

const props = defineProps<SidebarProps>();

const emit = defineEmits<{
  (e: "onChangeActiveTool", tool: ActiveTool): void;
}>();
</script>
<template>
  <aside
    class="bg-white flex flex-col w-[100px] h-full border-r overflow-y-auto"
  >
    <ul class="flex flex-col">
      <SidebarItem
        label="Design"
        :isActive="props.activeTool === 'templates'"
        @click="emit('onChangeActiveTool', 'templates')"
      >
        <template #icon>
          <LayoutTemplate />
        </template>
      </SidebarItem>

      <SidebarItem
        label="Image"
        :isActive="props.activeTool === 'images'"
        @click="emit('onChangeActiveTool', 'images')"
      >
        <template #icon>
          <ImageIcon />
        </template>
      </SidebarItem>

      <SidebarItem
        label="Text"
        :isActive="props.activeTool === 'text'"
        @click="emit('onChangeActiveTool', 'text')"
      >
        <template #icon>
          <Type />
        </template>
      </SidebarItem>

      <SidebarItem
        label="Shapes"
        :isActive="props.activeTool === 'shapes'"
        @click="emit('onChangeActiveTool', 'shapes')"
      >
        <template #icon>
          <Shapes />
        </template>
      </SidebarItem>

      <SidebarItem
        label="Draw"
        :isActive="props.activeTool === 'draw'"
        @click="emit('onChangeActiveTool', 'draw')"
      >
        <template #icon>
          <Pencil />
        </template>
      </SidebarItem>

      <SidebarItem
        label="AI"
        :isActive="props.activeTool === 'ai'"
        @click="emit('onChangeActiveTool', 'ai')"
      >
        <template #icon>
          <Sparkles />
        </template>
      </SidebarItem>

      <SidebarItem
        label="Settings"
        :isActive="props.activeTool === 'settings'"
        @click="emit('onChangeActiveTool', 'settings')"
      >
        <template #icon>
          <Settings />
        </template>
      </SidebarItem>
    </ul>
  </aside>
</template>
