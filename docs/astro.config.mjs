import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import { createStarlightTypeDocPlugin } from 'starlight-typedoc'

const [starlightTypeDoc, typeDocSidebarGroup] = createStarlightTypeDocPlugin()
const libraryEntry = fileURLToPath(new URL('../src/index.ts', import.meta.url))

// Served at https://toolsu.com/convnum/ by a Cloudflare Worker with static assets (see
// wrangler.jsonc). `build:pages` nests the output under out/convnum/ so the files sit at
// the same paths as their URLs.
// https://astro.build/config
export default defineConfig({
  site: 'https://toolsu.com',
  base: '/convnum',
  vite: {
    resolve: {
      alias: [{ find: /^convnum$/, replacement: libraryEntry }],
    },
  },
  integrations: [
    react(),
    starlight({
      title: 'convnum',
      description:
        'Convert, validate, detect and format numbers across numeral systems, languages, and date formats.',
      locales: {
        root: { label: 'English', lang: 'en' },
        'zh-cn': { label: '简体中文', lang: 'zh-CN' },
        fr: { label: 'Français', lang: 'fr' },
      },
      logo: {
        light: './public/images/logo/logo.svg',
        dark: './public/images/logo/logo.svg',
        replacesTitle: true,
      },
      favicon: '/favicon.svg',
      head: [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        {
          tag: 'link',
          attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Instrument+Sans:wdth,wght@75..100,400..700&family=JetBrains+Mono:wght@400;500;700&display=swap',
          },
        },
      ],
      components: {
        Header: './src/components/Header.astro',
        Hero: './src/components/Hero.astro',
        MobileMenuFooter: './src/components/MobileMenuFooter.astro',
        ThemeProvider: './src/components/ThemeProvider.astro',
      },
      editLink: {
        baseUrl: 'https://github.com/toolsu/convnum/edit/main/docs/',
      },
      customCss: ['./src/styles/custom.css'],
      plugins: [
        starlightTypeDoc({
          entryPoints: ['../src/index.ts'],
          tsconfig: '../tsconfig.json',
          output: 'api',
          sidebar: { label: 'API Reference', collapsed: true },
          typeDoc: {
            // Overwrite in place: wiping the folder makes a running `astro dev` drop every API page.
            cleanOutputDir: false,
            categorizeByGroup: false,
            categoryOrder: [
              'Alphabet',
              'Date',
              'Bases',
              'Roman Numeral',
              'English Numeral',
              'French Numeral',
              'Chinese Numeral',
              'Astrological Sign',
              'Eastern Arabic Numeral',
              'Universal Converter',
              'Numeral Types',
              'Circular Numeral',
              'Package Related',
              '*',
            ],
            useCodeBlocks: true,
            parametersFormat: 'table',
            propertyMembersFormat: 'table',
            enumMembersFormat: 'table',
          },
        }),
      ],
      sidebar: [
        {
          label: 'Home',
          translations: { 'zh-CN': '首页', fr: 'Accueil' },
          slug: 'index',
        },
        {
          label: 'Interactive Tools',
          translations: { 'zh-CN': '交互工具', fr: 'Outils interactifs' },
          items: [
            {
              label: 'Numeral Converter',
              translations: { 'zh-CN': '数字转换器', fr: 'Convertisseur de nombres' },
              slug: 'tools/numeral-conversion',
            },
            {
              label: 'Sequence Generator',
              translations: { 'zh-CN': '序列生成器', fr: 'Générateur de séquences' },
              slug: 'tools/sequence-generator',
            },
          ],
        },
        {
          label: 'Range & Transform (VS Code)',
          translations: {
            'zh-CN': 'Range & Transform（VS Code 扩展）',
            fr: 'Range & Transform (VS Code)',
          },
          link: 'https://toolsu.com/range-transform/',
          attrs: { target: '_blank', rel: 'noopener' },
        },
        {
          ...typeDocSidebarGroup,
          translations: { 'zh-CN': 'API 参考', fr: 'Référence API' },
        },
      ],
    }),
  ],
})
