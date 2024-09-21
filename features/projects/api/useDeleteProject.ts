import { useToast } from '@/components/ui/toast/use-toast';

export const useDeleteProject = () => {
    const data = ref<ResponseType>();
    const isPending = ref(true);
    const isError = ref(false);

    const { toast } = useToast();

    const deleteProject = async (projectId: string) => {
        isPending.value = true;

        try {

            const response = await $fetch<ResponseType[]>(`/api/project/${projectId}`, {
                method: 'delete'
            });

            if ('id' in response) {
                toast({
                    title: 'Project is deleted',
                });
            }

            return response;

        } catch (error) {
            isError.value = true;
        } finally {
            isPending.value = false;
        }
    }

    return { data, isError, isPending, deleteProject };
};
