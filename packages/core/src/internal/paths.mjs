// Correctness-cleanup: containment guard for GATED FILE WRITES.
//
// Stricter than assertLocalFilePath: Windows absolute/UNC/drive forms
// (C:\, C:dir, \\share, //share) can never be contained inside a relative
// working directory, so they are rejected outright. Applied to gated host
// writes (e.g. plan --output).
import { assertLocalFilePath } from "../index.mjs";

export function assertContainedWritePath(filePath, label = "write path") {
  assertLocalFilePath(filePath, label);

  if (/^[A-Za-z]:/.test(filePath)) {
    throw new Error(`${label} must be a relative path inside the working directory (Windows absolute/drive paths are not contained).`);
  }

  if (/^[\\/]/.test(filePath)) {
    throw new Error(`${label} must be a relative path inside the working directory (absolute paths are not contained).`);
  }
}
