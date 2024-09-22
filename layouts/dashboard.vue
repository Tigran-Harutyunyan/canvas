<script setup lang="ts">
import Navbar from "@/components/dashboard/Navbar.vue";
import Sidebar from "@/components/dashboard/Sidebar.vue";
import { useSubscriptionAlert } from "@/features/subscriptions/composables/useSubscriptionAlert";
useSubscriptionAlert();
</script>

<template>
  <div class="bg-muted h-full">
    <Sidebar />
    <div class="lg:pl-[300px] flex flex-col h-full">
      <Navbar />
      <main class="bg-white flex-1 overflow-auto p-8 lg:rounded-tl-2xl">
        <slot />
      </main>
    </div>
  </div>
</template>
