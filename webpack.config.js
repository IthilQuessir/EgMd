var webpack = require('webpack');
var path = require("path");

module.exports = {
    entry: {
        md: './src/md.es6',
        "md-full": './src/dialects/office.es6'
    },
    output: {
        path: 'dist/',
        filename: '[name]-browser.js'
    },
    module: {
        loaders: [{
                test: /\.es6$/,
                include: [
                    // path.resolve(__dirname, 'src'),
                    require.resolve("./src/md.es6"),
                    require.resolve("./src/dialects/office.es6"),
                ],
                loader: "expose?Md!babel"
            },

            {
                test: /\.es6$/,
                exclude: /(node_modules|bower_components)/,
                include: [
                    // path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'src/lib'),
                    path.resolve(__dirname, 'src/dialects')
                ],
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    plugins: [
                        "transform-runtime",
                        "transform-es2015-classes"
                    ]

                }
            },

            {
                test: /\.css$/,
                loader: 'style!css'
            }, {
                test: /\.scss$/,
                loader: 'style!css!sass'
            }
        ]
    },

    resolve: {
        extensions: ['', '.js', '.es6', '.scss']
    }

    // , devtool: "source-map"

};
