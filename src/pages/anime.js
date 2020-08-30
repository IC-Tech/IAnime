/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {icApp} from 'ic-app'
import {TitleCase, ACreate} from '../comm'
import {EpUI} from '../comp'
import {data} from '../data'
import {meta_init} from '../meta'
import {page} from '../page'
import {bookmark, favorite} from '../account'
import '../style/anime.scss'

const default_episodes = 12
var _root_ = new icApp('#root')
const ls_vn = {
	sort: 'ianime-anime-sort-0',
	view: 'ianime-anime-view-0',
}
var sort = !!parseInt(localStorage.getItem(ls_vn.sort) || 0)
var view = !!parseInt(localStorage.getItem(ls_vn.view) || 0)

class anime extends page {
	constructor() {
		super()
		this.name = 'anime'
		this.anime = {}
		this.episodes = []
		this._episodes = {
			length: 0,
			index: 0
		}
		this.page = 1
		this.epParse = async (a) => {
			var b = await data('anime:episodes', {
				id: this.anime.id, index: default_episodes * (this.page - 1), limit: default_episodes, sort: sort ? 1 : -1,
				filter: {data: {id: 0, create: 0, next: 0, previous: 0, ep: 0}, sort: 0}
			})
			if(b = (b && b.success && b.result)) {
				this._episodes = b
				this.episodes = b.data.map(a => {
					a.title = a.shortTitle || a.title
					return a
				})
				this.epLoad = 0
				this.update()
			}
		}
		this.parse = async a => {
			var b = a = await data('anime:anime', {id: a, isbookmark: this.token(), isfavorite: this.token(), filter: {tags: {id: 0}, update: 0}})
			if(!this.init) this._load = !(this.init = !0)
			if(b = (b && b.success && b.result)) {
				this.anime = b
				this.fav = b.isfavorite && b.isfavorite.isfavorite
				this.bkm = b.isbookmark && b.isbookmark.isbookmark
				this.load_ = 0
				this.loadSize = b.eps < default_episodes ? b.eps : ((this.loadSize = b.eps - (default_episodes * (this.page - 1))) > default_episodes ? default_episodes : this.loadSize)
				this.update()
				this.epParse()
				meta_init(icApp, b.title, b.description, b.poster, b.web)
			}
			else {
				if(a.success) return
				if(a.error && a.error.code == 404) {
					this.switchPage('nope')
				}
			}
		}
		this.url = a => this.anime.web + (a > 1 ? '?page=' + a : '')
		this.sort = a => {
			if(this.load_ || this.epLoad) return
			sort =! sort
			localStorage.setItem(ls_vn.sort, sort ? 1 : 0)
			this.page = 1
			this.epLoad = 1
			this.update()
			this.parse(this.anime.id)
		}
		this.view = a => {
			if(this.load_ || this.epLoad) return
			view =! view
			localStorage.setItem(ls_vn.view, view ? 1 : 0)
			this.page = 1
			this.update()
		}
		this.bkmclick = a => {
			a.preventDefault()
			if(this.load_ || this._load) return
			if(!this.user || !this.token()) return this.loadUrl(0, '/sign')
			;(async a => {
				if(!(await bookmark(this.anime.id, !this.bkm)).success) return
				this.bkm =! this.bkm
				this._load = 0
				this.update()
			})()
			this._load = 1
			this.update()
		}
		this.favclick = a => {
			a.preventDefault()
			if(this.load_ || this._load) return
			if(!this.user || !this.token()) return this.loadUrl(0, '/sign')
			;(async a => {
				if(!(await favorite(this.anime.id, !this.fav)).success) return
				this.fav =! this.fav
				this._load = 0
				this.update()
			})()
			this._load = 1
			this.update()
		}

	}
	didMount() {
		window.addEventListener('scroll', a => {
			if(!this.active) {
				if(_root_.clc('top-scroll')) _root_.clr('top-scroll')
				return
			}
			if((a = new icApp(document.scrollingElement)).v.scrollTop > 200 && !_root_.clc('top-scroll')) _root_.cla('top-scroll')
			else if(a.v.scrollTop <= 200 && _root_.clc('top-scroll')) _root_.clr('top-scroll')
		})
		var a = new icApp(this.e.v.querySelector('.ser input'))
		a.ae('focus', a => this.active && !_root_.clc('top-ser') ? _root_.cla('top-ser') : 0)
		a.ae('blur', a => _root_.clc('top-ser') ? _root_.clr('top-ser') : 0)
	}
	load(a) {
		this.anime = {}
		this.episodes = []
		this._episodes = {
			length: 0,
			index: 0
		}
		this.loadSize = default_episodes
		this.epLoad = 1
		this._load = 1
		this.load_ = 1
		this.page = (this.page = parseInt(a.pram.page) || 0) > 0 ? this.page : 1
		this.init = 0
		this.parse(a.ex)
		this.update()
	}
	content() {
		var a = []
		if(!this.load_) {
			[
				['Format', this.anime.type || ''],
				['Year', this.anime.year || ''],
				['Episodes', (this.anime.eps || this._episodes.length) + (this.anime.epsCount ? ' of ' + this.anime.epsCount : '')],
				['Rating', this.anime.rating || '']
			].map(a => a[1] ? [{t: 'span', cl: 'inf-t', txt: a[0]}, {t: 'span', cl: 'inf-v', txt: TitleCase(a[1])}] : null).forEach(_a => !_a ? 0 : [a.push(_a[0]), a.push(_a[1])])
		}
		else a = ACreate(4 * 2).map(a => ({t: 'div', cl: 'skeleton-inf'}))
		var b = this.load_ || this.epLoad ? ACreate(this.load_ ? default_episodes : this.loadSize).map(a => 'skeleton') : this.episodes
		return ([
			{t: 'div', cl: ['poster', this.load_ ? 'skeleton' : 'k'], s: {'background-image': this.load_ ? '' : `url("${this.anime.banner || '/images/default/banner_2.jpg'}"), url("/images/default/banner.gif")`}, ch: [
				{t: 'div', cl: 'poster-cover'}
			]},
			{t: 'div', cl: 'cont-s', ch: [
				{t: 'div', cl: 'cont', ch: [
					{t: 'div', cl: 'cont-l', ch: [
						{t: 'div', at: {role: 'img', title: this.load_ ? '' : TitleCase(this.anime.title || '')}, cl: ['image', this.load_ ? 'skeleton' : 'k'], s: {'background-image': this.load_ ? '' : `url("${this.anime.poster || '/images/default/poster_2.jpg'}"), url("/images/default/poster.gif")`}},
						{t: 'div', cl: 'usra', ch: [
							{t: 'button', cl: ['ico', 'fav', this.load_ && 'skeleton', this.fav && 'ac'].filter(a => a), at: {title: `${this.fav ? 'Remove From' : 'Add To'} Favorites`}, e: {onclick: this.favclick}, html: this.fav ? `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"></path></svg>`},
							{t: 'button', cl: ['ico', 'bkm', this.load_ && 'skeleton', this.bkm && 'ac'].filter(a => a), at: {title: `${this.bkm ? 'Remove From' : 'Add To'} Bookmarks`}, e: {onclick: this.bkmclick}, html: this.bkm ? `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 384 512"><path fill="currentColor" d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z"></path></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 384 512"><path fill="currentColor" d="M336 0H48C21.49 0 0 21.49 0 48v464l192-112 192 112V48c0-26.51-21.49-48-48-48zm0 428.43l-144-84-144 84V54a6 6 0 0 1 6-6h276c3.314 0 6 2.683 6 5.996V428.43z"></path></svg>`},
						]},
						{t: 'div', cl: 'info', ch: a}
					]},
					{t: 'div', cl: 'cont-r', ch: [
						{t: 'span', cl: ['title', this.load_ ? 'skeleton' : 'k'], txt: TitleCase(this.anime.title || '') },
						{t: 'span', cl: ['des', this.load_ ? 'skeleton' : 'k'], txt: this.load_ ? '' : (this.anime.description || ''), ch: this.load_ ? ACreate(Math.ceil(Math.random() * 10) + 10).map(a => ({t: 'div'})) : !1 },
						{t: 'div', cl: 'tags', ch: (this.load_ ? ACreate(8) : (this.anime.tags || [])).map(a => ({t: 'a', cl: this.load_ ? ['skeleton', 'tag'] : 'tag', txt: this.load_ ? '' : TitleCase(a.name), at: [['href', this.load_ ? undefined : a.web]]}))},
						{t: 'div', cl: 'info', ch: a}
					]}
				]},
			]},
			{t: 'div', cl: 'opt', ch: [
				{t: 'div', cl: 'srt', ch: [
					{t: 'button', cl: ['btn', sort ? 'asc' : 'desc', this.load_ || this.epLoad ? 'skeleton' : 'k'], e: {onclick: this.sort}, ch: [
						{t: 'span', txt: 'Sort'},
						{t: 'div', cl: 'ico', ch: ['a','b','c','d','e','f'].map(a => ({t: 'div', cl: a}))},
					]}
				]},
				{t: 'div', cl: 'vew', ch: [
					{t: 'button', cl: ['btn', view ? 'list' : 'grid', this.load_ || this.epLoad ? 'skeleton' : 'k'], e: {onclick: this.view}, ch: [
						{t: 'span', txt: 'Layout'},
						{t: 'div', cl: 'ico', ch: ['a','b','c','d','e','f','g','h'].map(a => ({t: 'div', cl: a}))},
					]}
				]}
			]},
			{t: 'div', cl: ['eps', view ? 'list' : 'grid', b.length == 0 ? 'nope' : 'k'], ch: b.length == 0 ? [{t: 'span', txt: 'No Episode was found'}] : b.map(a => EpUI(a, this.anime, {view: view ? 'list' : 'grid'}))},
			{t: 'div', cl: 'more', ch: [
				{t:'a', cl: (this.page * default_episodes) - default_episodes > 0 ? 'pev' : ['pev', 'nope'], at: [['href', this.page > 1 ? this.url(this.page - 1) : undefined]], ch: [
					{t:'span', txt: 'Previous'}
				]},
				{t:'a', cl: this._episodes.length - (this.page * default_episodes) > 0 ? 'next' : ['next', 'nope'], at: [['href', this.url(this.page + 1)]], ch: [
					{t:'span', txt: 'Next'}
				]}
			]}
		])
	}
}

export {anime}
