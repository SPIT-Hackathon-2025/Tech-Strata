import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/db/connectDB";
import CodeModel from "@/models/code";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");

    if (!fileName) {
      return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
    }

    const code = await CodeModel.findOne({ fileName });

    if (!code) {
      return NextResponse.json(
        { message: "No saved code found" },
        { status: 404 }
      );
    }

    return NextResponse.json(code, { status: 200 });
  } catch (error) {
    console.error("Error fetching code:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { fileName, content } = await req.json();

    if (!fileName || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingCode = await CodeModel.findOne({ fileName });

    if (existingCode) {
      existingCode.content = content;
      existingCode.updatedAt = new Date();
      await existingCode.save();
    } else {
      await CodeModel.create({ fileName, content });
    }

    return NextResponse.json(
      { message: "Code saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving code:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
