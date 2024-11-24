function parseFunction(func) {
	var args = func.substring(func.indexOf('(') + 1, func.indexOf(')'));
	var content = func.substring(func.indexOf('{') + 1, func.lastIndexOf('}'));
	var data = args.split(',').map(function (str) { return str.trim(); });

	data.unshift(null);
	data.push(content);

	return new (Function.prototype.bind.apply(Function, data));
}