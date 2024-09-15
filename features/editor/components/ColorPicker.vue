<script setup lang="ts">
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

interface ColorPickerProps {
  value: string;
}

const props = defineProps<ColorPickerProps>();
const emit = defineEmits<{
  (e: "onChange", value: string): void;
}>();

const onUpdatePureColor = (color: string) => {
  emit("onChange", color);
};
</script>

<template>
  <div class="w-full space-y-4">
    <ColorPicker
      :isWidget="true"
      :pureColor="props.value"
      pickerType="chrome"
      class="border rounded-lg"
      @update:pureColor="onUpdatePureColor"
    />
  </div>
</template>
