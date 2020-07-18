const API = API_SERVER || 'https://ianime.now.sh/api'
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
const ACreate = a => {
	var b = []
	for (var i = 0; i < a; i++) b.push(1)
	return b
}
const XHR = (url, call, op = {}, data = null) => {
	var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
	xhr.open(data || op.meth ? 'POST' : 'GET', url + (op.noNew ? '' : ((url.indexOf('?') >= 0 ? '&' : '?') + 't=' + new Date().getTime())))
	Object.keys(op.head ? op.head : {}).forEach(a => xhr.setRequestHeader(a, op.head[a]))
	xhr.onreadystatechange = () => {
		if (xhr.readyState == 4 && xhr.status != 0) {
			if(xhr.response) {
				var v
				try {
					v = op.raw ? xhr.response : JSON.parse(xhr.response)
				} catch(e) {
					//console.error('Server response error. (EC: 0xA2 >>> ' + e + ' <)', op.err ? op.err : undefined)
					call(null)
				}
				call(v)
			}
			else {
				//console.error('Server response error. (EC: 0xA1)', op.err ? op.err : undefined)
				call(null)
			}
		}
	}
	xhr.onerror = function (e) {
		if(e.target.status == 0) {
			//console.error("The Webpage can't connect to the server. Try again in a few moments.", op && op.err ? op.err : undefined)
			call(null)
		}
	}
	xhr.send(data)
}
const xhr = a => new Promise(_ => {
	var op = {}
	if(window.ic_token) op.head = {
		'x-ic-token': window.ic_token,
		'x-ic-analysis': 'IAnime-web, on'
	}
	XHR(a.indexOf('://') > 0 ? a : (API + '/' + a), a => _(a), op)
})
const pram = a => {
	a = (a = a || location.search).startsWith('?') ? a.substr(1) : a
	var b = {}
	var c = /(\?|&|^)([^]*?)=([^]*?)(?=$|#|&)/g
	var d
	while((d = c.exec(a))) b[d[2]] = d[3]
	return b
}
export {TitleCase, gtag, API, parentClass, num, ACreate, XHR, xhr, pram}
