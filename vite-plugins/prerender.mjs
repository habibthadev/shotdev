import { mkdir, cp, writeFile, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const rootDir = process.cwd()
const clientDir = join(rootDir, 'dist', 'client')
const publicDir = join(rootDir, 'public')
const siteUrl = (process.env.SITE_URL || 'https://shotdev.app').replace(/\/$/, '')
const routes = [
  { path: '/', file: 'index.html' },
  { path: '/studio', file: 'studio.html' },
  { path: '/preview', file: 'preview.html' },
  { path: '/__shotdev_404__', file: '404.html' },
]

const handler = (await import(join(rootDir, 'dist', 'server', 'server.js'))).default.fetch

await mkdir(clientDir, { recursive: true })

for (const route of routes) {
  const res = await handler(
    new Request(`http://localhost:3000${route.path}`, { headers: { accept: 'text/html' } }),
  )
  const html = await res.text()
  await writeFile(join(clientDir, route.file), html)
  console.log(`prerendered ${route.path} -> dist/client/${route.file} (${html.length} bytes)`)
}

await writeFile(
  join(clientDir, 'robots.txt'),
  ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n'),
)
console.log('wrote dist/client/robots.txt')

await writeFile(
  join(clientDir, 'sitemap.xml'),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...['', '/studio', '/preview'].map(
      (p) => `  <url><loc>${siteUrl}${p}</loc><changefreq>weekly</changefreq></url>`,
    ),
    '</urlset>',
    '',
  ].join('\n'),
)
console.log('wrote dist/client/sitemap.xml')

const vercelStatic = join(rootDir, '.vercel', 'output', 'static')
try {
  await mkdir(vercelStatic, { recursive: true })
  await cp(clientDir, vercelStatic, { recursive: true, force: true })
  console.log(`mirrored dist/client into ${vercelStatic}`)
} catch (err) {
  console.log(`skipping vercel static mirror: ${err.message}`)
}

const FONT_BOLD = await readFile(join(publicDir, 'fonts', 'SFPRODISPLAYBOLD.OTF'))
const FONT_REGULAR = await readFile(join(publicDir, 'fonts', 'SFPRODISPLAYREGULAR.OTF'))
const FONTS = [
  { name: 'SF Pro Display', data: FONT_BOLD, weight: 700 },
  { name: 'SF Pro Display', data: FONT_REGULAR, weight: 400 },
]

const OG_CONTENT = {
  '': {
    eyebrow: 'shotdev',
    title: ['Website screenshots,', 'in a macOS frame.'],
    description: 'Production-ready screenshots with native browser frames.',
  },
  studio: {
    eyebrow: 'shotdev studio',
    title: ['Paste a link, get a', 'macOS desktop scene.'],
    description: 'Pick a wallpaper and browser frame — capture in seconds.',
  },
  preview: {
    eyebrow: 'shotdev preview',
    title: ['Your scene, ready', 'to save and share.'],
    description: 'Export as PNG, JPEG, or WebP.',
  },
}

function normalizeVNode(node) {
  if (!node || typeof node === 'string') return node
  const { type, props } = node
  const { style = {}, children = [] } = props
  if (type === 'div' && Array.isArray(children)) {
    style.display = style.display || 'flex'
    props.style = style
    props.children = children.map(normalizeVNode)
  }
  return { type, props }
}

function svgNode(width, height, viewBox, children) {
  return { type: 'svg', props: { width, height, viewBox, children } }
}

function svgIcon(bg, shapes) {
  return svgNode(30, 30, '0 0 64 64', [
    { type: 'rect', props: { x: 0, y: 0, width: 64, height: 64, rx: 15, fill: bg } },
    ...shapes,
  ])
}

const ICONS = {
  finder: svgIcon('#0B84F3', [
    { type: 'rect', props: { x: 0, y: 0, width: 32, height: 64, fill: '#ffffff' } },
    { type: 'rect', props: { x: 32, y: 0, width: 32, height: 64, fill: 'rgba(255,255,255,0.28)' } },
  ]),
  launchpad: svgIcon('#C9CCD3', [
    ...[20, 32, 44].flatMap((x) =>
      [20, 32, 44].map((y) => ({
        type: 'circle',
        props: { cx: x, cy: y, r: 2.8, fill: 'rgba(90,94,102,0.85)' },
      })),
    ),
  ]),
  safari: svgIcon('#35A0F6', [
    { type: 'circle', props: { cx: 32, cy: 32, r: 21, fill: '#ffffff' } },
    { type: 'polygon', props: { points: '32,15 45,45 32,39', fill: '#35A0F6' } },
    { type: 'polygon', props: { points: '32,49 19,19 32,25', fill: '#FA3E3E' } },
  ]),
  messages: svgIcon('#30D158', [
    { type: 'rect', props: { x: 14, y: 17, width: 36, height: 27, rx: 12, fill: '#ffffff' } },
    { type: 'polygon', props: { points: '20,42 26,54 31,44', fill: '#ffffff' } },
  ]),
  mail: svgIcon('#2A9DF4', [
    { type: 'rect', props: { x: 13, y: 22, width: 38, height: 26, rx: 4, fill: '#ffffff' } },
    { type: 'polygon', props: { points: '13,22 32,27 51,22', fill: '#ffffff' } },
  ]),
  music: svgIcon('#FC5C7D', [
    { type: 'circle', props: { cx: 24, cy: 40, r: 6.5, fill: '#ffffff' } },
    { type: 'circle', props: { cx: 42, cy: 40, r: 6.5, fill: '#ffffff' } },
    { type: 'rect', props: { x: 24, y: 16, width: 27, height: 6, rx: 3, fill: '#ffffff' } },
    { type: 'rect', props: { x: 26, y: 22, width: 4, height: 22, fill: '#ffffff' } },
    { type: 'rect', props: { x: 44, y: 22, width: 4, height: 17, fill: '#ffffff' } },
  ]),
}

