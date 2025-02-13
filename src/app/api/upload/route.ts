import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db"; // Your database connection
import { medias } from "@/src/db/schemas"; // Your schema
import { MediaType } from "@/src/types";
import { eq } from "drizzle-orm";
import { determineFileType } from "@/src/utils/upload";
import { checkPermission } from "@/src/lib/auth/check-permission";

export async function POST(request: NextRequest) {
  return await checkPermission(
    { requiredPermission: "media:upload" },
    async () => {
      try {
        const data = await request.json();

        const result = await db.transaction(async (tx) => {
          const [response] = await tx
            .insert(medias)
            .values({
              name: data.original_filename,
              url: data.secure_url,
              type: determineFileType(data.format || data.resource_type),
              size: data.bytes,
              mime_type: data.format
                ? `image/${data.format}`
                : data.resource_type,
              width: data.width,
              height: data.height,
              folder: data.folder,
              caption: data.caption,
              alt_text: data.alt_text || "",
            })
            .$returningId();
          return await tx.query.medias.findFirst({
            where: eq(medias.id, response.id),
          });
        });

        return NextResponse.json(result);
      } catch (error) {
        console.log(error);

        return NextResponse.json(
          { error: "Failed to save media data" },
          { status: 500 }
        );
      }
    }
  );
}
