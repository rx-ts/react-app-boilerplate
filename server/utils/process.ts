import type { SpawnOptions } from 'child_process'
import { spawn as _spawn } from 'child_process'

export const spawn = (
  command: string,
  args: string[],
  options?: SpawnOptions,
) =>
  new Promise<void>((resolve, reject) => {
    const process = _spawn(command, args, {
      stdio: 'inherit',
      ...options,
    })
    process.once('error', reject)
    process.once('close', resolve)
  })
