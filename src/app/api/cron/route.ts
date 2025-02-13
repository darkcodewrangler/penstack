import { CronJobHandler, CronJobPayload } from "@/src/lib/cron";
import { resolveUrl } from "@/src/utils/url";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const baseUrl = new URL(req.url)?.origin;

  const body = (await req.json()) as CronJobPayload;

  if (!body?.job) {
    return NextResponse.json(
      {
        message: "Invalid job",
      },
      { status: 400 }
    );
  }
  const url = resolveUrl(baseUrl, body.job.url);
  console.log({ url });

  try {
    const result = await CronJobHandler.addJob({
      job: {
        ...body.job,
        url,
      },
    });

    return NextResponse.json({
      message: "Job created successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error,
        message: "Error creating job...",
      },
      { status: 500 }
    );
  }
}
