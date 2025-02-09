import { exec } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

interface CodeRequestBody {
  code: string;
  language: string;
}

// Use absolute paths for executables
const PYTHON_PATH = "python.exe"; // Change this to your actual Python path
const LANGUAGE_CONFIGS: Record<string, { filename: string; command: string }> =
  {
    python: { filename: "temp.py", command: `${PYTHON_PATH} temp.py` },
    cpp: {
      filename: "temp.cpp",
      command: "g++ temp.cpp -o temp.out && ./temp.out",
    },
    java: {
      filename: "Main.java",
      command: "ls -l Main.java && javac Main.java && java -cp . Aarav",
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

    const { filename, command } = LANGUAGE_CONFIGS[language];

    // Write code to a temporary file
    await writeFile(filename, code);

    // Execute code in child process
    return new Promise((resolve) => {
      exec(command, async (error, stdout, stderr) => {
        await unlink(filename).catch(() => {}); // Delete temp file
        if (language === "cpp") await unlink("temp.out").catch(() => {}); // Delete C++ binary
        if (language === "java") await unlink("Main.class").catch(() => {}); // Delete Java compiled file

        if (error) {
          resolve(NextResponse.json({ output: stderr || "Execution error" }));
        } else {
          resolve(NextResponse.json({ output: stdout }));
        }
      });
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
