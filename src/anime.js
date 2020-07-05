/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import '../icApp/icApp.js'
import {IAR} from '../icApp/icApp-render.js'
import {XHR} from '../icApp/common.js'
import {top, bottom, comp_init, EpUI} from './comp.js'
import {TitleCase, gtag, ACreate} from './comm.js'
import {meta_init} from './meta.js'
import './anime.scss'

window.ic = window.ic || []
window.ic.pageLoad = Date.now()

document.addEventListener('DOMContentLoaded', () => {
let icApp = ic.icApp
var _root_ = new icApp.e('#root')
;['name="theme-color"', 'name="msapplication-navbutton-color"', 'name="apple-mobile-web-app-status-bar-style"'].forEach(a => new icApp.e(`[${a}]`).sa('content', '#171b22'))

window.IAnime = window.IAnime || {}

const default_episodes = 12;

class IAnime extends IAR {
	constructor() {
		super()
		this.data = {
			ui: 0
		}
		;['goPage', 'next', 'pev', 'addEps'].forEach(a => this[a] = this[a].bind(this))
		this.user = {
			login: false,
			avatar: '/images/default/avatar_op.jpg'
		}
		this.anime = {
			title: '',
			description: '',
			tags: [],
			epsCount: 0,
		}
		this.settings = {
			loadSize: 12
		}
		this.loadSize = this.settings.loadSize
		this.page = window.IAnime.page || 1
		this.pageWait = 0
		this.episodes = []
		if(window.IAnime.page_data && window.IAnime.page_data.anime) {
			this.anime = window.IAnime.page_data.anime
			this.anime.tags = this.anime.tags.filter((a,b,c) => !c.some((d,e) => a.id == d.id && b > e))
		}
		if(window.IAnime.page_data && window.IAnime.page_data.episodes) {
			this.episodes = (this._episodes = window.IAnime.page_data.episodes).data.map(a => {
				a.title = a.shortTitle || a.title
				return a
			})
			//lets use default
			this.loadSize = this._episodes.limit || this.loadSize
		}
		this.perf = {
			page: 0
		}
		comp_init(a => this.update())
	}
	didMount() {
		console.log('icApp-render:speed - ' + (Date.now() - window.ic.pageLoad))
		gtag('event', 'timing_complete', {
		  name : 'icApp-render',
		  value : (Date.now() - window.ic.pageLoad),
		  event_category: 'render'
		})

		window.addEventListener('scroll', a => {
			if((a = new icApp.e(document.scrollingElement)).v.scrollTop > 200 && !_root_.clc('top-scroll')) _root_.cla('top-scroll')
			else if(a.v.scrollTop <= 200 && _root_.clc('top-scroll')) _root_.clr('top-scroll')
		})
		var a = new icApp.e('.ser input')
		a.ae('focus', a => !_root_.clc('top-ser') ? _root_.cla('top-ser') : 0)
		a.ae('blur', a => _root_.clc('top-ser') ? _root_.clr('top-ser') : 0)

		var _a
		meta_init(icApp, this.title = TitleCase(this.anime.title || ''), (_a = 'Watch ' + this.title + ' at IAnime - ' + (this.anime.description || '')).length > 300 ? (_a.substr(0, 300) + '...') : _a, (_a = this.anime.poster || '').startsWith('/') ? (location.origin + _a) : _a)

		gtag('config', window.GT_ID, {
			page_title : document.title,
			page_path: location.pathname,
			page_location: location.href
		})

		this.update({ui: 1})
	}
	didUpdate() {}
	willUpdate() {}
	addEps(a) {
		gtag('event', 'timing_complete', {
		  name : 'goPage',
		  value : (Date.now() - this.perf.page),
		  event_category: 'XHR'
		})
		this._episodes = a
		this.episodes = a.data.map(a => {
			a.title = a.shortTitle || a.title
			return a
		})
		gtag('config', window.GT_ID, {
			page_title : document.title,
			page_path: location.pathname,
			page_location: location.href
		})
		this.load = 0
		this.update()
		this.pageWait = 0
	}
	next(a) {
		a.preventDefault()
		if(!this.pageWait) {
			gtag('event', 'Load Page', {
  			'event_label': 'Load next',
  			'event_category': 'selfLoad',
			})
			;(new icApp.e('a.next')).cla('c1')
			this.loadSize = this._episodes.length - ((this._episodes.limit || 0) + (this._episodes.index || 0))
			if(this._episodes.limit && this._episodes.limit < this.loadSize) this.loadSize = this._episodes.limit
			this.goPage(++this.page)
		}
		return false
	}
	pev(a) {
		a.preventDefault()
		if(!this.pageWait) {
			gtag('event', 'Load Page', {
  			'event_label': 'Load pev',
  			'event_category': 'selfLoad',
			})
			;(new icApp.e('a.pev')).cla('c1')
			// 12 is server default value
			this.loadSize = this._episodes.limit || 12
			this.goPage(--this.page)
		}
		return false
	}
	goPage(a) {
		this.pageWait = 1
		try {
			history.pushState({}, this.title + (this.page > 0 ? ' · IAnime | Page ' + this.page : ''), this.anime.web + (this.page == 1 ? '' : '?page=' + this.page))
		} catch (e) {}
		this.perf.page = Date.now()
		this.load = 1
		this.update()
		XHR(this.anime.episodes + '?index=' + (--a * default_episodes) + '&limit=' + default_episodes, a => !a.success ? 0 : this.addEps(a.result))
	}
	render() {
		var a = []
		;[
			['Format', this.anime.type || ''],
			['Year', this.anime.year || ''],
			['Episodes', this._episodes.length + (this.anime.epsCount ? ' of ' + this.anime.epsCount : '')],
			['Rating', this.anime.rating || '']
		].map(a => a[1] ? [{t: 'span', cl: 'inf-t', txt: a[0]}, {t: 'span', cl: 'inf-v', txt: TitleCase(a[1])}] : null).forEach(_a => !_a ? 0 : [a.push(_a[0]), a.push(_a[1])])
		var b = ACreate(this.loadSize).map(a => 'skeleton')
		b = this.load ? b : this.episodes
		return ([
			{s: {display: this.data.ui == 0 ? 'flex' : 'none'}},
			{s: {display: this.data.ui == 1 ? 'block' : 'none'}, t:'div', cl: 'main', ch: [
				top(this.user),
				{t: 'main', at:[['id', 'main']], cl: 'content', ch: [
					{t: 'div', cl: 'poster', s: {'background-image': `url("${this.anime.banner || '/images/default/banner_2.jpg'}"), url("/images/default/banner.gif")`}, ch: [
						{t: 'div', cl: 'poster-cover'}
					]},
					{t: 'div', cl: 'cont-s', ch: [
						{t: 'div', cl: 'cont', ch: [
							{t: 'div', cl: 'cont-l', ch: [
								{t: 'div', cl: 'image', s: {'background-image': `url("${this.anime.poster || '/images/default/poster_2.jpg'}"), url("/images/default/poster.gif")`}},
								{t: 'div', cl: 'info', ch: a}
							]},
							{t: 'div', cl: 'cont-r', ch: [
								{t: 'span', cl: 'title', txt: TitleCase(this.anime.title) || '' },
								{t: 'span', cl: 'des', txt: this.anime.description || '' },
								{t: 'div', cl: 'tags', ch: this.anime.tags.map(a => ({t: 'a', cl: 'tag', txt: TitleCase(a.name), at: [['href', a.web]]}))},
								{t: 'div', cl: 'info', ch: a}
							]}
						]},
					]},
					{t: 'div', cl: b.length == 0 ? ['eps', 'nope'] : 'eps', ch: b.length == 0 ? [{t: 'span', txt: 'No Episode was found'}] : b.map(a => EpUI(a, this.anime))},
					{t: 'div', cl: 'more', ch: [
						{t:'a', e: [['onclick', this.pev]], cl: (this.page * default_episodes) - default_episodes > 0 ? 'pev' : ['pev', 'nope'], at: [['href', this.anime.web + (this.page == 2 ? '' : '?page=' + (this.page - 1))]], ch: [
							{t:'span', txt: 'Previous'}
						]},
						{t:'a', e: [['onclick', this.next]], cl: this._episodes.length - (this.page * default_episodes) > 0 ? 'next' : ['next', 'nope'], at: [['href', this.anime.web + '?page=' + (this.page + 1)]], ch: [
							{t:'span', txt: 'Next'}
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
