export const useBilling = () => {
    const isPending = ref(false);
    const mutate = async () => {

        try {
            isPending.value = true;

            const response = await $fetch<ResponseType>(`/api/subscription/billing`, {
                method: 'post'
            });

            if (response.url) {
                window.location.href = response.url;
            }
        } catch (error) {
        } finally {
            isPending.value = false;
        }
    }

    return { isPending, mutate };
};
