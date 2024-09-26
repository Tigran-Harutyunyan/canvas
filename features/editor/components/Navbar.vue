<script setup lang="ts">
import {
  UserButton,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useClerk,
} from "vue-clerk";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Logo from "./Logo.vue";
import Hint from "@/components/Hint.vue";
import { CiFileOn } from "vue3-icons/ci";
import { BsCloudCheck, BsCloudSlash } from "vue3-icons/bs";
import type { ActiveTool, Editor } from "@/features/editor/types";
import { TOOLS } from "@/features/editor/types";
import {
  ChevronDown,
  Download,
  Loader,
  MousePointerClick,
  Redo2,
  Undo2,
} from "lucide-vue-next";
import { useFileDialog } from "@vueuse/core";

const { files, open, onChange } = useFileDialog({
  accept: ".json",
});

interface NavbarProps {
  id: string;
  editor: Editor | undefined;
  activeTool: ActiveTool;
  isPending: boolean;
  isError: boolean;
}

const props = defineProps<NavbarProps>();

const emit = defineEmits<{
  (e: "onChangeActiveTool", tool: ActiveTool): void;
}>();

const clerk = useClerk();

onChange((plainFiles) => {
  if (plainFiles && plainFiles.length > 0) {
    const file = plainFiles[0];
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = () => {
      props.editor?.loadJson(reader.result as string);
    };
  }
});
</script>
<template>
  <nav
    class="w-full flex items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px]"
  >
    <Logo />
    <div class="w-full flex items-center gap-x-1 h-full">
      <DropdownMenu :modal="false">
        <DropdownMenuTrigger as-child>
          <Button size="sm" variant="ghost">
            File
            <ChevronDown class="size-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" class="min-w-60">
          <DropdownMenuItem @click="open()" class="flex items-center gap-x-2">
            <CiFileOn class="size-8" />
            <div>
              <p>Open</p>
              <p class="text-xs text-muted-foreground">Open a JSON file</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator orientation="vertical" class="mx-2" />
      <Hint label="Select" side="bottom" :sideOffset="10">
        <Button
          variant="ghost"
          size="icon"
          :class="cn(props.activeTool === TOOLS.SELECT && 'bg-gray-100')"
          @click="emit('onChangeActiveTool', TOOLS.SELECT)"
        >
          <MousePointerClick class="size-4" />
        </Button>
      </Hint>
      <Hint label="Undo" side="bottom" :sideOffset="10">
        <Button
          variant="ghost"
          size="icon"
          :disabled="!editor?.canUndo"
          @click="editor?.onUndo()"
        >
          <Undo2 class="size-4" />
        </Button>
      </Hint>
      <Hint label="Redo" side="bottom" :sideOffset="10">
        <Button
          variant="ghost"
          size="icon"
          :disabled="!editor?.canRedo"
          @click="editor?.onRedo()"
        >
          <Redo2 class="size-4" />
        </Button>
      </Hint>
      <Separator orientation="vertical" class="mx-2" />

      <div v-if="isPending" class="flex items-center gap-x-2">
        <Loader class="size-4 animate-spin text-muted-foreground" />
        <div class="text-xs text-muted-foreground">Saving...</div>
      </div>

      <div v-if="!isPending && isError" class="flex items-center gap-x-2">
        <BsCloudSlash class="size-[20px] text-muted-foreground" />
        <div class="text-xs text-muted-foreground">Failed to save</div>
      </div>

      <div v-if="!isPending && !isError" class="flex items-center gap-x-2">
        <BsCloudCheck class="size-[20px] text-muted-foreground" />
        <div class="text-xs text-muted-foreground">Saved</div>
      </div>

      <div class="ml-auto flex items-center gap-x-4">
        <DropdownMenu :modal="false">
          <DropdownMenuTrigger as-child>
            <Button size="sm" variant="ghost">
              Export
              <Download class="size-4 ml-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="min-w-60">
            <DropdownMenuItem
              @click="editor?.saveJson()"
              class="flex items-center gap-x-2"
            >
              <CiFileOn class="size-8" />
              <div>
                <p>JSON</p>
                <p class="text-xs text-muted-foreground">
                  Save for later editing
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor?.savePng()"
              class="flex items-center gap-x-2"
            >
              <CiFileOn class="size-8" />
              <div>
                <p>PNG</p>
                <p class="text-xs text-muted-foreground">
                  Best for sharing on the web
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor?.saveJpg()"
              class="flex items-center gap-x-2"
            >
              <CiFileOn class="size-8" />
              <div>
                <p>JPG</p>
                <p class="text-xs text-muted-foreground">Best for printing</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor?.saveSvg()"
              class="flex items-center gap-x-2"
            >
              <CiFileOn class="size-8" />
              <div>
                <p>SVG</p>
                <p class="text-xs text-muted-foreground">
                  Best for editing in vector software
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserButton v-if="SignedIn" after-sign-out-url="/sign-in" />
        <SignedOut>
          <RedirectToSignIn redirect-url="/sign-in" />
        </SignedOut>
      </div>
    </div>
  </nav>
</template>
