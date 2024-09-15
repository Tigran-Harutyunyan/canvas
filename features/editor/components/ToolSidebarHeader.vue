<script setup lang="ts">
interface ToolSidebarHeaderProps {
  title: string;
  description?: string;
}

const props = defineProps<ToolSidebarHeaderProps>();
</script>

<template>
  <div class="p-4 border-b space-y-1 h-[68px]">
    <p class="text-sm font-medium">
      {{ $props.title }}
    </p>

    <p v-if="props.description" class="text-xs text-muted-foreground">
      {{ props.description }}
    </p>
  </div>
</template>
