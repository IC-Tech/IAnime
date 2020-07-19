/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import './random.scss'
import {TitleCase, xhr, ACreate} from '../comm.js'
import {page} from '../page.js'

class random extends page {
	constructor() {
		super()
		this.name = 'random'
		this.rand = {}
		this.parse = async a => {
			a = await xhr('random')
			if(!(a = (a && a.success && a.result))) return
			this.rand = a
			this.load_ = 0
			if(!this.init) this._load = 0
			this.update()
		}
		this.random = a => {
			if(!this.active && this.load_) return
			this.load_ = 1
			this.parse()
			this.update()
		}
	}
	load() {
		this.load_ = 1
		this._load = 1
		this.init = 0
		this.parse()
		this.update()
	}
	content() {
		var a = a => this.load_ ? ['skeleton', a] : a
		var b = a => this.load_ ? '' : a
		return ([
			{t: 'span', cl: 'title', txt: 'Random Select'},
			{t: 'div', cl: 'rand', ch: [
				{t: 'div', cl: 'ra-l', ch: [
					{t: 'a', cl: a('img'), at: [['href', b(this.rand.web)]], s: {'background-image': `url(${b(this.rand.poster || '/images/default/poster_2.jpg')})`}}
				]},
				{t: 'div', cl: 'ra-r', ch: [
					{t: 'a', cl: a('name'), at: [['href', b(this.rand.web)]], txt: b(TitleCase(this.rand.title))},
					{t: 'span', cl: a('des'), txt: b(this.rand.description), ch: this.load_ ? ACreate(Math.ceil(Math.random() * 10) + 10).map(a => ({t: 'div'})) : !1},
					{t: 'div', cl: 'tags', ch: (this.load_ ? ACreate(6 + Math.ceil(Math.random() * 6)) : (this.rand.tags || [])).map(c => ({t: 'a', cl: a('tag'), txt: b(TitleCase(c.name)), at: [['href', b(c.web)]]}))}
				]}
			]},
			{t: 'div', cl: 'more-c', ch: [
				{t: 'button', cl: a('more'), e: [['onclick', this.random]], ch: [
					{t: 'span', txt: 'Randomize'}
				]}
			]}
		])
	}
}
export {random}
