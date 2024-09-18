<script setup lang="ts">
import Logo from "./Logo.vue";
import SidebarRoutes from "./SidebarRoutes.vue";
</script>

<template>
  <aside class="hidden lg:flex fixed flex-col w-[300px] left-0 shrink-0 h-full">
    <Logo />
    <SidebarRoutes />
  </aside>
</template>
