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
export const useGetTemplates = () => {
    const data = ref<ResponseType[]>([]);
    const isPending = ref(false);
    const isError = ref(false);
    const limit = ref(4);
    const page = ref(1);

    const getTemplates = async () => {


        isPending.value = true;

        try {
            const url = `/api/templates?limit=${limit.value}&page=${page.value}`;

            const response = await $fetch<ResponseType[]>(url, {
                method: 'get'
            });


            if (response && response.length) {
                data.value = response;
            }

        } catch (error) {
            isError.value = true;
        } finally {
            isPending.value = false;
        }
    }

    return { isError, isPending, data, getTemplates }
};
