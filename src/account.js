/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {data} from './data'

const version = '1b', prefix = 'ianime-auth-' + version + '-', gt = a => JSON.parse(localStorage.getItem(prefix + a)), del = a => localStorage.removeItem(prefix + a), st = (a, b) => localStorage.setItem(prefix + a, JSON.stringify(b))
var _ = {
	update: a => -1,
	token: (gt('token') || {}).token, user: gt('user')
}
const logout = async a => {
	data('user:logout', {token: _.token}, 1, e => 1)
	;['token', 'user'].forEach(a => {
		del(a)
		_[a] = null
	})
	_.update()
}
const setToken = async a => {
	logout()
	st('token', {token: _.token = a})
	a = await data('user:me', {token:_.token})
	if(!a.success) return
	st('user', _.user = a.result)
}
const com = (a,b,c=0) => {
	if(!c) _[a] = b
	return _[a]
}
const token = a => _.token
const user = a => _.user
const getuser = async (a={}) => {
	if(typeof a == 'string') a = parseInt(a)
	if(typeof a == 'number') a = {id: a}
	if(!a.id) a.me = 1
	if(a.me && !_.token) return null
	const err = e => {
		if(a.me || (_.user && a.id == _.user.id)) {
			if(e.code == 404) {
				logout()
				location.reload()
				return 1
			}
		}
	}
	var b = await data(a.me ? 'user:me' : 'user:profile', {id: a.id, token: _.token}, 0, err)
	if(!b.success) return null
	if((b = b.result).self) {
		st('user', _.user = b)
		_.update()
	}
	return b
}

export {logout, setToken, token, user, getuser, com}
