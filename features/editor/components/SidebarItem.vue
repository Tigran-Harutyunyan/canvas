<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  label: string;
  isActive?: boolean;
}

const props = withDefaults(defineProps<SidebarItemProps>(), {
  isActive: false,
});

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>
<template>
  <Button
    variant="ghost"
    @click="emit('click')"
    :class="
      cn(
        'w-full h-full aspect-video p-3 py-4 flex flex-col rounded-none',
        isActive && 'bg-muted text-primary'
      )
    "
  >
    <div class="size-5 stroke-2 shrink-0">
      <slot name="icon" />
    </div>
    <span class="mt-2 text-xs"> {{ label }} </span>
  </Button>
</template>
