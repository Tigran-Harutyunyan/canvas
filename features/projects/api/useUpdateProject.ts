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
export const useUpdateProject = (projectId: string) => {
    const data = ref<ResponseType>();
    const isPending = ref(false);
    const isError = ref(false);

    if (!projectId) {
        throw new Error('Missing project id');
    }

    const updateProject = async (values: { json: string; height: number; width: number }) => {
        isPending.value = true;
        try {

            const response = await $fetch<ResponseType>(`/api/project/${projectId}`, {
                method: "PATCH",
                body: {
                    values
                }
            });

            if (response) {
                data.value = response;
            }

        } catch (error) {
            isError.value = true;
        } finally {
            isPending.value = false;
        }
    }

    return {
        data,
        isError,
        isPending,
        updateProject
    };
};
