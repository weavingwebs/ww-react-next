import type { StorybookConfig } from '@storybook/react-webpack5';
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
    '@storybook/addon-storysource',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config, { configType }) => {
    if (!config.resolve) {
      config.resolve = {
        alias: {},
      };
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/router': 'next-router-mock',
      'next/router.js': 'next-router-mock',
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      zlib: false,
    };
    return config;
  },
};
export default config;
