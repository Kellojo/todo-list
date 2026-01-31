import { spawn } from "child_process";
import { join } from "path";
import { platform } from "os";

const pbDir = join(process.cwd(), "pocketbase");
const pbExecutable = platform() === "win32" ? "pocketbase.exe" : "pocketbase";
const pbPath = join(pbDir, pbExecutable);

console.log("Starting PocketBase...");

const pb = spawn(pbPath, ["serve", "--http=127.0.0.1:8090"], {
  cwd: pbDir,
  stdio: "inherit",
  shell: false,
});

pb.on("error", (error) => {
  console.error("Failed to start PocketBase:", error);
  process.exit(1);
});

pb.on("close", (code) => {
  if (code !== 0) {
    console.log(`PocketBase exited with code ${code}`);
  }
});

// Handle process termination
process.on("SIGINT", () => {
  pb.kill("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  pb.kill("SIGTERM");
  process.exit(0);
});
