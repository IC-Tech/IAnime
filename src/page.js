/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {IAR, icApp} from 'ic-app'
import {top, bottom, comp_init, clean_search} from './comp'
import {TitleCase} from './comm'
import {render as render_error, close as close_error, com as com_error} from './error'

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
		com_error('update', a => this.update())
	}
	load() {}
	unload() {}
	closeNoti(a) {
		a = new icApp(a.target)
		for (var i = 0; i < 5; i++) {
			if(a.clc('err')) return close_error(a.d.id)
			else a = a.p
		}
	}
	render() {
		return ([
			{t: 'div', cl: 'page-load-c', ch: [{t: 'div', cl: this._load ? 'page-load' : ['page-load', 'nope'], ch: [{t: 'div'}]}]},
			{t: 'div', cl: 'notis-c', ch: [
				{t: 'div', cl: 'notis', ch: render_error().map(a => ({t: 'div', cl: ['notif', 'err', 's1'], d: {id: a.id}, at: {role: 'dialog', 'aria-label': TitleCase(a.title), 'aria-labelledby': TitleCase(a.title), 'aria-describedby': TitleCase(a.desc)}, ch: [
					{t: 'div', cl: 'ico', at: {title: 'Error', role: 'img'}, html: `<svg xmlns="http://www.w3.org/2000/svg" focusable="false" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>`},
					{t: 'div', cl: 'tit', at: {title: TitleCase(a.desc)}, txt: TitleCase(a.title)},
					{t: 'button', at: {title: 'Close'}, d: {id: a.id}, cl: 'btn', e: {onclick: this.closeNoti}, html: `<svg xmlns="http://www.w3.org/2000/svg" focusable="false" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"/></svg>`}
				]}))}
			]},
			top(this.user),
			{t: 'main', at:[['id', 'main']], cl: 'content', ch: (this.content && this.content()) || []},
			bottom(),
		])
	}
}
export {page}
