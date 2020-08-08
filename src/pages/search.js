/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {icApp} from 'ic-app'
import {AniUI, serEv0} from '../comp'
import {TitleCase, ACreate} from '../comm'
import {data} from '../data'
import {page} from '../page'
import {meta_init} from '../meta'
import '../style/search.scss'

const default_episodes = 10
class search extends page {
	constructor() {
		super()
		this.name = 'search'
		this.search_something = 0
		this.load_ = 0
		this.load_ = 0
		this.lastReq = 0
		this.loadNext_ = 0
		this.serTimeout = 0
		this.search_text = ''
		this._res = {}
		this.settings = {
			loadSize: 10
		}
		this.res = []
		this.parseNext = async a => {
			a = await data('search', {
				mode: 'advanced', search: this.search_text, index: this._res.index + this._res.limit, limit: default_episodes,
				filter: {data: {title: 1, poster: 1, web: 1}}
			})
			if(!(a = (a && a.success && a.result)) || this.load_) return 0
			this.aniLoad(a, 1)
		}
		this.parse = async a => {
			const r = Date.now()
			this.lastReq = r
			this.load_ = 1
			this.loadNext_ = 0
			this.search_text = a
			a = await data('search', {
				mode: 'advanced', search: a, limit: default_episodes,
				filter: {data: {title: 1, poster: 1, web: 1}}
			})
			if(this.lastReq != r || !(a = (a && a.success && a.result))) return
			if(!this.init) this._load = !(this.init = !0)
			this.aniLoad(a)
		}
		;['input', 'search', 'aniLoad', 'loadNext', 'parse', 'parseNext'].forEach(a => this[a] = this[a].bind(this))
	}
	didMount() {
		this.scroll = document.scrollingElement
		this.escroll = (a => this.active && ((a = this.scroll).scrollHeight - (a.scrollTop + a.offsetHeight)) < 120 ? this.loadNext() : 0).bind(this)
		window.addEventListener('scroll', this.escroll)
		window.addEventListener('resize', this.escroll)
		this.inputE = new icApp(this.e.v.querySelector('.content .ser input'))
	}
	load(a) {
		this.inputE.val = TitleCase(a = ((a && a.pram && a.pram.q) || '').toString().replace(/\+/g, ' '))
		this.inputE.v.focus()
		this.reset = !a ? 1 : 0
		this._load = 1
		this.init = 0
		this.search(a)
	}
	loadNext() {
		if(this.loadNext_ || this.load_ || (this._res.length - (this._res.index + this._res.limit)) <= 0) return
		this.loadNext_ = 1
		this.parseNext()
		this.update()
	}
	aniLoad(a, b) {
		if(!a) return 0
		a = (this._res = a).data
		if(this._res.index == 0) this.res = a
		else this.res = Array.from(this.res).concat(a)
		this.load_ = 0
		this.loadNext_ = 0
		this.inputE.p.clr('s2')
		this.update()
		this.escroll()
	}
	search(a) {
		if(!a) a = this.inputE.val
		if(!(a = a || '') && !this.reset) return
		if(this.reset) {
			a = ''
			this.reset = !1
		}
		this.inputE.p.cla('s2')
		try {
			if(a && location.href.toString().replace(location.origin, '') != (location.pathname.toString() + '?q=' + encodeURIComponent(a))) history.pushState({q:a}, document.title, location.pathname + '?q=' + encodeURIComponent(a))
			meta_init(0, 'Search ' + a)
		}catch(e){console.error(e)}
		this.parse(a)
		this.update()
	}
	didUpdate() {}
	willUpdate() {}
	input(a) {
		;(a = this.inputE).p.clr('s1')
		setTimeout(_ => a.p.cla('s1'), 10)
		this.load_ = 1
		var b = serEv0({
			e: a.v,
			timeout: this.serTimeout,
			search: this.search
		})
		this.serTimeout = b.timeout
		this._search = b._search
	}
	content() {
		var a = this._res.length - ((this._res.index || 0) + (this._res.data || []).length)
		a = ACreate(this.loadNext_ && a < this.settings.loadSize ? a : this.settings.loadSize).map(a => 'skeleton')
		a = this.loadNext_ ? this.res.concat(a) : (this.load_ ? a : this.res)
		return ([
			{t: 'div', cl: 'pri', ch: [
				{t: 'span', cl: 'ti', txt: 'Search Animes'},
				{t: 'label', cl: ['ser', 's1', this.load_ ? 's2' : ''].filter(a => a), ch: [
					{t: 'div', cl: 'ico', html: '<svg width="25" height="25" class="svgIcon-use" viewBox="0 0 25 25"><path d="M20.067 18.933l-4.157-4.157a6 6 0 10-.884.884l4.157 4.157a.624.624 0 10.884-.884zM6.5 11c0-2.62 2.13-4.75 4.75-4.75S16 8.38 16 11s-2.13 4.75-4.75 4.75S6.5 13.62 6.5 11z"></path></svg>'},
					{t: 'input', at:[['type', 'text']], e: [['oninput', this.input]]}
				]}
			]},
			{t: 'div', cl: ['res', 'ani-li', a.length > 0 ? 'k' : 'nope'], ch: a.length > 0 ? a.map(a => AniUI(a)) : [
				{t: 'div', cl: 'nope', ch: [
					{t: 'span', txt: this.search_text ? "Sorry, We couldn't find anything\ntry again with something else." : ''}
				]}
			]},
			{t:'div', cl: this._res.length > (this._res.index + a.length) || this.load_ ? 'load' : ['load', 'nope'], ch: [
				{t: 'span', txt: this.load_ ? 'Searching...' : (this.loadNext_ ? 'Loading...' : 'Scroll Down to Load More')}
			]},
			...(this.user.noAutoLoad ? [{t:'div', cl: this._res.length > (this._res.index + a.length) ? 'more' : ['more', 'nope'], ch: [
				{t: 'button', e: [['onclick', this.more]], ch: [
					{t: 'span', txt: 'Load More'}
				]}
			]}] : [])
		])
	}
}

export {search}
