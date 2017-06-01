
执行步骤： 

npm install

npm run build:prod        // webpack -p  最终压缩整合

npm start    // 启动热加载 (手动打开 http://localhost:8080/ )




http://www.css88.com/doc/webpack2/loaders/css-loader/

webpack2.2 中文文档


1. css,js 压缩合并(js,css分模版压缩)
2. 图片tinypng压缩
3. 图片少于10k以base64载入



=======================

参考项目： https://github.com/AlloyTeam/omi-cli/blob/master/template/app/config/project.js


2017-6-1        自动获取html模版

steamer-webpack-utils 

getHtmlEntry
自动获取 html 文件
参数 {Object}
option.srcPath {String} 包含有 html 文件的目录
option.level {Integer} 0 表示在当前目录寻找，1 表示在下一级目录寻找
options.keyType {String} 返回 key 值的类型， 默认 folderName (用父文件夹名作 key), 其它值 fileName(用文件名作为 key)


const configCustom = {
	webpack: {
		html: utils.filterHtmlFileByCmd(utils.getHtmlEntry({
	        srcPath: path.join(PATHS.source, "pages"),
	        level: 1
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



手动建页面(旧的)
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



=======================





















