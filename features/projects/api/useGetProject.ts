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
export const useGetProject = async (projectId: string) => {
    const data = ref<ResponseType>();
    const isLoading = ref(true);
    const isError = ref(false);

    try {
        if (!projectId) {
            throw new Error('Missing project id');
        }

        const response = await $fetch<ResponseType>(`/api/project/${projectId}`);

        if (response) {
            data.value = response;
        }

    } catch (error) {
        isError.value = true;
    } finally {
        isLoading.value = false;
    }

    return { data, isError, isLoading };
};
