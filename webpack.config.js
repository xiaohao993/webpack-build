const path = require('path'),
	  webpack = require('webpack'),
	  HtmlWebpackPlugin = require('html-webpack-plugin'),
	  ExtractTextPlugin = require('extract-text-webpack-plugin'),
	  CleanWebpackPlugin = require('clean-webpack-plugin'),
	  tinypngCompress = require('webpack-tinypng-compress'),
	  utils = require('steamer-webpack-utils');


const ENV = process.env.npm_lifecycle_event;

const tpKey = "x_6kBmY-hoXpd7Eg9CchBpFVVH5L9yIf";


const extractPlugin = new ExtractTextPlugin({
	filename:  (getPath) => {
		return getPath('css/[name].css').replace('css/js', 'css');
	},
	allChunks: true
});

// ========================= webpack路径与url =========================
// 项目路径
const PATHS = {
	source: path.join(__dirname, 'src'),
	build: path.join(__dirname, 'build')
};

// const chunksOrder = function(chunk1, chunk2){   // js/css 插入页面的顺序设定
// 	var order = ['base', 'index', 'blog'];
// 	var order1 = order.indexOf(chunk1.names[0]);
// 	var order2 = order.indexOf(chunk2.names[0]);
// 	return order1 - order2;
// };

 
// 自动获取html模版  配置
const configCustom = {
	webpack: {
		html: utils.filterHtmlFileByCmd(utils.getHtmlEntry({
	        srcPath: path.join(PATHS.source, "pages"),
	        level: 1   // 0 表示在当前目录寻找，1 表示在下一级目录寻找
	    }))
	},
	getPlugins: function(){
		const plugins = [];
		var self = this;
		this.webpack.html.forEach(function(page, key) {
			const order = ['base'];
			order.push(page.key);
			//self.webpack['order'].push(page.key);
			plugins.push(new HtmlWebpackPlugin({
				filename: page.key + '.html',
				chunks: ['base', page.key],
				template: page.path,
				inject: 'head',
				chunksSortMode: function(chunk1, chunk2){   // js/css 插入页面的顺序设定
					var order1 = order.indexOf(chunk1.names[0]);
					var order2 = order.indexOf(chunk2.names[0]);
					return order1 - order2;
				},
				showErrors: true,       // 是否将错误信息输出到html页面中
				hash: true 
			}))
            // plugins.push(new HtmlResWebpackPlugin({
            //     mode: "html",
            //     filename: isProduction ? (config.webpack.path.distWebserver + "/" + page.key + ".html") : page.key + ".html",
            //     template: page.path,
            //     favicon: "src/favicon.ico",
            //     htmlMinify: null,
            //     entryLog: !key ? true : false,
            //     cssPublicPath: isProduction ? config.webpack.cssCdn : config.webpack.webserver,
            //     templateContent: function(tpl) {
            //         return tpl;
            //     }
            // }));
        }); 

        return plugins;
	}
}

// console.log(configCustom.getPlugins());

const config = {
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
		// new HtmlWebpackPlugin({
		// 	filename: 'index.html',
		// 	chunks: ['base', 'index'],
		// 	template: PATHS.source + '/pages/index/index.html',
		// 	inject: 'head',
		// 	chunksSortMode: chunksOrder,
		// 	showErrors: true,       // 是否将错误信息输出到html页面中
		// 	hash: true 
		// }),
		// new HtmlWebpackPlugin({
		// 	filename: 'blog.html',
		// 	chunks: ['base', 'blog'],
		// 	template: PATHS.source + '/pages/blog/blog.html',
		// 	inject: 'head',
		// 	chunksSortMode: chunksOrder,
		// 	showErrors: true,       // 是否将错误信息输出到html页面中
		// 	hash: true 
		// })
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['es2015', 'es2017'],
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(css|s(a|c)ss$)/,
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
						minimize: false,     // 是否压缩
					}
				}]
			},
			{
				test: /\.(png|gif|jpe?g|svg)$/i,
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
							limit: 1000,
							name: '[name].[ext]',
							outputPath: 'img/',
							publicPath: '../'
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
if(ENV === 'build:prod'){
	config.devtool = "source-map";  //配置生成Source Maps，选择合适的选项
	config.plugins = config.plugins.concat(configCustom.getPlugins(), [
		new tinypngCompress({
			key: tpKey,
			//relativePath: path.resolve(__dirname, 'build/img') //is relative path to output.puth 
			relativePath: PATHS.build + '/img'  //is relative path to output.puth 
		}),
		new CleanWebpackPlugin([PATHS.build])
	]);
}else{
	config.plugins = config.plugins.concat(configCustom.getPlugins());
}



module.exports = config;

