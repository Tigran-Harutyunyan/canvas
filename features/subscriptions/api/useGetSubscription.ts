
export const useGetSubscription = async () => {
    const data = ref();
    const isLoading = ref(true);
    const isError = ref(false);

    try {
        const response = await $fetch<ResponseType>(`/api/subscription/current`);

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
