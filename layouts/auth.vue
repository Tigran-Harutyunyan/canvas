<script setup lang="ts"></script>

<template>
  <div class="bg-[url(/bg.jpg)] bg-top bg-cover h-full flex flex-col">
    <div class="z-[4] h-full w-full flex flex-col items-center justify-center">
      <div class="h-full w-full md:h-auto md:w-[420px]">
        <slot />
      </div>
    </div>
    <div
      class="fixed inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.8),rgba(0,0,0,.4),rgba(0,0,0,.8))] z-[1]"
    />
  </div>
</template>
