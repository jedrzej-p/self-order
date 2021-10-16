const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .js('resources/js/bootstrap.js', 'public/js')
    .sass('resources/sass/styles.scss', 'public/css')
    .postCss("resources/css/app.css", "public/css", [
        require("tailwindcss"),
    ]);

if (mix.inProduction()) {
    mix.version();
    mix.sourceMaps();
}

mix.webpackConfig({
    resolve: {
        alias: {
            '@views': path.resolve(__dirname, 'resources/js/views'),
            '@components': path.resolve(__dirname, 'resources/js/components')
        },
    },
})
