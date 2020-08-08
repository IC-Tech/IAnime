/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import '../style/nope.scss'
import {meta_init} from '../meta'
import {page} from '../page'

class nope extends page {
	constructor() {
		super()
		this.name = 'nope'
	}
	load() {
		meta_init()
	}
	content() {
		return ([
			{t: 'span', cl: 'big-title', txt: '404'},
			{t: 'span', cl: 'title', txt: 'Page not found'},
		])
	}
}
export {nope}
