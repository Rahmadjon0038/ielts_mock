import { useEffect } from "react";

function usePreventRefresh() {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Vaqt tugamaguncha refresh qilmang!";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
}

export default usePreventRefresh;
