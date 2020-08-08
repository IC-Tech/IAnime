/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {IAR} from 'ic-app'
import {top, bottom, comp_init, clean_search} from './comp.js'

class page extends IAR {
	constructor() {
		super()
		this.active = 0
		this.user = {
			login: false,
			avatar: '/images/default/avatar_op.jpg'
		}
		comp_init(a => this.update())
		this.core_load = a => {
			this.load(a)
		}
		this.core_unload = a => {
			clean_search()
			this.update()
			this.unload(a)
		}
	}
	load() {}
	unload() {}
	render() {
		return ([
			{t: 'div', cl: 'page-load-c', ch: [{t: 'div', cl: this._load ? 'page-load' : ['page-load', 'nope'], ch: [{t: 'div'}]}]},
			top(this.user),
			{t: 'main', at:[['id', 'main']], cl: 'content', ch: (this.content && this.content()) || []},
			bottom(),
		])
	}
}
export {page}
