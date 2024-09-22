<script setup lang="ts">
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFailModal } from "@/features/subscriptions/store/useFailModal";

const { onClose } = useFailModal();
const { isOpen } = storeToRefs(useFailModal());

const router = useRouter();

const handleClose = () => {
  onClose();
  router.push("/");
};
</script>

<template>
  <Dialog v-model:open="isOpen" @updateOpen="onClose()">
    <DialogContent>
      <DialogHeader class="flex items-center space-y-4">
        <NuxtImg src="/logo.svg" alt="Logo" :width="36" :height="36" />
        <DialogTitle class="text-center"> Something went wrong </DialogTitle>
        <DialogDescription class="text-center">
          We could not process your payment
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="pt-2 mt-4 gap-y-2">
        <Button class="w-full" @click="handleClose"> Continue </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
