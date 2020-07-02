/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import '../icApp/icApp.js'
import {IAR} from '../icApp/icApp-render.js'
import {XHR, pram} from '../icApp/common.js'
import {top, bottom, comp_init} from './comp.js'
import {TitleCase, gtag} from './comm.js'
import {meta_init} from './meta.js'
import './episode.scss'

window.ic = window.ic || []
window.ic.pageLoad = Date.now()

document.addEventListener('DOMContentLoaded', () => {
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
		this.episode = {
			ep: '',
			name: '',
			image: '',
			anime: {
				title: '',
				image: '',
				description: ''
			},
			mirrors: []
		}
		if(window.IAnime.page_data && window.IAnime.page_data.episode) {
			this.episode = window.IAnime.page_data.episode
		}
		this.pageWait = 0
		this.perf = {
			page: 0
		}
		this.mirror = pram('mirror') || 0
		if(this.episode.mirrors.length <= this.mirror) this.mirror = 0
		;['goPage', 'next', 'pev', 'loadEp', 'mirSel', '_mirSel', 'mirSel2'].forEach(a => this[a] = this[a].bind(this))
		comp_init(a => this.update())
	}
	didMount() {
    console.log('icApp-render:speed - ' + (Date.now() - window.ic.pageLoad))

    gtag('event', 'timing_complete', {
		  name : 'icApp-render',
		  value : (Date.now() - window.ic.pageLoad),
		  event_category: 'render'
		})
    
    var _a
    meta_init(icApp, this.title = TitleCase(this.episode.parent.title + ' episode ' + this.episode.ep), ((_a = 'Watch ' + this.title + ' at IAnime - ' + this.episode.parent.description).length > 300 ? (_a.substr(0, 300) + '...') : _a), (_a = this.episode.image || '').startsWith('/') ? (location.origin + _a) : _a)
		this.update({ui: 1})
	}
	loadEp(a) {
		try {
			history.pushState({}, TitleCase(a.parent.title + ' episode ' + a.ep), a.web)
		} catch (e) { console.error(e) }

		gtag('event', 'timing_complete', {
		  name : 'goPage',
		  value : (Date.now() - this.perf.page),
		  event_category: 'XHR'
		})

		this.episode = a
		this.pageWait = 0
		this.update()
	}
	goPage(a) {
		this.pageWait = 1
		this.perf.page = Date.now()
		if(typeof a == 'string') {
			XHR(a, a => {
				if(!a.success) return
				this.loadEp(a.result)
			})
		}
	}
	next(a) {
		a.preventDefault()
		gtag('event', 'change episode', {
			event_label: 'next episode',
			event_category: 'selfLoad'
		})
		if(!this.pageWait && this.episode.next) this.goPage(this.episode.next.url)
		return false
	}
	pev(a) {
		a.preventDefault()
		gtag('event', 'change episode', {
			event_label: 'pev episode',
			event_category: 'selfLoad'
		})
		if(!this.pageWait && this.episode.previous) this.goPage(this.episode.previous.url)
		return false
	}
	_mirSel(a) {
		this.mirror = parseInt(a || '0') || 0
		gtag('event', 'change mirror')
		try {
			history.pushState({}, TitleCase(this.episode.parent.title + ' episode ' + this.episode.ep), this.episode.web + (this.mirror != 0 ? '?mirror=' + (this.mirror + 1) : ''))
		} catch (e) { console.error(e) }
		this.update()
	}
	mirSel(a) {
		a = new icApp.e(a.target).d
		if(a.ty != 'sel') return
		this._mirSel(a.in)
	}
	mirSel2(a) {
		this._mirSel(a.target.value)
	}
	didUpdate() {}
	willUpdate() {}
	render() {
		var mirr = this.episode.mirrors[this.mirror]
		return ([
			{s: {display: this.data.ui == 0 ? 'flex' : 'none'}},
			{s: {display: this.data.ui == 1 ? 'block' : 'none'}, t:'div', cl: 'main', ch: [
				top(this.user),
				{t: 'main', at:[['id', 'main']], cl: 'content', ch: [
					{t: 'span', cl: 'title', txt: TitleCase(this.episode.parent.title + ' episode ' + this.episode.ep)},
					{t: 'div', cl: 'watch', ch: [
						{t: 'span', cl: 'names', nodes: 1, ch: [
							{t: 'span', cl: 'title-b', txt: TitleCase('episode ' + this.episode.ep) + ' '},
							' ' + TitleCase(this.episode.name || '')
						]},
						mirr.watch ? ({t: 'iframe', at: [['src', mirr.watch], ['FRAMEBORDER', '0'], ['MARGINWIDTH', '0'], ['MARGINHEIGHT', '0'], ['SCROLLING', 'no']]}) : ({t: 'div', cl: 'red', s: {'background-image': `url(${this.episode.image || this.episode.parent.poster || '/images/default/poster_2.jpg'})`}, ch: [
							{t: 'a', at: [['href', mirr.url]], ch: [{t: 'div', cl: 'btn', html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M371.7 238l-176-107c-15.8-8.8-35.7 2.5-35.7 21v208c0 18.4 19.8 29.8 35.7 21l176-101c16.4-9.1 16.4-32.8 0-42zM504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256z"/></svg>'}]},
						]}),
						{t: 'div', cl: 'mir', ch: [
							{t: 'div', cl: 'wrp', ch: [
								{t: 'a', cl: this.episode.previous ? 'c0' : 'nope', at: [['href', this.episode.previous && this.episode.previous.web || '']], e: [['onclick', this.pev]], txt: 'Previous'}
							]},
							{t: 'div', cl: 'wrp', ch: [
								{t: 'span', txt: 'Mirrors: '},
								/*
								android select element cooler than this
								{t: 'label', cl: 'select', ch: [
									{t: 'input', at: [['type', 'checkbox']]},
									{t: 'span', cl: 'val', txt: (this.mirror <= 10 ? '0' : '') + (this.mirror + 1) + '. ' + TitleCase(this.episode.mirrors[this.mirror].url.match(/(\w+)[^w](?=\.)/gi)[0] || 'Unknown')},
									{t: 'div', cl: 'op', ch: this.episode.mirrors.map((a,b) => (++b < 10 ? '0' : '') + b + '. ' + TitleCase((a = a.url.match(/(\w+)[^w](?=\.)/gi)) ? a[0] : 'Unknown')).map((a,b) => ({t: 'span', d: {ty: 'sel', in: b}, txt: a, e: [['onclick', this.mirSel]]}))}
								]}
								*/
								{t: 'select', e: [['onchange', this.mirSel2]], ch: this.episode.mirrors.map((a,b) => ({t: 'option', at: [['value', b.toString()]], txt: TitleCase((a = (a.watch || a.url).match(/(\w+)[^w](?=\.)/gi)) ? a[0] : 'Unknown')}))}
							]},
							{t: 'div', cl: 'wrp', ch: [
								{t: 'a', cl: this.episode.next ? 'c0' : 'nope', at: [['href', this.episode.next && this.episode.next.web || '']], e: [['onclick', this.next]], txt: 'Next'}
							]},
						]}
					]},
					/*{t: 'div', cl: 'ani-s', ch: [*/
					{t: 'div', cl: 'ani', ch: [
						{t: 'div', cl: 'ani-l', ch: [
							{t: 'a', at: [['href', this.episode.parent.web]], cl: 'image', s: {'background-image': `url(${this.episode.parent.poster || '/images/default/poster_2.jpg'})`}},
						]},
						{t: 'div', cl: 'ani-r', ch: [
							{t: 'a', cl: 'name', at: [['href', this.episode.parent.web]], at: [['href', this.episode.parent.web]], txt: TitleCase(this.episode.parent.title)},
							{t: 'span', cl: 'des', txt: this.episode.parent.description}
						]}
					]},
					//]}
					{t: 'div', cl: 'shadow'}
				]},
				bottom()
			]}
		])
	}
}
new IAnime().mount(_root_.v)
})
