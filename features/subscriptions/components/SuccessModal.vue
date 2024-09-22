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

import { useSuccessModal } from "@/features/subscriptions/store/useSuccessModal";

const { isOpen } = storeToRefs(useSuccessModal());
const { onClose } = useSuccessModal();

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
        <DialogTitle class="text-center">
          Subscription successfull!
        </DialogTitle>
        <DialogDescription class="text-center">
          You have successfully subscribed to our service
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="pt-2 mt-4 gap-y-2">
        <Button @click="handleClose" class="w-full"> Continue </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
