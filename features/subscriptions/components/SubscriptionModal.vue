<script setup lang="ts">
import { CheckCircle2 } from "lucide-vue-next";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSubscriptionModal } from "@/features/subscriptions/store/useSubscriptionModal";
import { useCheckout } from "@/features/subscriptions/api/useCheckout";

const { onClose } = useSubscriptionModal();
const { isOpen } = storeToRefs(useSubscriptionModal());

const { checkout, isPending } = useCheckout();
</script>

<template>
  <Dialog v-model:open="isOpen" @updateOpen="onClose()">
    <DialogContent>
      <DialogHeader class="flex items-center space-y-4">
        <NuxtImg src="/logo.svg" alt="Logo" :width="36" :height="36" />

        <DialogTitle class="text-center"> Upgrade to a paid plan </DialogTitle>
        <DialogDescription class="text-center">
          Upgrade to a paid plan to unlock more features
        </DialogDescription>
      </DialogHeader>
      <Separator />
      <ul class="space-y-2">
        <li class="flex items-center">
          <CheckCircle2 class="size-5 mr-2 fill-blue-500 text-white" />
          <p class="text-sm text-muted-foreground">Unlimited projects</p>
        </li>
        <li class="flex items-center">
          <CheckCircle2 class="size-5 mr-2 fill-blue-500 text-white" />
          <p class="text-sm text-muted-foreground">Unlimited templates</p>
        </li>
        <li class="flex items-center">
          <CheckCircle2 class="size-5 mr-2 fill-blue-500 text-white" />
          <p class="text-sm text-muted-foreground">AI Background removal</p>
        </li>
        <li class="flex items-center">
          <CheckCircle2 class="size-5 mr-2 fill-blue-500 text-white" />
          <p class="text-sm text-muted-foreground">AI Image generation</p>
        </li>
      </ul>
      <DialogFooter class="pt-2 mt-4 gap-y-2">
        <Button @click="checkout()" :disabled="isPending" class="w-full">
          {{ isPending ? "Wait..." : "Upgrade" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
