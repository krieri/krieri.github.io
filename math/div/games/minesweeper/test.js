var a = new Array(3)
for (var i = 0; i < a.length; i++) {
	a[i] = i;
}

f = function(x) {
	var b = x.slice(0);
	for (var i = 0; i < b.length; i++) {
		b[i] = i*2;
	}
	return b;
}

var c = f(a);