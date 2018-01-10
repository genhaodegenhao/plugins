var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var vConsolePlugin = require('vconsole-webpack-plugin')

console.log('---------------------package params:-----------------------')
console.log('NODE_ENV=' + process.env.NODE_ENV + ', SHOW_VCONSOLE=' + process.env.SHOW_VCONSOLE)
console.log('----------------------------------------------------------')

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'app/index.jsx'),
        contract: path.resolve(__dirname, 'app/contract.jsx'),
        vendor: [
            'react',
            'react-dom',
            'es6-promise',
            'whatwg-fetch'
        ]
    },
    output: {
        path: __dirname + "/dist",
        filename: "[name].[chunkhash:8].js",
        //publicPath: '/'
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react', 'stage-3']
                }
            },
            {
                test: /\.(scss|css)?$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpg|jpeg|gif|bmp|png|webp)?$/i,
                exclude: /(node_modules|bower_components)/,
                loader: 'file-loader'
            },
            {
                test: /\.(woff|woff2|svg|ttf|eot)?$/i,
                exclude: /(node_modules|bower_components)/,
                loader: 'file-loader'
            }
        ]
    },

    plugins: [
        new webpack.BannerPlugin("Copyright by 99bill.com"),

        new HtmlWebpackPlugin({
            title: '无忧保',
            template: __dirname + '/app/index.tmpl.html',
            filename: 'index.html',
            chunks: ['index', 'vendor']
        }),

        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                //supresses warnings, usually from module minification
                warnings: false
            }
        }),

        new ExtractTextPlugin('[name].[chunkhash:8].css'),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: '[name].[chunkhash:8].js'
        }),

        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false')),
            __CONSOLE__: true
        }),

        new CopyWebpackPlugin([
            {
                from: 'www/static/scripts/flexible.js',
                to: 'static/scripts'
            },
            {
                from: 'www/static/scripts/kuaiqian-2.1.0.min.js',
                to: 'static/scripts'
            }
        ]),

        new vConsolePlugin({
            enable: true
        })

    ]


}