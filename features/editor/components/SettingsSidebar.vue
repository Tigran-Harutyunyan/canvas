<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { ActiveTool, Editor } from "@/features/editor/types";
import ToolSidebarClose from "@/features/editor/components/ToolSidebarClose.vue";
import ToolSidebarHeader from "@/features/editor/components/ToolSidebarHeader.vue";
import ColorPicker from "@/features/editor/components/ColorPicker.vue";

interface SettingsSidebarProps {
  editor: Editor | undefined;
}

const props = defineProps<SettingsSidebarProps>();

const emit = defineEmits<{
  (e: "onChangeActiveTool", tool: ActiveTool): void;
}>();

const workspace = props.editor?.getWorkspace();

const initialWidth = `${workspace?.width ?? 0}`;
const initialHeight = `${workspace?.height ?? 0}`;
const initialBackground = workspace?.fill ?? "#ffffff";

const width = ref(initialWidth);
const height = ref(initialHeight);
const background = ref(initialBackground);

const changeBackground = (value: string) => {
  background.value = value;
  props.editor?.changeBackground(value);
};

const onSubmit = () => {
  props.editor?.changeSize({
    width: parseInt(width.value, 10),
    height: parseInt(height.value, 10),
  });
};

const onClose = () => {
  emit("onChangeActiveTool", "select");
};
</script>

<template>
  <aside
    class="bg-white relative border-r z-[40] w-[360px] h-full flex flex-col visible"
  >
    <ToolSidebarHeader
      title="Settings"
      description="Change the look of your workspace"
    />
    <ScrollArea>
      <form @submit.prevent="onSubmit" class="space-y-4 p-4">
        <div class="space-y-2">
          <Label> Height </Label>
          <Input placeholder="Height" v-model="height" type="number" />
        </div>
        <div class="space-y-2">
          <Label> Width </Label>
          <Input placeholder="Width" v-model="width" type="number" />
        </div>
        <Button type="submit" class="w-full"> Resize </Button>
      </form>
      <div class="p-4">
        <ColorPicker :value="background" @onChange="changeBackground" />
      </div>
    </ScrollArea>
    <ToolSidebarClose @onClick="onClose" />
  </aside>
</template>
