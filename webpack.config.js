const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

let _root = path.resolve(__dirname, '.');

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [_root].concat(args));
}


module.exports = {
    entry: {
        background: './background.ts',
        content_operaciones: './content_operaciones.ts'
    },

    //devtool: 'source-map',
    mode: 'development',


    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loaders: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ["dist", "dist_edge"]}),
        new CopyWebpackPlugin({patterns: [
            'manifest.json', 'iconos/**.*'
        ]}),

    ]
}