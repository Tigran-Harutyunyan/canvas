<script setup lang="ts">
import { UserButton, SignedIn } from "vue-clerk";
</script>

<template>
  <nav class="w-full flex items-center p-4 h-[68px]">
    <div class="ml-auto">
      <UserButton v-if="SignedIn" />
    </div>
  </nav>
</template>
