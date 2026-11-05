import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const flutter = process.env.FLUTTER_BIN || 'flutter';
const args = process.argv.includes('--apk')
  ? ['build', 'apk', '--release']
  : ['build', 'web', '--release', '--base-href=/app/', '--no-web-resources-cdn'];
const buildEnv = { ...process.env };
// Windows JDKs can reject an inherited short-name TEMP socket path. Keep this
// workaround scoped to this build process; do not change the machine's JDK.
if (process.platform === 'win32' && process.argv.includes('--apk') && process.env.PUBLIC) {
  const socketDir = process.env.PUBLIC.replaceAll('\\', '/');
  if (/["\r\n]/.test(socketDir)) throw new Error('Invalid public temporary directory.');
  buildEnv.JAVA_TOOL_OPTIONS = `${buildEnv.JAVA_TOOL_OPTIONS || ''} -Djdk.net.unixdomain.tmpdir="${socketDir}"`.trim();
}
if (/["\r\n&|<>^%]/.test(flutter)) throw new Error('FLUTTER_BIN must be a plain executable path.');
const result = process.platform === 'win32'
  ? spawnSync('cmd.exe', ['/d', '/s', '/c', `""${flutter}" ${args.join(' ')}"`], { cwd: path.join(root, 'app'), stdio: 'inherit', windowsVerbatimArguments: true, env: buildEnv })
  : spawnSync(flutter, args, { cwd: path.join(root, 'app'), stdio: 'inherit', env: buildEnv });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
if (process.argv.includes('--apk')) process.exit(0);

const dist = path.resolve(root, 'dist');
if (path.dirname(dist) !== path.resolve(root)) throw new Error('Unsafe output directory.');
if (!existsSync(path.join(root, 'app/build/web/main.dart.js'))) throw new Error('Flutter web build is missing.');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(path.join(root, 'site'), dist, { recursive: true });
cpSync(path.join(root, 'app/build/web'), path.join(dist, 'app'), { recursive: true });
console.log('Cloudflare Pages bundle ready in dist/ (website at /, app at /app/).');
