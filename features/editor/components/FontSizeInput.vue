<script setup lang="ts">
import { Minus, Plus } from "lucide-vue-next";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { type Editor } from "@/features/editor/types";

interface FontSizeInputProps {
  editor: Editor | undefined;
  value: number;
}

const props = defineProps<FontSizeInputProps>();

const emit = defineEmits<{
  (e: "onChange", value: number): void;
}>();

const increment = () => emit("onChange", fontSize.value++);
const decrement = () => emit("onChange", fontSize.value--);

const fontSize = ref();

const handleChange = (event: Event) => {
  const inputValue = (event.target as HTMLInputElement).value;
  emit("onChange", Number(inputValue));
};

onMounted(() => {
  fontSize.value = Number(props.value);
});

watch(
  () => props.editor?.selectedObjects,
  () => {
    fontSize.value = Number(props.value);
  }
);
</script>

<template>
  <div class="flex items-center">
    <Button
      @click="decrement"
      variant="outline"
      class="p-2 rounded-r-none border-r-0"
      size="icon"
    >
      <Minus class="size-4" />
    </Button>
    <Input
      v-model="fontSize"
      @input="handleChange"
      class="w-[50px] h-8 focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none"
    />
    <Button
      @click="increment"
      variant="outline"
      class="p-2 rounded-l-none border-l-0"
      size="icon"
    >
      <Plus class="size-4" />
    </Button>
  </div>
</template>
