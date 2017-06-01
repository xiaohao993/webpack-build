const path = require('path'),
	  webpack = require('webpack'),
	  HtmlWebpackPlugin = require('html-webpack-plugin'),
	  ExtractTextPlugin = require('extract-text-webpack-plugin'),
	  CleanWebpackPlugin = require('clean-webpack-plugin'),
	  tinypngCompress = require('webpack-tinypng-compress');


const ENV = process.env.npm_lifecycle_event;

const tpKey = "x_6kBmY-hoXpd7Eg9CchBpFVVH5L9yIf";


const extractPlugin = new ExtractTextPlugin({
	filename:  (getPath) => {
		return getPath('css/[name].css').replace('css/js', 'css');
	},
	allChunks: true
});

const PATHS = {
	source: path.join(__dirname, 'src'),
	build: path.join(__dirname, 'build')
};

const chunksOrder = function(chunk1, chunk2){   // js/css 插入页面的顺序设定
	var order = ['base', 'index', 'blog'];
	var order1 = order.indexOf(chunk1.names[0]);
	var order2 = order.indexOf(chunk2.names[0]);
	return order1 - order2;
};


const config = {
	devtool: "source-map",  //配置生成Source Maps，选择合适的选项
	entry: {
		'base': PATHS.source + '/assets/js/base.js',          // 主体共享js
		'index': PATHS.source + '/pages/index/index.js',
		'blog': PATHS.source + '/pages/blog/blog.js'
	},
	output: {
		path: PATHS.build,
		filename: 'js/[name].js',
		//publicPath: PATHS.build
	},
	plugins: [
		new webpack.ProvidePlugin({   // 全局jquery
			$: 'jquery',
			jQuery: 'jquery'
		}),
		extractPlugin,
		new HtmlWebpackPlugin({
			filename: 'index.html',
			chunks: ['base', 'index'],
			template: PATHS.source + '/pages/index/index.html',
			inject: 'head',
			chunksSortMode: chunksOrder,
			showErrors: true,       // 是否将错误信息输出到html页面中
			hash: true 
		}),
		new HtmlWebpackPlugin({
			filename: 'blog.html',
			chunks: ['base', 'blog'],
			template: PATHS.source + '/pages/blog/blog.html',
			inject: 'head',
			chunksSortMode: chunksOrder,
			showErrors: true,       // 是否将错误信息输出到html页面中
			hash: true 
		}),
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['es2015'],
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(css|scss$)/,
				use: extractPlugin.extract({
					use: [{
						loader: 'css-loader'
					},{
						loader: 'postcss-loader',
						options: {
							plugins: [
								require('autoprefixer')(),
							]
						}
					},{
						loader: 'sass-loader'
					}],
				})
			},
			{
				test: /\.html$/,
				use: [{
					loader: 'html-loader',
					options: {
						minimize: false     // 是否压缩
					}
				}]
			},
			{
				test: /\.(jpng|png|gif|jpg|jpeg|svg)$/,
				use: [
					// {
					// 	loader: 'file-loader',
					// 	options: {
					// 		name: '[name].[ext]',
					// 		outputPath: 'img/',
					// 		publicPath: '../'
					// 	}
					// }

					{
						loader: "url-loader",
						options: {
							limit: 10000,
							name: '[name].[ext]',
							outputPath: 'img/',
							publicPath: '/build/'
						}
					}
				]
			}
		]
	},
	devServer: {
		stats: 'errors-only'
	}
}



// 编译环境判断
if(ENV === 'build'||ENV === 'build:prod'){
	config.plugins = config.plugins.concat([
		new tinypngCompress({
			key: tpKey,
			relativePath: PATHS.build + '/img'  //is relative path to output.puth 
		}),
		new CleanWebpackPlugin([PATHS.build])
	]);
	//console.log(config);
}




module.exports = config;

