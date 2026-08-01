import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'NeXT-Panel',
  tagline: 'Next generation proxy service management system',
  favicon: 'img/favicon.ico',
  url: 'https://nextpanel.dev',
  baseUrl: '/',
  organizationName: 'The-NeXT-Project',
  projectName: 'Docs',
  trailingSlash: false,
  onBrokenLinks: 'ignore',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'ignore',
    }
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/The-NeXT-Project/Docs',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      image: 'img/next.svg',
      navbar: {
        title: 'NeXT-Panel',
        logo: {
          alt: 'NeXT-Panel Logo',
          src: 'img/next-logo.svg',
        },
        items: [
          {
            to: '/docs',
            label: 'Docs',
            activeBasePath: 'docs/',
            position: 'left'
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'left'
          },
          {
            type: 'search',
            position: 'left'
          },
          {
            href: 'https://github.com/The-NeXT-Project/NeXT-Panel',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://discord.gg/A7uFKCvf8V',
            label: 'Discord',
            position: 'right',
          },
        ],
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      sitemap: {
        lastmod: 'date',
        changefreq: 'weekly',
        priority: 0.5,
        ignorePatterns: ['/tags/**'],
        filename: 'sitemap.xml',
        createSitemapItems: async (params) => {
          const {defaultCreateSitemapItems, ...rest} = params;
          const items = await defaultCreateSitemapItems(rest);
          return items.filter((item) => !item.url.includes('/page/'));
        },
      },
    }),

    plugins: [
      "@orama/plugin-docusaurus-v3"
    ],
};

export default config;
