module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'src/index.js',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
