'use strict';
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
    //默认false，也就是不开启
    watch: true,
    //只有开启监听模式，配置才有作用
    watchOptions: {
        //默认为空，不监听的文件或者文件夹，支持正则匹配
        ignored: /node_modules/,
        //监听到变化后会等300ms再去执行，默认300ms
        aggregateTimeout: 300,
        //判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒问1000次
        poll: 1000
    },
    entry: {
        index: './src/index.js',
        search: './src/search.js'
    }, //打包文件路径
    output: {
        path: path.join(__dirname, 'dist'), //输出文件路径
        filename: '[name]_[chunkhash:8].js' //输出文件名
    },
    mode: 'production',
    module: {
        rules: [{
                test: /.js$/,
                use: 'babel-loader'
            },
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ]
            },
            {
                test: /.less$/,
                user: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')({
                                    browsers: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                           renUnit:75,
                           remPrecesion:8
                        }
                    }
                ]
            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                user: 'file-loader',
                options: {
                    name: '[name]_[hash:8].[ext] '
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                user: 'file-loader',
                options: {
                    name: '[name]_[hash:8].[ext] '
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `[name][contenthash:8].css`
        }),
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new HtmlWebpackPlugin({
            //需要压缩的文件模板
            template: path.join(__dirname, 'src/search.html'),
            //压缩后的文件名
            filename: 'search.html',
            //chunk
            chunks: ['search'],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        }),
        new CleanWebpackPlugin()
    ],
};