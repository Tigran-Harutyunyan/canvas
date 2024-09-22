<script setup lang="ts">
import Banner from "@/components/dashboard/Banner.vue";
import TemplatesSection from "@/components/dashboard/TemplatesSection.vue";
import ProjectsSection from "@/components/dashboard/ProjectsSection.vue";
</script>
<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col space-y-6 max-w-screen-xl mx-auto pb-10">
      <Banner />
      <TemplatesSection />
      <ProjectsSection />
    </div>
  </NuxtLayout>
</template>
