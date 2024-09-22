import { useFailModal } from "@/features/subscriptions/store/useFailModal";
import { useSuccessModal } from "@/features/subscriptions/store/useSuccessModal";

export const useSubscriptionAlert = async () => {
    const { onOpen: onOpenFail } = useFailModal();
    const { onOpen: onOpenSuccess } = useSuccessModal();

    const queryParams = useRoute().query;

    const canceled = queryParams?.canceled;
    const success = queryParams?.success;

    watchEffect(() => {
        if (canceled) {
            onOpenFail();
        }

        if (success) {
            onOpenSuccess();
        }
    });
};