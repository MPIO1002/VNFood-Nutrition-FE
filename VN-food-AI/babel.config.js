module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // jsxImportSource is required by NativeWind v4 so className prop works
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
