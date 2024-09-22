<script setup lang="ts">
import { ArrowRight, Sparkles } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/features/projects/api/useCreateProject";
const { response, createProject } = useCreateProject();
const router = useRouter();

const onClick = async () => {
  await createProject({
    name: "Untitled project",
    json: "",
    width: 900,
    height: 1200,
  });

  const projectId = response?.value?.id;

  if (projectId) {
    router.push(`/editor/${projectId}`);
  }
};
</script>

<template>
  <div
    class="text-white aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl bg-gradient-to-r from-[#2e62cb] via-[#0073ff] to-[#3faff5]"
  >
    <div
      class="rounded-full size-28 items-center justify-center bg-white/50 hidden md:flex"
    >
      <div
        class="rounded-full size-20 flex items-center justify-center bg-white"
      >
        <Sparkles class="h-20 text-[#0073ff] fill-[#0073ff]" />
      </div>
    </div>
    <div class="flex flex-col gap-y-2">
      <h1 class="text-xl md:text-3xl font-semibold">
        Visualize your ideas with Image AI
      </h1>
      <p class="text-xs md:text-sm mb-2">
        Turn inspiration into design in no time. Simply upload an image and let
        AI do the rest.
      </p>
      <Button @click="onClick" variant="secondary" class="w-[160px]">
        Start creating
        <ArrowRight class="size-4 ml-2" />
      </Button>
    </div>
  </div>
</template>
