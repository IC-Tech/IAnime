/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {data} from './data'

const version = '1b', prefix = 'ianime-auth-' + version + '-', gt = a => JSON.parse(localStorage.getItem(prefix + a)), del = a => localStorage.removeItem(prefix + a), st = (a, b) => localStorage.setItem(prefix + a, JSON.stringify(b))
var _ = {
	update: a => -1,
	token: (gt('token') || {}).token, user: gt('user')
}
const logout = async a => {
	data('user:logout', {token: _.token}, 1, e => 1)
	;['token', 'user', 'update'].forEach(a => del(a))
}
const setToken = async a => {
	logout()
	st('token', {token: _.token = a})
	a = await data('user:me', {token:_.token})
	if(!a.success) return
	st('user', a.result)
}
const com = (a,b,c=0) => {
	if(!c) _[a] = b
	return _[a]
}
const token = a => _.token
const user = a => _.user
const getuser = async (a={}) => {
	if(!a.id) a.me = 1
	var b = await data(a.me ? 'user:me' : 'user:profile', {id: a.id, token: _.token})
	if(!b.success) return null
	if(b.self) {
		st('user', _.user = b.result)
		_.update()
	}
	return b.result
}

export {logout, setToken, token, user, getuser, com}
