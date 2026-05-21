import type { Href, Router } from "expo-router";

type SessionLike = {
  currentTask?: unknown;
};

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
