/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import '../icApp/icApp.js'
import {IAR} from '../icApp/icApp-render.js'
import {top, bottom,comp_init} from './comp.js'
//import './main.scss'

//I will add loading UI and others to here
//this is just a placeholder
class page extends IAR {
	constructor() {
		super()
		this.active = 0
		this.user = {
			login: false,
			avatar: '/images/default/avatar_op.jpg'
		}
		comp_init(a => this.update())
	}
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
