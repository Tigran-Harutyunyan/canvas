type Json = {
    name: string,
    json: any,
    width: number,
    height: number,
}
type ResponseType = {
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
export const useCreateProject = () => {
    const response = ref<ResponseType>();
    const isLoading = ref(false);

    const createProject = async (data: Json) => {
        try {
            isLoading.value = true;
            response.value = await $fetch(`/api/project/create`, {
                method: "post",
                body: {
                    data
                }
            });
            isLoading.value = false;
        } catch (error) {

        }
    }

    return { response, isLoading, createProject };
};
