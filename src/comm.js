import {XHR} from 'ic-app'
const API = config.api
const TitleCase = (a,b=1) => a ? a.replace(/([^a-zA-Z]|^)(iii|ii|vii|iv|vi|tv|ova|ona|pg)([^a-zA-Z]|$)/gi, _ => _.toUpperCase()).replace(/([^0-9a-zA-Z']|^|[^a-zA-Z]')([a-z])/g, (_, a, b) => a + b.toUpperCase()) : a
const num = a => {
	a = typeof a == 'string' ? a : a.toString()
	var b = parseInt(a.length / 3)
	var c = []
	for (var i = 0; i < b; i++) {
		c.push(a.substr(a.length - 3, 3))
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
const ACreate = (a,c=1) => {
	var b = []
	for (var i = 0; i < a; i++) b.push(c)
	return b
}
const cr = b => {
	var a = new Array(8).map((a,b,c) => c.length - b)
	for (var i = 0; i < b.length; i++) {
		var c = a[i % a.length]
		a[i % a.length] = ((b.charCodeAt(i) | (c << 6) + (c << 16)) & 0xff)
	}
	return a.map(a => a.toString(16).padStart(2, '0')).join('')
}
const api3 = (a,b) => new Promise(async _ => {
	b = b || {}
	if(typeof b == 'string') b = {id: b}
	var t = [window.ic_token, window.ic_token && cr(window.ic_token)].filter(a => a)
	var op = {
		meth: 'POST',
		head: {
			'x-ic-token': t[0],
			'x-ic-s-token': t[1],
			'x-ic-analysis': 'IAnime-web, ' + (navigator.doNotTrack == '1' ? 'off' : 'on'),
			'content-type': 'text/json',
			'accept': 'text/json'
		}
	}
	if(navigator.doNotTrack != '1') op.head['x-ic-analysis-url'] = location.href
	XHR(API + '/v3/endpoint', _, op, JSON.stringify(Object.assign({query: a}, b)))
})
const pro = async a => {
	var b = [], c = async i => b[i] = await a[i]
	await Promise.all(a.map((a,i) => c(i)))
	return b
}
export {TitleCase, gtag, API, parentClass, num, ACreate, api3, pro}
