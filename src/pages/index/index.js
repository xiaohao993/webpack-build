require('./index.css');

import { a, MyMatcher, MySearch } from './a';

console.log(a);
console.log(a.b());
console.log('test');
console.log($);
console.log('e'.match(new MyMatcher()));
console.log('foobar'.search(new MySearch('foo')));

a.imgload();



//alert('test');