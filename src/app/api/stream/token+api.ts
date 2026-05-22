import { verifyClerkRequest } from "@/lib/stream-auth";
import { generateStreamVideoToken, upsertStreamUser } from "@/lib/stream-server";

type TokenRequestBody = {
  name?: string;
  imageUrl?: string;
};

export async function POST(request: Request) {
  try {
    const auth = await verifyClerkRequest(request);
    if (!auth) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as TokenRequestBody;
    const displayName =
      typeof body.name === "string" && body.name.trim().length > 0
        ? body.name.trim()
        : "Learner";

    await upsertStreamUser({
      userId: auth.userId,
      name: displayName,
      image: body.imageUrl,
    });

    const token = generateStreamVideoToken(auth.userId);

    const apiKey = process.env.STREAM_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Stream API key is not configured" },
        { status: 500 },
      );
    }

    return Response.json({
      apiKey,
      token,
      userId: auth.userId,
    });
  } catch (error) {
    console.error("[stream/token]", error);
    return Response.json(
      { error: "Failed to create Stream token" },
      { status: 500 },
    );
  }
}
