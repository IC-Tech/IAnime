/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import '../icApp/icApp.js'
import {IAR} from '../icApp/icApp-render.js'
import {top, bottom, comp_init, AniUI, EpUI, serEv0} from './comp.js'
import {TitleCase, gtag} from './comm.js'
import './style.scss'

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
		this.pageWait = 0
		this.perf = {
			page: 0
		}
		this.sli = [
			{perdotw: 0, dots: 0, pos: 0, perdot: 0}
		]
		this.sli_ce = (a => {
			var c = a.target.nodeName.toLowerCase() == 'button'
			var b = {
				in: parseInt(c ? new icApp.e(a.target).p.p.d.in : new icApp.e(a.target).p.p.p.d.in),
				p: 0
			}
			if(b.in >= 0) {
				a.preventDefault()
				a = a.target
				if(!c) a = a.parentElement
			}
			else return
			while(a.previousElementSibling) {
				a = a.previousElementSibling
				b.p++
			}
			this.sli[b.in].pos = b.p
			this.update()
			return !!0
		}).bind(this)
		this.sli_e = (a => {
			var c = (a,c,d) => {
				var b = d>=0 ? d : a.offsetWidth
				a = window.getComputedStyle(a)
				c.forEach(c => b += parseInt(a.getPropertyValue(c).split(/[^0-9]/g)[0]))
				return b
			}
			a = Array.from(icApp.qsa('.sli-c[data-in]')).map(a => [a, parseInt(a.dataset.in)]).filter(a => a[1] >= 0).forEach(a => {
				var b = icApp.ds({ty: 'sli', in: a[1]})
				b = {
					cont: a[0].offsetWidth,
					count: (b = new icApp.e(b.chn[0]).chn).length,
					w0: c(b[0], [/*'padding-left', 'padding-right', */'margin-left']),
					w1: c(b[0], ['margin-right'], 0),
					pos: 0
				}
				b.w = b.w0 + b.w1
				b.perdot = parseInt(b.cont / b.w)
				b.dots = parseInt(b.count / b.perdot)
				if((b.count / b.perdot) != b.dots) {
					b.dots++
				}
				b.perdotw = b.w * b.perdot
				b.limit = ((b.perdot * (b.dots - 1) * b.w) - ((b.cont - (b.perdot * b.w)) + (((b.perdot * b.dots) - b.count) * b.w))) * -1
				this.sli[a[1]] = b
			})
			this.update()
		}).bind(this)
		this.sli_ui = (a, b) => ({t: 'div', cl: 'sli-c', d: {in: a, ty: 'sli'}, ch: [
			{t: 'div', cl: 'sli-li', s: {'margin-left': (((a = this.sli[a] || {pos: 0, perdotw: 0, pos: 0}).v = (a.pos * a.perdotw * -1)) < a.limit ? a.limit : a.v) + 'px'}, ch: b},
			{t: 'div', cl: 'sli-dots', e: [['onclick', this.sli_ce]], ch: ((a,c) => {
				var b = []
				for (var i = 0; i < a; i++) b.push({t: 'button', cl: c == i ? ['sli-dot', 'sel'] : 'sli-dot', ch: [
					{t: 'span', txt: ''}
				]})
				return b
			})(a.dots, a.pos)}
		]})
		this.recent = []
		this.newest = []
		this.eps = []
		this.rand = parseInt(Math.random() * 10) + 1
		if(window.IAnime.page_data && window.IAnime.page_data.recent) {
			this.recent = window.IAnime.page_data.recent.map(a => {
				a.d_year = a.year
				return a
			})
		}
		if(window.IAnime.page_data && window.IAnime.page_data.newest) {
			this.newest = window.IAnime.page_data.newest.map(a => {
				a.d_year = a.year
				return a
			})
		}
		if(window.IAnime.page_data && window.IAnime.page_data.eps) {
			this.eps = window.IAnime.page_data.eps
		}
		comp_init(a => this.update())
	}
	didMount() {
    console.log('icApp-render:speed - ' + (Date.now() - window.ic.pageLoad))

    gtag('event', 'timing_complete', {
		  name: 'icApp-render',
		  value: (Date.now() - window.ic.pageLoad),
		  event_category: 'render'
		})
		this.ine = new icApp.e('form input')
		window.addEventListener('resize', this.sli_e)
		window.addEventListener('resize', a => this.update())
		this.update({ui: 1})
		this.sli_e()
	}
	didUpdate() {}
	willUpdate() {}
	render() {
		var a = [
			this.recent,
			this.eps,
			this.newest
		]
		if(document.body.offsetWidth < 640) {
			a = a.map(a => a.slice(0, Math.ceil(a.length / 3 * 1)))
		}
		return ([
			{s: {display: this.data.ui == 0 ? 'flex' : 'none'}},
			{s: {display: this.data.ui == 1 ? 'block' : 'none'}, t:'div', cl: 'main', ch: [
				top(this.user),
				{t: 'main', at:[['id', 'main']], cl: 'content', ch: [
					{t: 'div', cl: 'li', ch: [
						{t: 'span', cl: 'title', txt: 'Recently Added Animes'},
						this.sli_ui(0, a[0].map(a => AniUI(a))),
					]},
					{t: 'div', cl: 'li', ch: [
						{t: 'span', cl: 'title', txt: 'Recently Added Episodes'},
						this.sli_ui(1, a[1].map(a => EpUI(a, a.parent, a.parent.title))),
					]},
					{t: 'div', cl: 'li', ch: [
						{t: 'span', cl: 'title', txt: 'Newest Animes'},
						this.sli_ui(2, a[2].map(a => AniUI(a))),
					]},
					{t: 'div', cl: ['more', 'li'], ch: [
						{t:'a', at: [['href', '/search']], ch: [
							{t: 'span', txt: 'Browse More'}
						]}
					]},
					{t: 'div', cl: ['rand', 'li'], ch: [
						{t: 'span', cl: 'title', txt: 'Random Select'},
						{t: 'div', cl: 'rand-ce', ch: [
							{t: 'a', at: [['href', '/random']], cl: 'rand-c', ch: [
								{t: 'div', cl: 'img', s: {'background-image': `url("/images/default/Artboard-${this.rand.toString()}.jpg")`}},
								{t: 'div', cl: 'cli', html: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path d="M374.2,308c-21.9,33.5-46.8,83.3-74.9,149.3c-8-16.4-14.8-29.6-20.2-39.6c-5.5-10-12.9-21.6-22.1-34.7s-18.6-23.4-27.9-30.9c-9.3-7.5-20.8-13.9-34.5-19.1c-13.7-5.3-28.5-7.9-44.6-7.9H27.5c-5.1,0-9.3-1.6-12.6-4.9c-3.3-3.3-4.9-7.5-4.9-12.6v-105c0-5.1,1.6-9.3,4.9-12.6c3.3-3.3,7.5-4.9,12.6-4.9H150C241.1,185,315.9,226,374.2,308L374.2,308z M990,745c0,5.1-1.6,9.3-4.9,12.6l-175,175c-3.3,3.3-7.5,4.9-12.6,4.9c-4.7,0-8.8-1.7-12.3-5.2c-3.5-3.5-5.2-7.6-5.2-12.3V815c-11.7,0-27.2,0.1-46.5,0.3c-19.3,0.2-34.1,0.4-44.3,0.5c-10.2,0.2-23.5,0-39.9-0.5c-16.4-0.5-29.3-1.5-38.8-2.7s-21.1-3.2-35-5.7c-13.9-2.6-25.3-5.9-34.5-10.1c-9.1-4.2-19.7-9.4-31.7-15.6c-12-6.2-22.8-13.5-32.3-21.9c-9.5-8.4-19.5-18.1-30.1-29.3c-10.6-11.1-20.8-23.8-30.6-38c21.5-33.9,46.3-83.7,74.4-149.3c8,16.4,14.8,29.6,20.2,39.6c5.5,10,12.9,21.6,22.1,34.7c9.3,13.1,18.6,23.4,27.9,30.9c9.3,7.5,20.8,13.9,34.5,19.1c13.7,5.3,28.5,7.9,44.6,7.9h140V570c0-5.1,1.6-9.3,4.9-12.6c3.3-3.3,7.5-4.9,12.6-4.9c4.4,0,8.8,1.8,13.1,5.5l174.5,174.5C988.4,735.7,990,739.9,990,745L990,745z M990,255c0,5.1-1.6,9.3-4.9,12.6l-175,175c-3.3,3.3-7.5,4.9-12.6,4.9c-4.7,0-8.8-1.7-12.3-5.2c-3.5-3.5-5.2-7.6-5.2-12.3V325H640c-17.5,0-33.4,2.7-47.6,8.2c-14.2,5.5-26.8,13.7-37.7,24.6s-20.2,22.1-27.9,33.6s-15.9,25.6-24.6,42.4c-11.7,22.6-25.9,53.8-42.7,93.5c-10.6,24.1-19.6,44.3-27.1,60.7c-7.5,16.4-17.3,35.5-29.5,57.4c-12.2,21.9-23.9,40.1-35,54.7c-11.1,14.6-24.6,29.7-40.5,45.4s-32.3,28.2-49.2,37.5c-17,9.3-36.4,17-58.2,23s-45.2,9-70,9H27.5c-5.1,0-9.3-1.6-12.6-4.9c-3.3-3.3-4.9-7.5-4.9-12.6v-105c0-5.1,1.6-9.3,4.9-12.6c3.3-3.3,7.5-4.9,12.6-4.9H150c17.5,0,33.4-2.7,47.6-8.2c14.2-5.5,26.8-13.7,37.7-24.6c10.9-10.9,20.2-22.1,27.9-33.6s15.9-25.6,24.6-42.4c11.7-22.6,25.9-53.8,42.7-93.5c10.6-24.1,19.6-44.3,27.1-60.7c7.5-16.4,17.3-35.5,29.5-57.4c12.2-21.9,23.9-40.1,35-54.7c11.1-14.6,24.6-29.7,40.5-45.4s32.3-28.2,49.2-37.5c17-9.3,36.4-17,58.2-23s45.2-9,70-9h140V80c0-5.1,1.6-9.3,4.9-12.6c3.3-3.3,7.5-4.9,12.6-4.9c4.4,0,8.8,1.8,13.1,5.5l174.5,174.5C988.4,245.7,990,249.9,990,255L990,255z"/></svg>`}
							]}
						]}
					]}
				]},
				bottom()
			]}
		])
	}
}
new IAnime().mount(_root_.v)
})
