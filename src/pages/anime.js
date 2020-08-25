/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {icApp} from 'ic-app'
import {TitleCase, ACreate} from '../comm'
import {EpUI} from '../comp'
import {data} from '../data'
import {meta_init} from '../meta'
import {page} from '../page'
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
			var b = a = await data('anime:anime', {id: a, filter: {tags: {id: 0}, update: 0}})
			if(!this.init) this._load = !(this.init = !0)
			if(b = (b && b.success && b.result)) {
				this.anime = b
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
