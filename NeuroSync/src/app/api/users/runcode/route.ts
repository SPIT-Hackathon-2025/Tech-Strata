import { exec } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

interface CodeRequestBody {
  code: string;
  language: string;
}

const PYTHON_PATH = process.env.PYTHON_PATH || "python"; // Use environment variables
const BASE_DIR = "/tmp"; // Use a safe directory

const LANGUAGE_CONFIGS: Record<
  string,
  { filename: string; command: (file: string) => string }
> = {
  python: {
    filename: "temp.py",
    command: (file) => `${PYTHON_PATH} ${file}`,
  },
  cpp: {
    filename: "temp.cpp",
    command: (file) =>
      `g++ ${file} -o ${file.replace(".cpp", ".out")} && ${file.replace(
        ".cpp",
        ".out"
      )}`,
  },
  java: {
    filename: "Main.java",
    command: (file) => `javac ${file} && java -cp ${path.dirname(file)} Main`,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { code, language }: CodeRequestBody = await req.json();

    if (!LANGUAGE_CONFIGS[language]) {
      return NextResponse.json(
        { error: "Unsupported language" },
        { status: 400 }
      );
    }

    if (language === "java" && !code.includes("class Main")) {
      return NextResponse.json(
        { error: "Java code must contain a class named 'Main'" },
        { status: 400 }
      );
    }

    const tempFilePath = path.join(
      BASE_DIR,
      LANGUAGE_CONFIGS[language].filename
    );
    const command = LANGUAGE_CONFIGS[language].command(tempFilePath);

    // Write code to a temporary file
    await writeFile(tempFilePath, code);

    // Execute code in a child process with timeout
    return new Promise((resolve) => {
      exec(command, { timeout: 5000 }, async (error, stdout, stderr) => {
        await unlink(tempFilePath).catch(() => {});
        if (language === "cpp")
          await unlink(tempFilePath.replace(".cpp", ".out")).catch(() => {});
        if (language === "java")
          await unlink(tempFilePath.replace(".java", ".class")).catch(() => {});

        if (error) {
          resolve(NextResponse.json({ output: stderr || "Execution error" }));
        } else {
          resolve(NextResponse.json({ output: stdout.trim() }));
        }
      });
    });
  } catch (err) {
    console.error("Execution error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
