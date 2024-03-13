const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix
  .copy('src/**/*.html', 'dist/')
  .copyDirectory('src/assets', 'dist/assets')
  .js('src/scripts/app.js', 'dist/scripts/')
  .sass('src/styles/app.scss', 'styles/', { sassOptions: { outputStyle: 'expanded' } })
  .options({
    processCssUrls: false,
    autoprefixer: {
      options: {
        browsers: [
          'chrome <= 60, last 2 firefox versions, last 2 safari versions'
        ],
        grid: true
      }
    }
  })
  .sourceMaps()
  .setPublicPath('dist')
  .browserSync({
    proxy: false,
    server: 'dist',
    files: [
      'dist/**/*'
    ]
  })
  .webpackConfig({
    devtool: 'source-map',
    resolve: {
      modules: [
        'src/scripts',
        'node_modules'
      ]
    }
  })
  .disableSuccessNotifications();
