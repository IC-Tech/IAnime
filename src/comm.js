const API = API_SERVER || 'https://ianime.now.sh/api'
const TitleCase = (a,b=1) => a ? a.replace(/([^a-zA-Z]|^)(iii|ii|vii|iv|vi|tv|ova|ona|pg)([^a-zA-Z]|$)/gi, _ => _.toUpperCase()).replace(/([^0-9a-zA-Z']|^|[^a-zA-Z]')([a-z])/g, (_, a, b) => a + b.toUpperCase()) : a
const num = a => {
	a = typeof a == 'string' ? a : a.toString()
	var b = parseInt(a.length / 3)
	var c = []
	for (var i = 0; i < b; i++) {
		c.push(a.substr(a.length - 3, 3))
		console.log(c)
		a = a.substr(0, a.length - 3)
	}
	return (a ? c.concat(a) : c).reverse().join(',')
}
window.IAnime = window.IAnime || {}
window.dataLayer=window.dataLayer||[];
function gtag(){window.dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config',window.GT_ID);
const parentClass = (a, b) => {
	while(a.v && !a.clc(b)) {
		a = a.p
		if(a.v && a.clc('main')) return 0
	}
	return a.v && a.clc(b)
}
export {TitleCase, gtag, API, parentClass, num}
