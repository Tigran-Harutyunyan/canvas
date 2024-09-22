<script setup lang="ts">
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  label: string;
  href: string;
  isActive?: boolean;
}

defineProps<SidebarItemProps>();

const emit = defineEmits<{
  (e: "onClick"): void;
}>();
</script>

<template>
  <NuxtLink :to="href" @click="emit('onClick')">
    <div
      :class="
        cn(
          'flex items-center px-3 py-3 rounded-xl bg-transparent hover:bg-white transition',
          isActive && 'bg-white'
        )
      "
    >
      <div class="size-4 mr-4 stroke-2"><slot /></div>
      <span class="text-sm font-medium mt-2">
        {{ label }}
      </span>
    </div>
  </NuxtLink>
</template>
