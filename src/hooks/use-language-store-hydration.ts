import { useEffect, useState } from "react";

import { useLanguageStore } from "@/store/language-store";

/** Wait for persisted language state to load from AsyncStorage before routing. */
export function useLanguageStoreHydration() {
  const [hydrated, setHydrated] = useState(
    useLanguageStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsubscribe = useLanguageStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    setHydrated(useLanguageStore.persist.hasHydrated());

    return unsubscribe;
  }, []);

  return hydrated;
}
