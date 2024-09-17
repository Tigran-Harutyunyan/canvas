<script setup lang="ts">
import { cn } from "@/lib/utils";
import { type ActiveTool, type Editor } from "@/features/editor/types";

import { AlertTriangle } from "lucide-vue-next";

import ToolSidebarClose from "@/features/editor/components/ToolSidebarClose.vue";
import ToolSidebarHeader from "@/features/editor/components/ToolSidebarHeader.vue";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FillColorSidebarProps {
  editor: Editor | undefined;
}

const props = defineProps<FillColorSidebarProps>();

const isPending = ref(false);

const emit = defineEmits<{
  (e: "onChangeActiveTool", tool: ActiveTool): void;
}>();

const onClose = () => {
  emit("onChangeActiveTool", "select");
};

const selectedObject = computed(() => props.editor?.selectedObjects[0]);

// @ts-ignore
const imageSrc = computed(
  () => selectedObject.value?._originalElement?.currentSrc
);

const onClick = async () => {
  if (!imageSrc.value) return;

  isPending.value = true;

  const response = await $fetch("/api/remove-bg", {
    method: "POST",
    body: {
      image: imageSrc.value,
    },
  });

  isPending.value = false;

  if (response) {
    props.editor?.addImage(response);
  }
};
</script>
<template>
  <aside
    class="bg-white relative border-r z-[40] w-[360px] h-full flex flex-col visible"
  >
    <ToolSidebarHeader title="AI" description="Generate an image using AI" />
    <div
      v-if="!imageSrc"
      class="flex flex-col gap-y-4 items-center justify-center flex-1"
    >
      <AlertTriangle class="size-4 text-muted-foreground" />
      <p class="text-muted-foreground text-xs">
        Feature not available for this object
      </p>
    </div>
    <ScrollArea v-if="imageSrc">
      <div class="p-4 space-y-4">
        <div
          :class="
            cn(
              'relative aspect-square rounded-md overflow-hidden transition bg-muted',
              isPending && 'opacity-50'
            )
          "
        >
          <NuxtImg :src="imageSrc" fill alt="Image" class="object-cover" />
        </div>
        <Button :disabled="isPending" @click="onClick" class="w-full">
          Remove background
        </Button>
      </div>
    </ScrollArea>
    <ToolSidebarClose @onClick="onClose" />
  </aside>
</template>
