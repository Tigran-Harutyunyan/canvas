<script setup lang="ts">
interface ToolSidebarHeaderProps {
  title: string;
  description?: string;
}

defineProps<ToolSidebarHeaderProps>();
</script>

<template>
  <div class="p-4 border-b space-y-1 h-[68px]">
    <p class="text-sm font-medium">
      {{ title }}
    </p>

    <p v-if="description" class="text-xs text-muted-foreground">
      {{ description }}
    </p>
  </div>
</template>
