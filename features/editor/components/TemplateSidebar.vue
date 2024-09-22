<script setup lang="ts">
import { AlertTriangle, Loader, Crown } from "lucide-vue-next";

import { type ActiveTool, type Editor } from "@/features/editor/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSidebarClose from "@/features/editor/components/ToolSidebarClose.vue";
import ToolSidebarHeader from "@/features/editor/components/ToolSidebarHeader.vue";
import {
  useGetTemplates,
  type ResponseType,
} from "@/features/projects/api/useGetTemplates";
import ConfirmDialog from "@/components/ConfirmDialog.vue";

const confirm = ref<InstanceType<typeof ConfirmDialog> | null>(null);

interface TemplateSidebarProps {
  editor: Editor | undefined;
}

const props = defineProps<TemplateSidebarProps>();

const { data, isPending, isError, getTemplates } = useGetTemplates();

const emit = defineEmits<{
  (e: "onChangeActiveTool", tool: ActiveTool): void;
}>();

const onClose = () => {
  emit("onChangeActiveTool", "select");
};

const onClick = async (template: ResponseType) => {
  //   if (template.isPro && shouldBlock) {
  //     triggerPaywall();
  //     return;
  //   }

  const userInput = await confirm.value?.openModal(
    "Are you sure?",
    "You are about to replace the current project with this template."
  );

  if (!userInput) return;

  props.editor?.loadJson(template.json);
};
onBeforeMount(() => {
  getTemplates();
});
</script>

<template>
  <aside
    class="bg-white relative border-r z-[40] w-[360px] h-full flex flex-col visible"
  >
    <ConfirmDialog ref="confirm" />
    <ToolSidebarHeader
      title="Templates"
      description="Choose from a variety of templates to get started"
    />

    <div v-if="isPending" class="flex items-center justify-center flex-1">
      <Loader class="size-4 text-muted-foreground animate-spin" />
    </div>

    <div
      v-if="isError && !isPending"
      class="flex flex-col gap-y-4 items-center justify-center flex-1"
    >
      <AlertTriangle class="size-4 text-muted-foreground" />
      <p class="text-muted-foreground text-xs">Failed to fetch templates</p>
    </div>

    <ScrollArea>
      <div class="p-4">
        <div class="grid grid-cols-2 gap-4">
          <button
            v-for="template in data"
            :key="template.id"
            :style="{
              aspectRatio: `${template.width}/${template.height}`,
            }"
            @click="onClick(template)"
            class="relative w-full group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
          >
            <NuxtImg
              fill
              :src="template.thumbnailUrl || ''"
              :alt="template.name || 'Template'"
              class="object-cover"
            />

            <div
              v-if="template.isPro"
              class="absolute top-2 right-2 size-8 items-center flex justify-center bg-black/50 rounded-full"
            >
              <Crown class="size-4 fill-yellow-500 text-yellow-500" />
            </div>

            <div
              class="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white p-1 bg-black/50 text-left"
            >
              {{ template.name }}
            </div>
          </button>
        </div>
      </div>
    </ScrollArea>
    <ToolSidebarClose @onClick="onClose" />
  </aside>
</template>
