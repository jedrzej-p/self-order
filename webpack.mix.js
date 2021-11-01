const mix = require("laravel-mix");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.webpackConfig({
    resolve: {
        alias: {
            vue$: "vue/dist/vue.esm.js",
            "@": __dirname + "/resources/js",
        },
    },
});

mix.disableNotifications();

if (mix.inProduction()) {
    mix.version();
}

mix.js("resources/js/app.js", "public/js").extract(["axios", "bootstrap", "es6-promise", "jquery", "lodash", "moment", "popper.js", "quill", "v-autocomplete", "vue", "vue-quill-editor", "vue-router", "vuex"]).sass("resources/sass/app.scss", "public/css").copy("public/css/app.css", "public/offline/css/app.css");
