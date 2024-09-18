<script setup lang="ts">
import { SignIn } from "vue-clerk";
useHead({
  title: "Sign-in",
});
</script>

<template>
  <NuxtLayout name="auth">
    <div class="grid h-full place-items-center">
      <SignIn sign-up-url="/sign-up" afterSignInUrl="/" />
    </div>
  </NuxtLayout>
</template>
