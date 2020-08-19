/* Copyright © 2020, Imesh Chamara. All rights reserved. */
var _ = {
	errors: []
}
/*
 * [concept] [incomplete feature]
 * This function should calulate error danger levels.
 * I d0n't h@ve @ny !dea ab0ut h0w t0 m@ke th!s n0w.
 */
const errorDeterminer = a => 1
/*
 * [concept] [incomplete feature]
 * This function gives more information about the error.
 * I d0n't h@ve @ny !dea ab0ut h0w t0 m@ke th!s n0w.
 */
const errorDescriber = a => `Error ${a.code}, ${a.message}`
/*
 * [concept] [incomplete feature]
 * This function should automatically take actions to fix the errors.
 * I d0n't h@ve @ny !dea ab0ut h0w t0 m@ke th!s n0w.
 */
const errorAc = a => 1

const render = a => _.errors.filter(a => !a.noPublic && a.error && a.error.message).map((a,i) => ({
	id: a.time.getTime() + '~' + i,
	title: a.error.message,
	level: errorDeterminer(a.error),
	desc: errorDescriber(a.error)
}))
const close = a => {
	var c, d = a.split('~').map(a => parseInt(a))
	if(_.errors.some((b,i) => d[0] == b.time.getTime() && i == d[1] ? [c = i] : 0)) delete _.errors[c]
	if(_.update) _.update()
}
const error = a => {
	errorAc(a = a || {code: 9, message: 'undefined error'}, _.errors.push({time: new Date(), error: a}) - 1)
	if(_.update) _.update()
	return a
}
const com = (a,b,c=0) => {
	if(!c) _[a] = b
	return _[a]
}

export {error, close, render, com}
