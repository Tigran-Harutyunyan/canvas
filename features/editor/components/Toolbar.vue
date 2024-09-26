<script setup lang="ts">
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "vue3-icons/fa";
import { TbColorFilter } from "vue3-icons/tb";
import { BsBorderWidth } from "vue3-icons/bs";
import { RxTransparencyGrid } from "vue3-icons/rx";
import {
  ArrowUp,
  ArrowDown,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash,
  SquareSplitHorizontal,
  Copy,
} from "lucide-vue-next";

import { isTextType } from "@/features/editor/utils";
import FontSizeInput from "@/features/editor/components/FontSizeInput.vue";
import {
  type ActiveTool,
  type Editor,
  FONT_SIZE,
  FONT_WEIGHT,
  TOOLS,
  TEXT_ALIGNMENT,
} from "@/features/editor/types";
import { cn } from "@/lib/utils";
import Hint from "@/components/Hint.vue";
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
}

const props = defineProps<ToolbarProps>();

const emit = defineEmits<{
  (e: "onChangeActiveTool", tool: ActiveTool): void;
}>();

const properties = ref();

const selectedObject = computed(() => props.editor?.selectedObjects[0]);
const selectedObjectType = computed(
  () => props.editor?.selectedObjects[0]?.type
);

const isText = computed(() => isTextType(selectedObjectType.value));
const isImage = computed(() => selectedObjectType.value === "image");

const onChangeFontSize = (value: number) => {
  if (!selectedObject.value) {
    return;
  }

  props.editor?.changeFontSize(value);
  properties.value.fontSize = value;
};

const onChangeTextAlign = (value: string) => {
  if (!selectedObject.value) {
    return;
  }

  props.editor?.changeTextAlign(value);
  properties.value.textAlign = value;
};

const toggleBold = () => {
  if (!selectedObject.value) {
    return;
  }

  const newValue = properties.value.fontWeight > 500 ? 500 : 700;

  props.editor?.changeFontWeight(newValue);
  properties.value.fontWeight = newValue;
};

const toggleItalic = () => {
  if (!selectedObject.value) {
    return;
  }

  const isItalic = properties.value.fontStyle === "italic";
  const newValue = isItalic ? "normal" : "italic";

  props.editor?.changeFontStyle(newValue);

  properties.value.fontStyle = newValue;
};

const toggleLinethrough = () => {
  if (!selectedObject.value) {
    return;
  }

  const newValue = properties.value.fontLinethrough ? false : true;

  props.editor?.changeFontLinethrough(newValue);
  properties.value.fontLinethrough = newValue;
};

const toggleUnderline = () => {
  if (!selectedObject.value) {
    return;
  }

  const newValue = properties.value.fontUnderline ? false : true;
  props.editor?.changeFontUnderline(newValue);
  properties.value.fontUnderline = newValue;
};

const onChangeActiveTool = (tool: ActiveTool) => {
  emit("onChangeActiveTool", tool);
};

const updateValues = () => {
  properties.value = {
    fillColor: props.editor?.getActiveFillColor(),
    strokeColor: props.editor?.getActiveStrokeColor(),
    fontFamily: props.editor?.getActiveFontFamily(),
    fontWeight: props.editor?.getActiveFontWeight() || FONT_WEIGHT,
    fontStyle: props.editor?.getActiveFontStyle(),
    fontLinethrough: props.editor?.getActiveFontLinethrough(),
    fontUnderline: props.editor?.getActiveFontUnderline(),
    textAlign: props.editor?.getActiveTextAlign(),
    fontSize: props.editor?.getActiveFontSize() || FONT_SIZE,
  };
};
watch(
  () => props.editor?.selectedObjects,
  () => {
    updateValues();
  }
);

onMounted(() => {
  updateValues();
});
</script>