const CAMERA = svgNode(26, 26, '0 0 26 26', [
  { type: 'rect', props: { x: 2, y: 7, width: 22, height: 14, rx: 4.5, fill: '#ffffff' } },
  { type: 'rect', props: { x: 10, y: 5, width: 6, height: 3.5, rx: 1.75, fill: '#ffffff' } },
  { type: 'circle', props: { cx: 13, cy: 14, r: 4.2, fill: '#ffffff' } },
])

const WIFI = svgNode(16, 16, '0 0 16 16', [
  { type: 'path', props: { d: 'M2 5.5 A6 6 0 0 1 14 5.5', fill: 'none', stroke: '#1d1d1f', strokeWidth: 2.2, strokeLinecap: 'round' } },
  { type: 'path', props: { d: 'M4.6 8.8 A3.4 3.4 0 0 1 11.4 8.8', fill: 'none', stroke: '#1d1d1f', strokeWidth: 2.2, strokeLinecap: 'round' } },
  { type: 'circle', props: { cx: 8, cy: 12.2, r: 1.9, fill: '#1d1d1f' } },
])

const BATTERY = svgNode(24, 24, '0 0 24 24', [
  { type: 'rect', props: { x: 1, y: 6, width: 18, height: 10, rx: 3, fill: 'none', stroke: '#1d1d1f', strokeWidth: 2 } },
  { type: 'rect', props: { x: 3.5, y: 8.5, width: 12, height: 5, rx: 1.5, fill: 'rgba(29,29,31,0.85)' } },
  { type: 'rect', props: { x: 21, y: 9, width: 2.5, height: 4, rx: 1.25, fill: '#1d1d1f' } },
])

function trafficLights() {
  return ['#FF5F57', '#FFBD2E', '#28CA42'].map((c) => ({
    type: 'div',
    props: { style: { width: 13, height: 13, borderRadius: 7, background: c } },
  }))
}

