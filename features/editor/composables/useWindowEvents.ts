export const useWindowEvents = () => {
    const callback = (event) => {
        (event || window.event).returnValue = "Are you sure you want to leave?"
    }

    onMounted(() => {
        window.addEventListener("beforeunload", callback);
    });

    onUnmounted(() => {
        window.removeEventListener("beforeunload", callback);
    });
}