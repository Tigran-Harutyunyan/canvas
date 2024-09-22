export const useCheckout = () => {
    const isPending = ref(false);

    const checkout = async () => {

        try {
            isPending.value = true;
            const response = await $fetch<ResponseType>(`/api/subscription/checkout`, {
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

    return { isPending, checkout };
};
