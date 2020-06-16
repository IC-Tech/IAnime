/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import '../icApp/icApp.js'
import {IAR} from '../icApp/icApp-render.js'
import {top, bottom, comp_init} from './comp.js'
import {gtag} from './comm.js'
import {meta_init, title} from './meta.js'
import './comm_p1.scss'

window.ic = window.ic || []
window.ic.pageLoad = Date.now()

const comm = (data, op) => {
op = op || {}
let icApp = ic.icApp
var _root_ = new icApp.e('#root')
;['name="theme-color"', 'name="msapplication-navbutton-color"', 'name="apple-mobile-web-app-status-bar-style"'].forEach(a => new icApp.e(`[${a}]`).sa('content', '#171b22'))

window.IAnime = window.IAnime || {}

class IAnime extends IAR {
	constructor() {
		super()
		this.data = {
			ui: 0
		}
		this.user = {
			login: false,
			avatar: '/images/default/avatar_op.jpg'
		}
		this.pageWait = 0
		comp_init(a => this.update())
		meta_init(icApp)
	}
	didMount() {
    console.log('icApp-render:speed - ' + (Date.now() - window.ic.pageLoad))
    if(op.title) title(op.title)
    gtag('event', 'timing_complete', {
		  name : 'icApp-render',
		  value : (Date.now() - window.ic.pageLoad),
		  event_category: 'render'
		})
		this.update({ui: 1})
	}
	didUpdate() {}
	willUpdate() {}
	render() {
		return ([
			{s: {display: this.data.ui == 0 ? 'flex' : 'none'}},
			{s: {display: this.data.ui == 1 ? 'block' : 'none'}, t:'div', cl: 'main', ch: [
				top(this.user),
				{t: 'main', at:[['id', 'main']], cl: 'content', ch: [
					{t: 'div', cl: 'cent', ch: data}
				]},
				bottom()
			]}
		])
	}
}
new IAnime().mount(_root_.v)
}

export default comm
