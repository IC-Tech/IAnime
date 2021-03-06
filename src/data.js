import {api3} from './comm'
import {error} from './error'

const default_expire = 5 * 60 * 1000
var _data = {}
if(window.IAnime && window.IAnime.data && typeof window.IAnime.data == 'string') {
	try {
	JSON.parse(decodeURIComponent(atob(window.IAnime.data))).forEach(a => {
		_data[a.q] = _data[a.q] || []
		_data[a.q].push({
			req: a.req,
			res: a.res,
			t: Date.now()
		})
	})
	}
	catch(e) {console.error(e)}
}
const eq = (a,b) => {
	if(typeof a != typeof b) return !1
	if(typeof a != 'object') return a == b
	var c = Object.keys(a), d = Object.keys(b)
	if(c.length != d.length || c.some(a => !d.some(b => a == b))) return !1
	return !c.some(c => !eq(a[c], b[c]))
}
const data = async (a,b,fresh, err) => {
	var c
	if(!fresh && _data[a]) _data[a].sort((a,b) => b.t - a.t).some(a => !a || (Date.now() - a.t) > default_expire || !eq(a.req, b) ? 0 : [c = a.res])
	if(c) return c
	c = await api3(a, b)
	if(!c || !c.success) {
		if(!err || !err(c.error)) error(c && c.error)
		return c
	}
	if(!_data[a]) _data[a] = []
	_data[a].push({
		req: b,
		res: c,
		t: Date.now()
	})
	return c
}

export {data}
