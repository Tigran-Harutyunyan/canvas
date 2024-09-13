<script setup lang="ts">
import { cn } from "@/lib/utils";

interface ShapeToolProps {
  iconclass?: string;
}

const props = defineProps<ShapeToolProps>();

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <button @click="emit('click')" class="aspect-square border rounded-md p-5">
    <div :class="cn('h-full w-full shape-tool-icon-wrapper', props.iconclass)">
      <slot />
    </div>
  </button>
</template>
