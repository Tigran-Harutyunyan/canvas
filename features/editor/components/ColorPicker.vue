<script setup lang="ts">
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import { colors } from "@/features/editor/types";

interface ColorPickerProps {
  value: string;
}

const pureColor = ref();

const props = defineProps<ColorPickerProps>();
const emit = defineEmits<{
  (e: "onChange", value: string): void;
}>();

const onUpdatePureColor = (color: string) => {
  emit("onChange", color);
};

const onChooseColor = (color: string) => {
  const hex_color = color.replace("#", ""),
    r = parseInt(hex_color.substring(0, 2), 16),
    g = parseInt(hex_color.substring(2, 4), 16),
    b = parseInt(hex_color.substring(4, 6), 16);
  const rgb = "rgb(" + r + "," + g + "," + b + ")";
  emit("onChange", rgb);
  pureColor.value = rgb;
};

watch(
  () => props.value,
  () => {
    pureColor.value = props.value;
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="w-full space-y-4">
    <ColorPicker
      :isWidget="true"
      :pureColor="pureColor"
      pickerType="chrome"
      class="border rounded-lg"
      @update:pureColor="onUpdatePureColor"
    />

    <ul class="flex flex-wrap gap-2 pr-5">
      <li
        v-for="color in colors"
        @click="onChooseColor(color)"
        class="w-6 h-6 rounded-full cursor-pointer"
        :style="{ backgroundColor: color }"
      ></li>
    </ul>
  </div>
</template>
