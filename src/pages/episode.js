/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {EpUI} from '../comp'
import {TitleCase, ACreate, gtag} from '../comm'
import {meta_init} from '../meta'
import {data} from '../data'
import {page} from '../page'
import '../style/episode.scss'

const default_episodes = 12
class episode extends page {
	constructor() {
		super()
		this.name = 'episode'
		this.episode = {}
		this.parse = async (a, op={}) => {
			var b = (a = await data('episode', {
				id:a,
				filter: {
					create: 0,
					mirrors: { type: 0, name: 0 },
					parent: { title: 1, poster: 1, description: 1, web: 1},
					previous: { web: 1 },
					next: { web: 1 }
				}
			})) && a.success && a.result
			if(b) {
				this.episode = b
				if(!this.init) this._load = !(this.init = !0)
				this.load_ = 0
				this.epLoad = 0
				this.update()
				meta_init(0, b.title, 'Watch ' + b.title + ' on IAnime, ' + b.parent.description, b.image || b.parent.poster, b.web)
			}
			else {
				if(a.success) return
				if(a.error && a.error.code == 404) {
					this.switchPage('nope')
				}
			}
		}
		;['mirSel'].forEach(a => this[a] = this[a].bind(this))
	}
	didMount() {
	}
	load(a) {
		this.episode = {}
		this.parse(a.ex)
		this.epLoad = 1
		this.load_ = 1
		this._load = 1
		this.init = 0
		if(a.pram.mirror) {
			if((a = parseInt(a.pram.mirror)) > 0) this.mirror = a
		}
		this.update()
	}
	mirSel(a) {
		this.mirror = parseInt(a.target.value || '0') || 0
		try {
			history.pushState({}, TitleCase(this.episode.title), this.episode.web + (this.mirror != 0 ? '?mirror=' + (this.mirror + 1) : ''))
			gtag('event', 'change', {
				event_category: 'mirror',
				event_label: this.episode.mirrors[this.mirror].title,
			})
		} catch (e) { console.error(e) }
		this.update()
	}
	content() {
		var a = a => this.load_ ? [a, 'skeleton'] : a
		var a_ = a => this.epLoad || this.load_ ? [a, 'skeleton'] : a
		var b = a => this.load_ ? '' : a
		var b_ = a => this.epLoad || this.load_ ? '' : a
		var mirr = ((this.epLoad || this.load_ || !this.episode.mirrors) && {}) || this.episode.mirrors[this.mirror] || this.episode.mirrors[0]
		var parent = this.episode.parent || {}
		return ([
			{t: 'span', cl: a_('title'), txt: b_(TitleCase(this.episode.title))},
			{t: 'div', cl: 'watch', ch: [
				{t: 'span', cl: 'names', nodes: 1, ch: [
					{t: 'span', cl: a_('title-b'), txt: b_(TitleCase((this.episode.shortTitle || '') + ' '))},
					' ' + b_(TitleCase(this.episode.name || ''))
				]},
				mirr.watch ? ({t: 'iframe', at: [['src', b_(mirr.watch)], ['FRAMEBORDER', '0'], ['MARGINWIDTH', '0'], ['MARGINHEIGHT', '0'], ['SCROLLING', 'no']]}) : ({t: 'div', cl: a_('red'), s: {'background-image': `url(${b_(this.episode.image || parent.poster || '/images/default/poster_2.jpg')})`}, ch: [
					{t: 'a', at: {href: b_(mirr.url), target: b_('_blank')}, ch: [{t: 'div', cl: 'btn', html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M371.7 238l-176-107c-15.8-8.8-35.7 2.5-35.7 21v208c0 18.4 19.8 29.8 35.7 21l176-101c16.4-9.1 16.4-32.8 0-42zM504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256z"/></svg>'}]},
				]}),
				{t: 'div', cl: 'mir', ch: [
					{t: 'div', cl: 'wrp', ch: [
						{t: 'a', cl: [!this.load_ && this.episode.previous ? 'c0' : 'nope', this.load_ ? 'skeleton' : 'c0'].filter(a => a), at: [['href', b((this.episode.previous && this.episode.previous.web) || '')]], txt: 'Previous'}
					]},
					{t: 'div', cl: 'wrp', ch: [
						{t: 'span', txt: 'Mirrors: '},
						{t: 'select', cl: a_('select'), e: [['onchange', this.mirSel]], ch: ((!this.epLoad && !this.load_ && this.episode.mirrors) || []).map((a,b) => ({t: 'option', at: [['value', b.toString()]], txt: TitleCase(a.title || 'Unknown')}))}
					]},
					{t: 'div', cl: 'wrp', ch: [
						{t: 'a', cl: [!this.load_ && this.episode.next ? 'c0' : 'nope', this.load_ ? 'skeleton' : 'c0'].filter(a => a), at: [['href', b((this.episode.next && this.episode.next.web) || '')]], txt: 'Next'}
					]},
				]}
			]},
			{t: 'div', cl: 'ani', ch: [
				{t: 'div', cl: 'ani-l', ch: [
					{t: 'a', at: [['href', b(parent.web)]], cl: a('image'), s: {'background-image': `url(${b(parent.poster || '/images/default/poster_2.jpg')})`}},
				]},
				{t: 'div', cl: 'ani-r', ch: [
					{t: 'a', cl: a('name'), at: [['href', b(parent.web)]], txt: b(TitleCase(parent.title))},
					{t: 'span', cl: a('des'), txt: b(parent.description || ''), ch: this.load_ ? ACreate(Math.ceil(Math.random() * 10) + 10).map(a => ({t: 'div'})) : !1}
				]}
			]},
			{t: 'div', cl: 'shadow'}
		])
	}
}

export {episode}
