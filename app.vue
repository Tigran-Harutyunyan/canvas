<script setup lang="ts">
import { ClerkLoaded } from "vue-clerk";
import Toaster from "@/components/ui/toast/Toaster.vue";
import Modals from "@/components/Modals.vue";
</script>
<template>
  <ClerkLoaded>
    <Modals />
    <Toaster class="pointer-events-auto" />
    <NuxtPage />
  </ClerkLoaded>
</template>
