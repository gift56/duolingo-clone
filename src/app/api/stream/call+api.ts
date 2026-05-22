import { getLessonById } from "@/data/lessons";
import { verifyClerkRequest } from "@/lib/stream-auth";
import {
  buildLessonCallId,
  createAudioLessonCall,
  upsertStreamUser,
} from "@/lib/stream-server";
import type { StreamLessonCallCustomData } from "@/types/stream";

type CreateCallBody = {
  lessonId: string;
  languageId: string;
  languageName: string;
  unitId: string;
  userName?: string;
};

export async function POST(request: Request) {
  try {
    const auth = await verifyClerkRequest(request);
    if (!auth) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreateCallBody;
    const { lessonId, languageId, languageName, unitId } = body;

    if (!lessonId || !languageId || !languageName || !unitId) {
      return Response.json(
        { error: "lessonId, languageId, languageName, and unitId are required" },
        { status: 400 },
      );
    }

    const lesson = getLessonById(lessonId);
    if (!lesson) {
      return Response.json({ error: "Lesson not found" }, { status: 404 });
    }

    const displayName =
      typeof body.userName === "string" && body.userName.trim().length > 0
        ? body.userName.trim()
        : "Learner";

    await upsertStreamUser({
      userId: auth.userId,
      name: displayName,
    });

    const callId = buildLessonCallId(lessonId, auth.userId);

    const custom: StreamLessonCallCustomData = {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      languageId,
      languageName,
      unitId,
      clerkUserId: auth.userId,
      userName: displayName,
      goals: lesson.goals.map((goal) => goal.description),
      vocabulary: lesson.vocabulary.map((item) => ({
        word: item.word,
        translation: item.translation,
      })),
      phrases: lesson.phrases.map((phrase) => ({
        text: phrase.text,
        translation: phrase.translation,
      })),
      aiTeacher: {
        systemContext: lesson.aiTeacher.systemContext,
        openingLine: lesson.aiTeacher.openingLine,
        focusTopics: lesson.aiTeacher.focusTopics,
        level: lesson.aiTeacher.level,
      },
    };

    const call = await createAudioLessonCall({
      callId,
      createdById: auth.userId,
      custom,
    });

    return Response.json(call);
  } catch (error) {
    console.error("[stream/call]", error);
    return Response.json(
      { error: "Failed to create Stream call" },
      { status: 500 },
    );
  }
}
