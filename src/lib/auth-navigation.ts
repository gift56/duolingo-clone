import type { Href, Router } from "expo-router";

type SessionLike = {
  currentTask?: unknown;
};

/** Where unauthenticated users land (welcome + sign-in / sign-up). */
export const UNAUTHENTICATED_ENTRY = "/onboarding" as const;

export function navigateAfterAuth(
  router: Router,
  decorateUrl: (url: string) => string,
  session?: SessionLike | null,
) {
  if (session?.currentTask) {
    return;
  }

  const url = decorateUrl("/");
  router.replace(url as Href);
}

export async function signOutAndRedirect(
  signOut: () => Promise<void>,
  router: Router,
) {
  await signOut();
  router.replace(UNAUTHENTICATED_ENTRY);
}
