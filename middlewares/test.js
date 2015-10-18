var fs = require('fs');
var obj = {
	name : 'Jason Cheng Qi Shen',
	experiences : [
		{
			name : 'Javascript'
		},
		{
			name : 'Angular JS'
		}
	],
	hobbies : {
		programming : [
			'C++',
			'Java',
			'Javascript'
		]
	},
	nested : {
		nestedKey1 : {
			nestedKey2 : {
				nestedKey3 : 'How are you?'
			}
		},
		nestedKeyA : {
			nestedKeyB : {
				nestedKeyC : 'I am fine thank you'
			}
		}
	}
};

var iterator = function (obj) {

	if (Object.prototype.toString.call(obj) === '[object Object]') {
		Object.keys(obj).forEach(function (key) {
			if (typeof obj[key] === 'string' || obj[key] instanceof String) {
				return obj[key] = obj[key].toUpperCase();
			}
			if (Object.prototype.toString.call(obj[key]) === '[object Object]' ||
				Object.prototype.toString.call(obj[key]) === '[object Array]') {
				return iterator(obj[key]);
			}
		});
		return;
	}
	if (Object.prototype.toString.call(obj) === '[object Array]') {
		obj.forEach(function (elem, index) {
			if (typeof elem === 'string' || elem instanceof String) {
				return obj[index] = obj[index].toUpperCase();
			}
			if (Object.prototype.toString.call(elem) === '[object Object]' ||
				Object.prototype.toString.call(elem) === '[object Array]') {
				return iterator(obj[index]);
			}
		});
		return;
	}

};

iterator(obj);

console.log(obj);

fs.writeFile('haha.txt', JSON.stringify(obj));