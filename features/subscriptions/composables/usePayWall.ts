import { useGetSubscription } from "@/features/subscriptions/api/useGetSubscription";
import { useSubscriptionModal } from "@/features/subscriptions/store/useSubscriptionModal";

export const usePayWall = async () => {
    const {
        data: subscription,
        isLoading: isLoadingSubscription,
    } = await useGetSubscription();

    const { onOpen } = useSubscriptionModal();

    const shouldBlock = computed(() => isLoadingSubscription.value || !subscription?.value?.data.active);

    return {
        isLoading: isLoadingSubscription,
        shouldBlock,
        triggerPaywall: () => {
            onOpen();
        },
    };
};
