module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    proxy: {
      '^/api/': {
        target: 'https://nane.tada.team',
        pathRewrite: { '^/api/': '/api/' },
        changeOrigin: true,
        logLevel: 'debug',
      },
    },
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/nane-test/'
    : '/',
};
