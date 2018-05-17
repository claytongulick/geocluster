let node_externals = require('webpack-node-externals');
let path = require('path');
let node_config = {
    target: 'node',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'geocluster.node.js'
    },
    mode: 'development',
    externals: [node_externals()]
};

let web_config = {
    target: 'web', // <=== can be omitted as default is 'web'
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'geocluster.js'
    },
    module: {
        rules: [
            {
                test: /service/,
                use: 'null-loader'
            }
        ]
    },
    mode: 'development'

};

module.exports = [node_config, web_config];