import { verifyToken } from "@clerk/backend";

export type VerifiedClerkUser = {
  userId: string;
};

export async function verifyClerkRequest(
  request: Request,
): Promise<VerifiedClerkUser | null> {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("CLERK_SECRET_KEY must be set on the server");
  }

  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token, { secretKey });
    if (!payload.sub) {
      return null;
    }
    return { userId: payload.sub };
  } catch {
    return null;
  }
}
