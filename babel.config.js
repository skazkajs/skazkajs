module.exports = (api) => {
  api.cache(false);

  return {
    presets: [
      [
        '@babel/preset-env', {
          useBuiltIns: 'entry',
          targets: {
            node: '8.10',
          },
          corejs: '2',
        },
      ],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-syntax-dynamic-import',
    ],
    env: {
      development: {
        plugins: ['react-hot-loader/babel'],
      },
    },
  };
};
