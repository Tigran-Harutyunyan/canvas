<script setup lang="ts">
import { type ActiveTool, type Editor } from "@/features/editor/types";

import ToolSidebarClose from "@/features/editor/components/ToolSidebarClose.vue";
import ToolSidebarHeader from "@/features/editor/components/ToolSidebarHeader.vue";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

const prompt = ref();

const onSubmit = async () => {
  if (!prompt.value) return;

  isPending.value = true;

  const response = await $fetch("/api/generate-image", {
    method: "POST",
    body: {
      prompt: prompt.value,
    },
  });

  isPending.value = false;

  if (response && Array.isArray(response)) {
    props.editor?.addImage(response[0]);
  }
};
</script>
<template>
  <aside
    class="bg-white relative border-r z-[40] w-[360px] h-full flex flex-col visible"
  >
    <ToolSidebarHeader title="AI" description="Generate an image using AI" />
    <ScrollArea>
      <form @submit.prevent="onSubmit" class="p-4 space-y-6">
        <Textarea
          :disabled="isPending"
          placeholder="An astronaut riding a horse on mars, hd, dramatic lighting"
          :cols="30"
          :rows="10"
          required
          :minLength="3"
          v-model="prompt"
        />
        <Button :disabled="isPending" type="submit" class="w-full">
          Generate
        </Button>
      </form>
    </ScrollArea>
    <ToolSidebarClose @onClick="onClose" />
  </aside>
</template>
