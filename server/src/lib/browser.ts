let browser: any = null
let chromiumModule: any = null

const LAUNCH_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--no-first-run',
  '--no-zygote',
  '--disable-extensions',
  '--disable-background-networking',
  '--disable-default-apps',
]

const executablePath = process.env.CHROMIUM_PATH || undefined
const isUnsupportedPlatform = () => process.platform === 'android' && !executablePath

const loadPlaywright = async () => {
  if (isUnsupportedPlatform()) {
    throw new Error('Playwright is not supported on this platform and CHROMIUM_PATH is not set')
  }
  if (!chromiumModule) {
    const pw = await import('playwright')
    chromiumModule = pw.chromium
  }
  return chromiumModule
}

export const getBrowser = async () => {
  if (isUnsupportedPlatform()) {
    throw new Error('Playwright is not supported on this platform and CHROMIUM_PATH is not set')
  }

  if (browser?.isConnected()) return browser

  const chromium = await loadPlaywright()
  browser = await chromium.launch({
    headless: true,
    args: LAUNCH_ARGS,
    ...(executablePath ? { executablePath } : {}),
  })

  browser.on('disconnected', () => {
    browser = null
  })

  return browser
}

export const newContext = async (userAgent: string) => {
  const b = await getBrowser()
  return b.newContext({
    userAgent,
    ignoreHTTPSErrors: true,
    locale: 'en-US',
    timezoneId: 'America/New_York',
    colorScheme: 'light',
  })
}

export const closeBrowser = async (): Promise<void> => {
  if (browser) {
    await browser.close()
    browser = null
  }
}
