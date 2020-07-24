import {api2} from './comm.js'
const default_expire = 5 * 60 * 1000
var _data = {}
const eq = (a,b) => {
	if(typeof a != typeof b) return !1
	if(typeof a != 'object') return a == b
	var c = Object.keys(a), d = Object.keys(b)
	if(c.length != d.length || c.some(a => !d.some(b => a == b))) return !1
	return !c.some(c => !eq(a[c], b[c]))
}
const data = async (a,b,fresh) => {
	var c
	if(!fresh && _data[a]) {
		_data[a].some(a => {
			if((Date.now() - a.t) > default_expire) return 0
			if(!eq(a.req, b)) return 0
			c = a.res
		})
	}
	if(c) return c
	c = await api2(a, b)
	if(!c || !c.success) return c
	if(!_data[a]) _data[a] = []
	_data[a].push({
		req: b,
		res: c,
		t: Date.now()
	})
	return c
}

export {data}
