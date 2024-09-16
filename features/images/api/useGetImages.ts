export const useGetImages = () => {

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const response = await $fetch(`/api/images`, {
        method: "get",
      });

      if (!response) {
        throw new Error("Failed to fetch images");
      }
      return response.data;
    },
  });

  return { isLoading, isError, data, error };
};
