<script lang="ts" setup>
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface HintProps {
  label: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
}

defineProps<HintProps>();
</script>

<template>
  <TooltipProvider>
    <Tooltip :delayDuration="100">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipContent
        class="text-white bg-slate-800 border-slate-800"
        :side="side"
        :align="align"
        :sideOffset="sideOffset"
        :alignOffset="alignOffset"
      >
        <p class="font-semibold capitalize">
          {{ label }}
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
