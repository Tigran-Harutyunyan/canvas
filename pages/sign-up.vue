<script setup lang="ts">
import { SignUp } from "vue-clerk";
useHead({
  title: "Sign up",
});
</script>

<template>
  <NuxtLayout name="auth">
    <div class="grid h-full place-items-center">
      <SignUp sign-in-url="/sign-in" afterSignUpUrl="/" />
    </div>
  </NuxtLayout>
</template>
