import { defineStore } from "pinia";

export const useSuccessModal = defineStore("success-modal", () => {
  const isOpen = ref(false);

  function onOpen() {
    isOpen.value = true;
  }

  function onClose() {
    isOpen.value = false;
  }

  return {
    isOpen,
    onOpen,
    onClose,
  };
});
