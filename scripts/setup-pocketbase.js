import { createWriteStream, existsSync, mkdirSync } from "fs";
import { chmod } from "fs/promises";
import { get } from "https";
import { pipeline } from "stream/promises";
import { createGunzip } from "zlib";
import { Extract } from "unzipper";
import { platform, arch } from "os";
import { join } from "path";

const POCKETBASE_VERSION = "0.23.6";
const pbDir = join(process.cwd(), "pocketbase");

function getPocketBaseUrl() {
  const os = platform();
  const architecture = arch();

  let osName, archName;

  if (os === "win32") {
    osName = "windows";
  } else if (os === "darwin") {
    osName = "darwin";
  } else {
    osName = "linux";
  }

  if (architecture === "x64") {
    archName = "amd64";
  } else if (architecture === "arm64") {
    archName = "arm64";
  } else {
    archName = "amd64";
  }

  return `https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_${osName}_${archName}.zip`;
}

async function downloadPocketBase() {
  if (existsSync(pbDir)) {
    console.log("PocketBase directory already exists, skipping download...");
    return;
  }

  console.log("Creating PocketBase directory...");
  mkdirSync(pbDir, { recursive: true });

  const url = getPocketBaseUrl();
  console.log(`Downloading PocketBase from ${url}...`);

  return new Promise((resolve, reject) => {
    get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        get(response.headers.location, (redirectResponse) => {
          redirectResponse
            .pipe(Extract({ path: pbDir }))
            .on("close", async () => {
              console.log("PocketBase downloaded and extracted successfully!");

              // Make executable on Unix systems
              if (platform() !== "win32") {
                const pbPath = join(pbDir, "pocketbase");
                await chmod(pbPath, 0o755);
              }

              resolve();
            })
            .on("error", reject);
        });
      } else {
        response
          .pipe(Extract({ path: pbDir }))
          .on("close", async () => {
            console.log("PocketBase downloaded and extracted successfully!");

            // Make executable on Unix systems
            if (platform() !== "win32") {
              const pbPath = join(pbDir, "pocketbase");
              await chmod(pbPath, 0o755);
            }

            resolve();
          })
          .on("error", reject);
      }
    }).on("error", reject);
  });
}

downloadPocketBase().catch(console.error);