function ogScene(content) {
  return normalizeVNode({
    type: 'div',
    props: {
      style: {
        width: 1200,
        height: 630,
        flexDirection: 'column',
        fontFamily: 'SF Pro Display',
        background:
          'linear-gradient(180deg, #bfdaf5 0%, #e3ecf8 56%, #f6f4f7 100%)',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              height: 34,
              padding: '0 26px',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.55)',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { alignItems: 'center', gap: 9 },
                  children: [
                    { type: 'div', props: { style: { width: 15, height: 15, borderRadius: 4.5, background: '#007aff', boxShadow: '0 2px 6px rgba(0,122,255,0.4)' } } },
                    { type: 'div', props: { style: { fontSize: 13, fontWeight: 700, color: '#1d1d1f' }, children: 'shotdev' } },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: { alignItems: 'center', gap: 16 },
                  children: [
                    WIFI,
                    BATTERY,
                    { type: 'div', props: { style: { fontSize: 13, fontWeight: 700, color: '#1d1d1f' }, children: '9:41' } },
                  ],
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              alignItems: 'center',
              gap: 72,
              padding: '0 88px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    flexDirection: 'column',
                    width: 470,
                    height: 430,
                    padding: '13px 13px 15px',
                    borderRadius: 18,
                    background: '#ffffff',
                    boxShadow: '0 30px 70px rgba(60,90,140,0.28), 0 6px 20px rgba(60,90,140,0.14)',
                  },
                  children: [
                    {
                      type: 'div',
                      props: { style: { gap: 8 }, children: trafficLights() },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          height: 30,
                          alignItems: 'flex-end',
                          gap: 6,
                          padding: '0 10px',
                          background: '#eceef1',
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        },
                        children: [
                          { type: 'div', props: { style: { width: 84, height: 20, borderTopLeftRadius: 7, borderTopRightRadius: 7, background: '#d8dbe0' } } },
                          { type: 'div', props: { style: { width: 96, height: 26, borderTopLeftRadius: 7, borderTopRightRadius: 7, background: '#ffffff' } } },
                          { type: 'div', props: { style: { width: 60, height: 20, borderTopLeftRadius: 7, borderTopRightRadius: 7, background: '#d8dbe0' } } },
                        ],
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          height: 36,
                          alignItems: 'center',
                          gap: 9,
                          padding: '0 14px',
                          borderRadius: 18,
                          background: '#f5f5f7',
                          marginTop: 11,
                        },
                        children: [
                          { type: 'div', props: { style: { width: 13, height: 13, borderRadius: 4, background: '#007aff' } } },
                          { type: 'div', props: { style: { fontSize: 13, fontWeight: 700, color: '#8e8e93', paddingBottom: 1 }, children: 'shotdev.app' } },
                        ],
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          flex: 1,
                          flexDirection: 'column',
                          justifyContent: 'center',
                          gap: 12,
                          padding: '0 6px',
                        },
                        children: [
                          { type: 'div', props: { style: { width: 190, height: 20, borderRadius: 6, background: '#007aff' } } },
                          { type: 'div', props: { style: { width: 310, height: 12, borderRadius: 6, background: '#e2e4e8' } } },
                          { type: 'div', props: { style: { width: 260, height: 12, borderRadius: 6, background: '#e2e4e8' } } },
                          {
                            type: 'div',
                            props: {
                              style: { gap: 12, paddingTop: 8 },
                              children: [
                                {
                                  type: 'div',
                                  props: {
                                    style: {
                                      width: 168,
                                      height: 82,
                                      flexDirection: 'column',
                                      gap: 8,
                                      padding: 12,
                                      borderRadius: 10,
                                      background: '#f2f3f5',
                                    },
                                    children: [
                                      { type: 'div', props: { style: { width: 90, height: 10, borderRadius: 5, background: '#007aff' } } },
                                      { type: 'div', props: { style: { width: 130, height: 8, borderRadius: 4, background: '#d6d8dc' } } },
                                      { type: 'div', props: { style: { width: 110, height: 8, borderRadius: 4, background: '#d6d8dc' } } },
                                    ],
                                  },
                                },
                                {
                                  type: 'div',
                                  props: {
                                    style: {
                                      width: 168,
                                      height: 82,
                                      flexDirection: 'column',
                                      gap: 8,
                                      padding: 12,
                                      borderRadius: 10,
                                      background: '#f2f3f5',
                                    },
                                    children: [
                                      { type: 'div', props: { style: { width: 90, height: 10, borderRadius: 5, background: '#34c759' } } },
                                      { type: 'div', props: { style: { width: 130, height: 8, borderRadius: 4, background: '#d6d8dc' } } },
                                      { type: 'div', props: { style: { width: 110, height: 8, borderRadius: 4, background: '#d6d8dc' } } },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          height: 62,
                          alignItems: 'flex-end',
                          gap: 9,
                          paddingBottom: 12,
                        },
                        children: [
                          ICONS.finder,
                          ICONS.launchpad,
                          ICONS.safari,
                          ICONS.messages,
                          ICONS.mail,
                          ICONS.music,
                        ],
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    flexDirection: 'column',
                    gap: 10,
                    flex: 1,
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          alignItems: 'center',
                          gap: 11,
                          borderRadius: 15,
                        },
                        children: [
                          { type: 'div', props: { style: { width: 30, height: 30, borderRadius: 9, background: '#007aff', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 14px rgba(0,122,255,0.35)' }, children: [CAMERA] } },
                          { type: 'div', props: { style: { fontSize: 21, fontWeight: 700, color: '#1d1d1f' }, children: content.eyebrow } },
                        ],
                      },
                    },
                    ...content.title.map((line, i) => ({
                      type: 'div',
                      props: {
                        style: {
                          fontSize: 58,
                          fontWeight: 700,
                          letterSpacing: '-0.02em',
                          color: i === content.title.length - 1 ? '#6e6e73' : '#1d1d1f',
                        },
                        children: line,
                      },
                    })),
                    {
                      type: 'div',
                      props: {
                        style: {
                          marginTop: 6,
                          fontSize: 25,
                          fontWeight: 400,
                          color: '#6e6e73',
                          maxWidth: 470,
                        },
                        children: content.description,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  })
}

async function generateOgImages() {
  for (const [key, content] of Object.entries(OG_CONTENT)) {
    const svg = await satori(ogScene(content), {
      width: 1200,
      height: 630,
      fonts: FONTS,
    })
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
      .render()
      .asPng()
    const name = key ? `og-${key}.png` : 'og.png'
    await writeFile(join(clientDir, name), png)
    await writeFile(join(publicDir, name), png)
  }
}

await generateOgImages()
console.log('wrote satori og images')
