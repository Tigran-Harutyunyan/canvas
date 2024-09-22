<script setup lang="ts">
import { Loader, TriangleAlert } from "lucide-vue-next";
import TemplateCard from "./TemplateCard.vue";
import { usePayWall } from "@/features/subscriptions/composables/usePayWall";
import { useCreateProject } from "@/features/projects/api/useCreateProject";
import {
  useGetTemplates,
  type ResponseType,
} from "@/features/projects/api/useGetTemplates";

const { data, isError, isPending, getTemplates } = useGetTemplates();

const { response, createProject } = useCreateProject();

const router = useRouter();

const { shouldBlock, triggerPaywall } = await usePayWall();

const onClick = async (template: ResponseType) => {
  if (template.isPro && shouldBlock.value) {
    triggerPaywall();
    return;
  }

  await createProject({
    name: `${template.name} project`,
    json: template.json,
    width: template.width,
    height: template.height,
  });

  const projectId = response?.value?.id;

  if (projectId) {
    router.push(`/editor/${projectId}`);
  }
};

onBeforeMount(() => {
  getTemplates();
});
</script>

<template>
  <div v-if="isPending" class="space-y-4">
    <h3 class="font-semibold text-lg">Start from a template</h3>
    <div class="flex items-center justify-center h-32">
      <Loader class="size-6 text-muted-foreground animate-spin" />
    </div>
  </div>

  <div v-if="isError && !isPending" class="space-y-4">
    <h3 class="font-semibold text-lg">Start from a template</h3>
    <div class="flex flex-col gap-y-4 items-center justify-center h-32">
      <TriangleAlert class="size-6 text-muted-foreground" />
      <p>Failed to load templates</p>
    </div>
  </div>

  <div v-if="data?.length && !isError && !isPending">
    <h3 class="font-semibold text-lg">Start from a template</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 mt-4 gap-4">
      <TemplateCard
        v-for="template in data"
        :key="template.id"
        :title="template.name"
        :imageSrc="template.thumbnailUrl || ''"
        @onClick="onClick(template)"
        :disabled="isPending"
        :description="`${template.width} x ${template.height} px`"
        :width="template.width"
        :height="template.height"
        :isPro="template.isPro"
      />
    </div>
  </div>
</template>
