<script setup lang="ts">
import { Crown } from "lucide-vue-next";

import { cn } from "@/lib/utils";

interface TemplateCardProps {
  imageSrc: string;
  title: string;
  disabled?: boolean;
  description: string;
  width: number;
  height: number;
  isPro: boolean | null;
}
defineProps<TemplateCardProps>();

const emit = defineEmits<{
  (e: "onClick"): void;
}>();
</script>

<template>
  <button
    @click="emit('onClick')"
    :disabled="disabled"
    :class="
      cn(
        'space-y-2 group text-left transition flex flex-col',
        disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
      )
    "
  >
    <div
      :style="{ aspectRatio: `${width}/${height}` }"
      class="relative rounded-xl h-full w-full overflow-hidden border"
    >
      <NuxtImg
        fill
        :src="imageSrc"
        :alt="title"
        class="object-cover transition transform group-hover:scale-105"
      />

      <div
        v-if="isPro"
        class="absolute top-2 right-2 h-10 w-10 flex items-center justify-center bg-black/50 rounded-full -z[10]"
      >
        <Crown class="size-5 fill-yellow-500 text-yellow-500" />
      </div>

      <div
        class="opacity-0 group-hover:opacity-100 transition absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl backdrop-filter backdrop-blur-sm"
      >
        <p class="text-white font-medium">Open in editor</p>
      </div>
    </div>
    <div class="space-y-1">
      <p class="text-sm font-medium">
        {{ title }}
      </p>
      <p
        class="text-xs text-muted-foreground opacity-0 group-hover:opacity-75 transition"
      >
        {{ description }}
      </p>
    </div>
  </button>
</template>
