<script setup lang="ts">
import { ChevronsLeft } from "lucide-vue-next";

const emit = defineEmits<{
  (e: "onClick"): void;
}>();
</script>

<template>
  <button
    @click="emit('onClick')"
    class="absolute -right-[1.80rem] h-[70px] bg-white top-1/2 transform -translate-y-1/2 flex items-center justify-center rounded-r-xl px-1 pr-2 border-r border-y group"
  >
    <ChevronsLeft class="size-4 text-black group-hover:opacity-75 transition" />
  </button>
</template>
