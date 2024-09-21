export type ResponseType = {
  json: string;
  name: string;
  id: string;
  userId: string;
  height: number;
  width: number;
  thumbnailUrl: string | null;
  isTemplate: boolean | null;
  isPro: boolean | null;
  createdAt: string;
  updatedAt: string;
}
export const useGetProjects = () => {
  const data = ref<ResponseType[]>([]);
  const isPending = ref(false);
  const isError = ref(false);
  const limit = ref(5);
  const page = ref(1);
  const hasNextPage = ref(true);

  const getProjects = async () => {
    if (!hasNextPage.value) return;

    isPending.value = true;

    try {
      const url = `/api/projects?limit=${limit.value}&page=${page.value}`;

      const response = await $fetch<ResponseType[]>(url, {
        method: 'get'
      });

      hasNextPage.value = response.length < limit.value ? false : true;

      if (hasNextPage.value) ++page.value;

      if (response && response.length) {
        data.value = [...data.value, ...response];
      }

    } catch (error) {
      isError.value = true;
    } finally {
      isPending.value = false;
    }
  }

  return { data, isError, isPending, hasNextPage, getProjects };
};
