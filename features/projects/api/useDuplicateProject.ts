import { useToast } from '@/components/ui/toast/use-toast';
export const useDuplicateProject = () => {
    const data = ref<ResponseType>();
    const isPending = ref(true);
    const isError = ref(false);

    const { toast } = useToast();

    const duplicateProject = async (projectId: string) => {
        isPending.value = true;

        try {

            const response = await $fetch<ResponseType[]>(`/api/project/${projectId}/duplicate`, {
                method: 'post'
            });

            if ('id' in response) {
                toast({
                    title: 'Project is duplicated',
                });
            }

            return response;

        } catch (error) {
            isError.value = true;
        } finally {
            isPending.value = false;
        }
    }

    return { data, isError, isPending, duplicateProject };
};
