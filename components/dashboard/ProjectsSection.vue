<script setup lang="ts">
import { formatDistanceToNow } from "date-fns";
import { useInfiniteScroll } from "@vueuse/core";

import {
  AlertTriangle,
  CopyIcon,
  FileIcon,
  Loader,
  MoreHorizontal,
  Search,
  Trash,
} from "lucide-vue-next";

import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
const confirm = ref<InstanceType<typeof ConfirmDialog> | null>(null);

import { useGetProjects } from "@/features/projects/api/useGetProjects";
import { useDeleteProject } from "@/features/projects/api/useDeleteProject";
import { useDuplicateProject } from "@/features/projects/api/useDuplicateProject";

const el = ref<HTMLElement | null>(null);

const { data, isError, isPending, hasNextPage, getProjects } = useGetProjects();
const { deleteProject } = useDeleteProject();

const router = useRouter();
const { duplicateProject } = useDuplicateProject();

const onCopy = async (id: string) => {
  const response = await duplicateProject(id);
  if (response && "id" in response) {
    data.value.push(response);
  }
};

const onDelete = async (id: string) => {
  const userInput = await confirm.value?.openModal(
    "Are you sure?",
    "You are about to delete this project."
  );

  if (!userInput) return;

  const response = await deleteProject(id);
  if (response && "id" in response) {
    data.value = data.value.filter((item) => item.id !== id);
  }
};

useInfiniteScroll(
  el,
  () => {
    if (isPending.value || !hasNextPage.value) return;
    getProjects();
  },
  { distance: 10 }
);

onBeforeMount(() => {
  getProjects();
});
</script>

<template>
  <div v-if="isPending && !data.length" lass="space-y-4">
    <h3 class="font-semibold text-lg">Recent projects</h3>
    <div class="flex flex-col gap-y-4 items-center justify-center h-32">
      <Loader class="size-6 animate-spin text-muted-foreground" />
    </div>
  </div>

  <div v-if="isError && !isPending" class="space-y-4">
    <h3 class="font-semibold text-lg">Recent projects</h3>
    <div class="flex flex-col gap-y-4 items-center justify-center h-32">
      <AlertTriangle class="size-6 text-muted-foreground" />
      <p class="text-muted-foreground text-sm">Failed to load projects</p>
    </div>
  </div>

  <div v-if="!data.length && !isPending" class="space-y-4">
    <h3 class="font-semibold text-lg">Recent projects</h3>
    <div class="flex flex-col gap-y-4 items-center justify-center h-32">
      <Search class="size-6 text-muted-foreground" />
      <p class="text-muted-foreground text-sm">No projects found</p>
    </div>
  </div>

  <div v-if="data.length" class="space-y-4">
    <ConfirmDialog ref="confirm" />
    <h3 class="font-semibold text-lg">Recent projects</h3>
    <Table>
      <TableBody>
        <TableRow :key="project.id" v-for="project in data">
          <TableCell
            @click="router.push(`/editor/${project.id}`)"
            class="font-medium flex items-center gap-x-2 cursor-pointer"
          >
            <FileIcon class="size-6" />
            {{ project.name }}
          </TableCell>
          <TableCell
            @click="router.push(`/editor/${project.id}`)"
            class="hidden md:table-cell cursor-pointer"
          >
            {{ project.width }} x {{ project.height }} px
          </TableCell>
          <TableCell
            @click="router.push(`/editor/${project.id}`)"
            class="hidden md:table-cell cursor-pointer"
          >
            {{
              formatDistanceToNow(project.updatedAt, {
                addSuffix: true,
              })
            }}
          </TableCell>
          <TableCell class="flex items-center justify-end">
            <DropdownMenu :modal="false">
              <DropdownMenuTrigger as-child>
                <Button :disabled="false" size="icon" variant="ghost">
                  <MoreHorizontal class="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-60">
                <DropdownMenuItem
                  class="h-10 cursor-pointer"
                  @click="onCopy(project.id)"
                >
                  <CopyIcon class="size-4 mr-2" />
                  Make a copy
                </DropdownMenuItem>
                <DropdownMenuItem
                  class="h-10 cursor-pointer"
                  @click="onDelete(project.id)"
                >
                  <Trash class="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <div
    v-if="hasNextPage && !isPending"
    ref="el"
    class="w-full flex items-center justify-center pt-4"
  ></div>
</template>
