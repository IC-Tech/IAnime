/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import '../../icApp/icApp.js'
import {EpUI} from '../comp.js'
import {TitleCase, xhr, ACreate} from '../comm.js'
import './anime.scss'
import {page} from '../page'

const default_episodes = 12
let icApp = ic.icApp
var _root_ = new icApp.e('#root')

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
		this.epParse = async a => {
			var b = await xhr(a)
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
			a = await xhr('anime/' + a)
			if(a = (a && a.success && a.result)) {
				this.anime = a
				this.load_ = 0
				this.loadSize = a.eps > default_episodes ? default_episodes : a.eps
				this.update()
				await this.epParse(a.episodes + '?limit=' + default_episodes)
			}
		}
		;['next', 'pev'].forEach(a => this[a] = this[a].bind(this))
	}
	didMount() {
		window.addEventListener('scroll', a => {
			if(!this.active) {
				if(_root_.clc('top-scroll')) _root_.clr('top-scroll')
				return
			}
			if((a = new icApp.e(document.scrollingElement)).v.scrollTop > 200 && !_root_.clc('top-scroll')) _root_.cla('top-scroll')
			else if(a.v.scrollTop <= 200 && _root_.clc('top-scroll')) _root_.clr('top-scroll')
		})
		var a = new icApp.e(this.e.v.querySelector('.ser input'))
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
		this.parse(a)
		this.epLoad = 1
		this.load_ = 1
		this.page = 1
		this.update()
	}
	next(a) {
		a.preventDefault()
		if(!this.epLoad) {
			;(new icApp.e('a.next')).cla('c1')
			this.loadSize = this._episodes.length - ((this._episodes.limit || 0) + (this._episodes.index || 0))
			if(this._episodes.limit && this._episodes.limit < this.loadSize) this.loadSize = this._episodes.limit
			this.epLoad = 1
			this.update()
			this.epParse(`${this.anime && this.anime.episodes}?index=${this.page++ * default_episodes}&limit=${default_episodes}`)
		}
		return false
	}
	pev(a) {
		a.preventDefault()
		if(!this.epLoad) {
			;(new icApp.e('a.pev')).cla('c1')
			// 12 is server default value
			this.loadSize = this._episodes.limit || default_episodes
			this.epLoad = 1
			this.update()
			this.epParse(`${this.anime && this.anime.episodes}?index=${(--this.page - 1) * default_episodes}&limit=${default_episodes}`)
		}
		return false
	}
	content() {
		var a = []
		if(!this.load_) {
			[
				['Format', this.anime.type || ''],
				['Year', this.anime.year || ''],
				['Episodes', this._episodes.length + (this.anime.epsCount ? ' of ' + this.anime.epsCount : '')],
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
						{t: 'div', cl: ['image', this.load_ ? 'skeleton' : 'k'], s: {'background-image': this.load_ ? '' : `url("${this.anime.poster || '/images/default/poster_2.jpg'}"), url("/images/default/poster.gif")`}},
						{t: 'div', cl: 'info', ch: a}
					]},
					{t: 'div', cl: 'cont-r', ch: [
						{t: 'span', cl: ['title', this.load_ ? 'skeleton' : 'k'], txt: TitleCase(this.anime.title || '') },
						{t: 'span', cl: ['des', this.load_ ? 'skeleton' : 'k'], txt: this.load_ ? '' : (this.anime.description || ''), ch: this.load_ ? ACreate(Math.ceil(Math.random() * 10) + 10).map(a => ({t: 'div'})) : !1 },
						{t: 'div', cl: 'tags', ch: (this.load_ ? ACreate(8) : (this.anime.tags || [])).map(a => ({t: 'a', cl: this.load_ ? ['skeleton', 'tag'] : 'tag', txt: this.load_ ? '' : TitleCase(a.name), at: [['href', this.load_ ? '' : a.web]]}))},
						{t: 'div', cl: 'info', ch: a}
					]}
				]},
			]},
			{t: 'div', cl: b.length == 0 ? ['eps', 'nope'] : 'eps', ch: b.length == 0 ? [{t: 'span', txt: 'No Episode was found'}] : b.map(a => EpUI(a, this.anime))},
			{t: 'div', cl: 'more', ch: [
				{t:'a', e: [['onclick', this.pev]], d: {reg: '1'}, cl: (this.page * default_episodes) - default_episodes > 0 ? 'pev' : ['pev', 'nope'], at: [['href', this.anime.web + (this.page == 2 ? '' : '?page=' + (this.page - 1))]], ch: [
					{t:'span', txt: 'Previous'}
				]},
				{t:'a', e: [['onclick', this.next]], d: {reg: '1'}, cl: this._episodes.length - (this.page * default_episodes) > 0 ? 'next' : ['next', 'nope'], at: [['href', this.anime.web + '?page=' + (this.page + 1)]], ch: [
					{t:'span', txt: 'Next'}
				]}
			]}
		])
	}
}

export {anime}
