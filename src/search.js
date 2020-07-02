/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import '../icApp/icApp.js'
import {IAR} from '../icApp/icApp-render.js'
import {XHR} from '../icApp/common.js'
import {top, bottom, comp_init, AniUI, serEv0} from './comp.js'
import {TitleCase, gtag, API, ACreate} from './comm.js'
import './search.scss'

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
			avatar: '/images/default/avatar_op.jpg',
			autoSearch: 1,
			noAutoLoad: 0,
		}
		this.settings = {
			loadSize: 10
		}
		this.search_something = 0
		this.load = 0
		;['input', 'search', 'aniLoad', 'loadNext', 'more'].forEach(a => this[a] = this[a].bind(this))
		this.pageWait = 0
		this.mainReq = 0
		this.perf = {
			page: 0
		}
		this.serTimeout = 0
		this._res = {
			length: 0
		}
		this.res = []
		if(window.IAnime.page_data && window.IAnime.page_data.search) {
			this.res = (this._res = window.IAnime.page_data.search).data
			//lets use default
			this.settings.loadSize = this._res.limit || this.settings.loadSize
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

    this.scroll = document.scrollingElement
    this.escroll = (a => ((a = this.scroll).scrollHeight - (a.scrollTop + a.offsetHeight)) < 120 ? this.loadNext() : 0).bind(this)
    if(!this.user.noAutoLoad) {
    	window.addEventListener('scroll', this.escroll)
    	window.addEventListener('resize', this.escroll)
    }

		this.update({ui: 1})
		if(this._res.input_all || this._res.input) icApp.qs('.content .ser input').value = TitleCase(this._res.input_all || this._res.input)
		;(this.ine = new icApp.e('.content .ser input')).v.focus()
		this.escroll()
	}
	loadNext() {
		if(this._loadNext || !this._res.next) return
		this._loadNext = 1
		this.load = 1
		XHR(this._res.next, a => {
			if(!a.success) return
			this.aniLoad(a.result, 1)
		})
		this.update()
	}
	aniLoad(a, b) {
		this.search_something = 1
		a = (this._res = a).data
		this.res = b ? this.res.concat(a) : a
		this.load = 0
		this._loadNext = 0
		this.ine.p.clr('s2')
		this.update()
	}
	search(a) {
		if(a) this._search = a
		else a = this._search
		if(a) {
			this.ine.p.cla('s2')
			this.load = 1
			a = encodeURIComponent(a)
			try {
				history.pushState({q:a}, document.title, location.pathname + '?q=' + a)
			}catch(e){console.error(e)}
			const r = Date.now()
			this.mainReq = r
			XHR(API + `/search?mode=advanced&q=` + a, a => {
				if(this.mainReq != r) return
				if(!a.success) return
				this.aniLoad(a.result)
			})
			this.update()
		}
	}
	didUpdate() {
		this.escroll()
	}
	willUpdate() {}
	input(a) {
		a = this.ine //new icApp.e(a.target)
		a.p.clr('s1')
		setTimeout(_ => a.p.cla('s1'), 10)
		var b = serEv0({
			e: a.v,
			timeout: this.serTimeout,
			search: this.search
		})
		this.serTimeout = b.timeout
		this._search = b._search
	}
	more(a) {
		loadNext()
	}
	render() {
		var a = this._res.length - ((this._res.index || 0) + this._res.data.length)
		a = ACreate(this._loadNext && a < this.settings.loadSize ? a : this.settings.loadSize).map(a => 'skeleton')
		a = this._loadNext ? this.res.concat(a) : (this.load ? a : this.res)
		return ([
			{s: {display: this.data.ui == 0 ? 'flex' : 'none'}},
			{s: {display: this.data.ui == 1 ? 'block' : 'none'}, t:'div', cl: 'main', ch: [
				top(this.user),
				{t: 'main', at:[['id', 'main']], cl: 'content', ch: [
					{t: 'div', cl: 'pri', ch: [
						{t: 'span', cl: 'ti', txt: 'Search Animes'},
						{t: 'label', cl: ['ser', 's1', this.load ? 's2' : ''].filter(a => a), ch: [
							{t: 'div', cl: 'ico', html: '<svg width="25" height="25" class="svgIcon-use" viewBox="0 0 25 25"><path d="M20.067 18.933l-4.157-4.157a6 6 0 10-.884.884l4.157 4.157a.624.624 0 10.884-.884zM6.5 11c0-2.62 2.13-4.75 4.75-4.75S16 8.38 16 11s-2.13 4.75-4.75 4.75S6.5 13.62 6.5 11z"></path></svg>'},
							{t: 'input', at:[['type', 'text']], e: [['oninput', this.input]]}
						]}
					]},
					{t: 'div', cl: ['res', 'ani-li', a.length > 0 ? 'k' : 'nope'], ch: a.length > 0 ? a.map(a => AniUI(a)) : [
						{t: 'div', cl: 'nope', ch: [
							{t: 'span', txt: this.search_something ? "Sorry, We couldn't find anything\ntry again with something else." : ''}
						]}
					]},
					{t:'div', cl: this._res.length > (this._res.index + a.length) || this.load ? 'load' : ['load', 'nope'], ch: [
						{t: 'span', txt: this.load ? 'Searching...' : 'Scroll Down to Load More'}
					]},
					...(this.user.noAutoLoad ? [{t:'div', cl: this._res.length > (this._res.index + a.length) ? 'more' : ['more', 'nope'], ch: [
						{t: 'button', e: [['onclick', this.more]], ch: [
							{t: 'span', txt: 'Load More'}
						]}
					]}] : [])
				]},
				bottom()
			]}
		])
	}
}
new IAnime().mount(_root_.v)
})
