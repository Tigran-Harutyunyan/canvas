<script setup lang="ts">
import { AlertTriangle, Loader } from "lucide-vue-next";
import { type ActiveTool, type Editor } from "@/features/editor/types";
import { cn } from "@/lib/utils";

import { useGetImages } from "@/features/images/api/useGetImages";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import ToolSidebarClose from "@/features/editor/components/ToolSidebarClose.vue";
import ToolSidebarHeader from "@/features/editor/components/ToolSidebarHeader.vue";

interface ImageSidebar {
  editor: Editor | undefined;
}

const props = defineProps<ImageSidebar>();

const fileInput = ref(null);

const isUploading = ref(false);

const { data, isLoading, isError } = useGetImages();

const uploadButtonText = computed(() =>
  isUploading.value ? "Uploading..." : "Upload Image"
);

const emit = defineEmits<{
  (e: "onChangeActiveTool", tool: ActiveTool): void;
}>();

const onClose = () => {
  emit("onChangeActiveTool", "select");
};

const { startUpload } = useUploadThing("imageUploader", {
  onClientUploadComplete(res) {
    props.editor?.addImage(res[0].url);
    isUploading.value = false;
  },
});
</script>

<template>
  <aside
    class="bg-white relative border-r z-[40] w-[360px] h-full flex flex-col visible"
  >
    <ToolSidebarHeader title="Images" description="Add images to your canvas" />
    <div class="p-4 border-b">
      <div
        @click="fileInput?.click()"
        class="flex flex-col items-center justify-center gap-1"
      >
        <button
          :disabled="isUploading"
          :class="
            cn(
              'relative flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-md text-white after:transition-[width] after:duration-500 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 bg-blue-600 w-full text-sm font-medium',
              isUploading === true && 'cursor-not-allowed'
            )
          "
        >
          <input
            accept="image/*"
            type="file"
            tabindex="0"
            class="hidden"
            ref="fileInput"
            @change="
              async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;
                // Do something with files
                // Then start the upload
                isUploading = true;
                await startUpload([file]);
              }
            "
          />
          {{ uploadButtonText }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center flex-1">
      <Loader class="size-4 text-muted-foreground animate-spin" />
    </div>

    <div
      v-if="isError"
      class="flex flex-col gap-y-4 items-center justify-center flex-1"
    >
      <AlertTriangle class="size-4 text-muted-foreground" />
      <p class="text-muted-foreground text-xs">Failed to fetch images</p>
    </div>

    <ScrollArea>
      <div class="p-4">
        <div class="grid grid-cols-2 gap-4" v-if="data && Array.isArray(data)">
          <button
            v-for="image in data"
            @click="editor?.addImage(image.urls.regular)"
            :key="image.id"
            class="relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
          >
            <NuxtImg
              fill
              :src="image.urls.small"
              :alt="image.alt_description || 'Image'"
              class="object-cover"
            />
            <NuxtLink
              target="_blank"
              :to="image.links.html"
              class="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 text-left"
            >
              {{ image.user.name }}
            </NuxtLink>
          </button>
        </div>
      </div>
    </ScrollArea>
    <ToolSidebarClose @onClick="onClose" />
  </aside>
</template>
