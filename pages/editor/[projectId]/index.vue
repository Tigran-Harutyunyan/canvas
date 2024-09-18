<script lang="ts" setup>
import { Loader, TriangleAlert } from "lucide-vue-next";
import { useGetProject } from "@/features/projects/api/useGetProject";
import Editor from "@/features/editor/components/Editor.vue";
import { Button } from "@/components/ui/button";

const params = useRoute().params;

const { data, isLoading, isError } = await useGetProject(
  params?.projectId as string
);
</script>

<template>
  <ClientOnly>
    <div
      v-if="isLoading"
      class="h-full flex flex-col items-center justify-center"
    >
      <Loader class="size-6 animate-spin text-muted-foreground" />
    </div>
    <div
      v-if="isError"
      class="h-full flex flex-col gap-y-5 items-center justify-center"
    >
      <TriangleAlert class="size-6 text-muted-foreground" />
      <p class="text-muted-foreground text-sm">Failed to fetch project</p>
      <Button as-child variant="secondary">
        <NuxtLink to="/"> Back to Home </NuxtLink>
      </Button>
    </div>
    <Editor v-if="!isError && !isLoading && data" :initialData="data" />
  </ClientOnly>
</template>
