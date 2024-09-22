<script setup lang="ts">
import {
  CreditCard,
  Crown,
  Home,
  MessageCircleQuestion,
} from "lucide-vue-next";

import { usePayWall } from "@/features/subscriptions/composables/usePayWall";
import { useCheckout } from "@/features/subscriptions/api/useCheckout";
import { useBilling } from "@/features/subscriptions/api/useBilling";

const { checkout, isPending } = useCheckout();

const billingMutation = useBilling();

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import SidebarItem from "./SidebarItem.vue";

const { shouldBlock, triggerPaywall } = await usePayWall();

const pathname = useRoute().path;
const isLoading = ref(false);

const onClick = () => {
  if (shouldBlock.value) {
    triggerPaywall();
    return;
  }

  billingMutation.mutate();
};
</script>

<template>
  <div class="flex flex-col gap-y-4 flex-1">
    <template v-if="shouldBlock && !isLoading">
      <div class="px-3">
        <Button
          :disabled="isPending"
          @click="checkout()"
          class="w-full rounded-xl border-none hover:bg-white hover:opacity-75 transition"
          variant="outline"
          size="lg"
        >
          <Crown class="mr-2 size-4 fill-yellow-500 text-yellow-500" />
          Upgrade to Image AI Pro
        </Button>
      </div>
      <div class="px-3">
        <Separator />
      </div>
    </template>
    <ul class="flex flex-col gap-y-1 px-3">
      <SidebarItem href="/" label="Home" :isActive="pathname === '/'">
        <Home />
      </SidebarItem>
    </ul>
    <div class="px-3">
      <Separator />
    </div>
    <ul class="flex flex-col gap-y-1 px-3">
      <SidebarItem :href="pathname" label="Billing" @onClick="onClick">
        <CreditCard />
      </SidebarItem>
      <SidebarItem href="mailto:support@gmail.com" label="Get Help">
        <MessageCircleQuestion />
      </SidebarItem>
    </ul>
  </div>
</template>
