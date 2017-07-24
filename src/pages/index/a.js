export class a{
    static b(){

		var arr1=['a','b','c'];
		var arr2=[...arr1,'d','e'];
		console.log(arr2);

		var mySymbol = Symbol();

		var a = {};
		Object.defineProperty(a, mySymbol, { value: 'Hello!' });
		console.log(a[mySymbol]);

		// let s = Symbol();

		// let obj = {
		//   [s]: function (arg) { 
		//   	console.log(arg);
		//   }
		// };

		// obj[s](123);
		// console.log(obj);


		var obj = {};
		var a = Symbol('a');
		var b = Symbol('b');

		obj[a] = 'Hello';
		obj[b] = 'World';
		console.log(obj);

		const s = new Set();
		[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));
		for (let i of s) {
		  console.log(i);
		}
		console.log(s);

		// 注意，Symbol 值作为对象属性名时，不能用点运算符。

		// es2017 将实现的功能
		// let z = { a: 3, b: 4 };
		// let n = { ...z };
		// console.log(n);
    	// let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
    	// console.log(x, y, z);
        return 'B';
    }

    static c(min, max){
        return min + max;
    }

    static imgload (){

		const preloadImage = function (path) {
		  return new Promise(function (resolve, reject) {
		    var image = new Image();
		    image.onload  = resolve;
		    image.onerror = reject;
		    image.src = path;
		  });
		};


		var promises = ['../img/kv1.jpg', '../img/logo.png'].map(function (id) {
			console.log(id);
		    return preloadImage(id);
		});

		Promise.all(promises).then(function (posts) {
			console.log(posts);
		}).catch(function(reason){
			console.log('error', reason);
		});

    }
  
}


export class MyMatcher{
	[Symbol.match](string) {
	    return 'hello world'.indexOf(string);
	}
}

class MySearch {
  constructor(value) {
    this.value = value;
  }
  [Symbol.search](string) {
    return string.indexOf(this.value);
  }
}


module.exports = {
    a: a,
    MyMatcher: MyMatcher,
    MySearch: MySearch
}

