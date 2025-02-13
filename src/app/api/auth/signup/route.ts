import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/src/lib/queries/create-user";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, username } = await req.json();
    const user = await createUser({ name, email, password, username });
    return NextResponse.json({
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: "Error creating user" },
      { status: 500 }
    );
  }
}
