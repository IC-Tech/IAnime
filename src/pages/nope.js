/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import './nope.scss'
import {page} from '../page.js'

class nope extends page {
	constructor() {
		super()
		this.name = 'nope'
	}
	load() {}
	content() {
		return ([
			{t: 'span', cl: 'big-title', txt: '404'},
			{t: 'span', cl: 'title', txt: 'Page not found'},
		])
	}
}
export {nope}