<template>
  <div
    v-if="editor?.selectedObjects.length === 0"
    class="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2"
  ></div>
  <div
    v-else
    class="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2"
  >
    <div v-if="!isImage" class="flex items-center h-full justify-center">
      <Hint label="Color" side="bottom" :sideOffset="5">
        <Button
          @click="onChangeActiveTool(TOOLS.FILL)"
          size="icon"
          variant="ghost"
          :class="cn(activeTool === TOOLS.FILL && 'bg-gray-100')"
        >
          <div
            class="rounded-sm size-4 border"
            :style="{ backgroundColor: properties.fillColor }"
          />
        </Button>
      </Hint>
    </div>

    <div v-if="!isText" class="flex items-center h-full justify-center">
      <Hint label="Stroke color" side="bottom" :sideOffset="5">
        <Button
          @click="onChangeActiveTool(TOOLS.STROKE_COLOR)"
          size="icon"
          variant="ghost"
          :class="cn(activeTool === TOOLS.STROKE_COLOR && 'bg-gray-100')"
        >
          <div
            class="rounded-sm size-4 border-2 bg-white"
            :style="{ borderColor: properties.strokeColor }"
          />
        </Button>
      </Hint>
    </div>

    <div v-if="!isText" class="flex items-center h-full justify-center">
      <Hint label="Stroke width" side="bottom" :sideOffset="5">
        <Button
          @click="onChangeActiveTool(TOOLS.STROKE_WIDTH)"
          size="icon"
          variant="ghost"
          :class="cn(activeTool === TOOLS.STROKE_WIDTH && 'bg-gray-100')"
        >
          <BsBorderWidth class="size-4" />
        </Button>
      </Hint>
    </div>

    <template v-if="isText">
      <div class="flex items-center h-full justify-center">
        <Hint label="Font" side="bottom" :sideOffset="5">
          <Button
            @click="onChangeActiveTool(TOOLS.FONT)"
            size="icon"
            variant="ghost"
            :class="
              cn(
                'w-auto px-2 text-sm',
                activeTool === TOOLS.FONT && 'bg-gray-100'
              )
            "
          >
            <div class="max-w-[100px] truncate">
              {{ properties.fontFamily }}
            </div>
            <ChevronDown class="size-4 ml-2 shrink-0" />
          </Button>
        </Hint>
      </div>

      <div class="flex items-center h-full justify-center">
        <Hint label="Bold" side="bottom" :sideOffset="5">
          <Button
            @click="toggleBold()"
            size="icon"
            variant="ghost"
            :class="cn(properties.fontWeight > 500 && 'bg-gray-100')"
          >
            <FaBold class="size-4" />
          </Button>
        </Hint>
      </div>

      <div class="flex items-center h-full justify-center">
        <Hint label="Italic" side="bottom" :sideOffset="5">
          <Button
            @click="toggleItalic()"
            size="icon"
            variant="ghost"
            :class="cn(properties.fontStyle === 'italic' && 'bg-gray-100')"
          >
            <FaItalic class="size-4" />
          </Button>
        </Hint>
      </div>
      <div class="flex items-center h-full justify-center">
        <Hint label="Underline" side="bottom" :sideOffset="5">
          <Button
            @click="toggleUnderline()"
            size="icon"
            variant="ghost"
            :class="cn(properties.fontUnderline && 'bg-gray-100')"
          >
            <FaUnderline class="size-4" />
          </Button>
        </Hint>
      </div>
      <div class="flex items-center h-full justify-center">
        <Hint label="Strike" side="bottom" :sideOffset="5">
          <Button
            @click="toggleLinethrough()"
            size="icon"
            variant="ghost"
            :class="cn(properties.fontLinethrough && 'bg-gray-100')"
          >
            <FaStrikethrough class="size-4" />
          </Button>
        </Hint>
      </div>
      <div class="flex items-center h-full justify-center">
        <Hint label="Align left" side="bottom" :sideOffset="5">
          <Button
            @click="onChangeTextAlign(TEXT_ALIGNMENT.LEFT)"
            size="icon"
            variant="ghost"
            :class="cn(properties.textAlign === 'bg-gray-100' && 'bg-gray-100')"
          >
            <AlignLeft class="size-4" />
          </Button>
        </Hint>
      </div>

      <div class="flex items-center h-full justify-center">
        <Hint label="Align center" side="bottom" :sideOffset="5">
          <Button
            @click="onChangeTextAlign(TEXT_ALIGNMENT.CENTER)"
            size="icon"
            variant="ghost"
            :class="
              cn(
                properties.textAlign === TEXT_ALIGNMENT.CENTER && 'bg-gray-100'
              )
            "
          >
            <AlignCenter class="size-4" />
          </Button>
        </Hint>
      </div>
      <div class="flex items-center h-full justify-center">
        <Hint label="Align right" side="bottom" :sideOffset="5">
          <Button
            @click="onChangeTextAlign(TEXT_ALIGNMENT.RIGHT)"
            size="icon"
            variant="ghost"
            :class="
              cn(properties.textAlign === TEXT_ALIGNMENT.RIGHT && 'bg-gray-100')
            "
          >
            <AlignRight class="size-4" />
          </Button>
        </Hint>
      </div>
      <div class="flex items-center h-full justify-center">
        <FontSizeInput
          :editor="editor"
          :value="properties.fontSize"
          @onChange="onChangeFontSize"
        />
      </div>
    </template>

    <div v-if="isImage" class="flex items-center h-full justify-center">
      <Hint label="Filters" side="bottom" :sideOffset="5">
        <Button
          @click="onChangeActiveTool(TOOLS.FILTER)"
          size="icon"
          variant="ghost"
          :class="cn(activeTool === TOOLS.FILTER && 'bg-gray-100')"
        >
          <TbColorFilter class="size-4" />
        </Button>
      </Hint>
    </div>

    <div v-if="isImage" class="flex items-center h-full justify-center">
      <Hint label="Remove background" side="bottom" :sideOffset="5">
        <Button
          @click="onChangeActiveTool(TOOLS.REMOVE_BG)"
          size="icon"
          variant="ghost"
          :class="cn(activeTool === TOOLS.REMOVE_BG && 'bg-gray-100')"
        >
          <SquareSplitHorizontal class="size-4" />
        </Button>
      </Hint>
    </div>

    <div class="flex items-center h-full justify-center">
      <Hint label="Bring forward" side="bottom" :sideOffset="5">
        <Button @click="editor?.bringForward()" size="icon" variant="ghost">
          <ArrowUp class="size-4" />
        </Button>
      </Hint>
    </div>
    <div class="flex items-center h-full justify-center">
      <Hint label="Send backwards" side="bottom" :sideOffset="5">
        <Button @click="editor?.sendBackwards()" size="icon" variant="ghost">
          <ArrowDown class="size-4" />
        </Button>
      </Hint>
    </div>
    <div class="flex items-center h-full justify-center">
      <Hint label="Opacity" side="bottom" :sideOffset="5">
        <Button
          @click="onChangeActiveTool(TOOLS.OPACITY)"
          size="icon"
          variant="ghost"
          :class="cn(activeTool === TOOLS.OPACITY && 'bg-gray-100')"
        >
          <RxTransparencyGrid class="size-4" />
        </Button>
      </Hint>
    </div>
    <div class="flex items-center h-full justify-center">
      <Hint label="Duplicate" side="bottom" :sideOffset="5">
        <Button
          @click="
            editor?.onCopy();
            editor?.onPaste();
          "
          size="icon"
          variant="ghost"
        >
          <Copy class="size-4" />
        </Button>
      </Hint>
    </div>
    <div class="flex items-center h-full justify-center">
      <Hint label="Delete" side="bottom" :sideOffset="5">
        <Button @click="editor?.delete()" size="icon" variant="ghost">
          <Trash class="size-4" />
        </Button>
      </Hint>
    </div>
  </div>
</template>
