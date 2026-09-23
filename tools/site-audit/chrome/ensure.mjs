// Extracts @sparticuz/chromium into /tmp (idempotent) and prints its path.
import chromium from '@sparticuz/chromium';
process.stdout.write(await chromium.executablePath());
