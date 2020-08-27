/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {getuser} from '../account'
import {meta_init} from '../meta'
import {sign_req} from '../comp'
import {page} from '../page'
import '../style/user.scss'

const nope = (a,b) => [a ? 'K' : 'nope', b]

class user extends page {
	constructor() {
		super()
		this.name = 'user'
		this.u = {}
		this.ui = 0
		this.parse = async a => {
			a = await getuser(a)
			if(!this.init) this._load = !(this.init = !0)
			if(!a) return this.switchPage('nope')
			this.load_ = 0
			console.log(a)
			a.title = a.display_name || a.name || (a.id && ('#' + a.id)) || ''
			this.u = a
			this.update()
			meta_init(0, a.title + "'s " + (this.ops[this.ui].title || this.ops[this.ui].name), a.title + "'s IAnime user profile", a.poster, a.web)
		}
		this.ops = [
			{id: 'overview', title: 'Profile', name: 'Overview', page: '', render: a => [{t: 'div', cl: 'des-c', ch: [
				{t: 'span', cl: 'des', txt: (a && a.description) || ''}
			]}]},
			{id: 'favorites', name: 'Favorites', page: 'favorites', render: a => []},
			{id: 'bookmarks', name: 'Bookmarks', page: 'bookmarks', p: 1, render: a => []},
			{id: 'followings', name: 'Followings', page: 'followings', render: a => []},
			{id: 'followers', name: 'Followers', page: 'followers', render: a => []},
		]
	}
	load(a) {
		this.u = null
		this.ui = 0
		this._load = 1
		this.load_ = 1
		this.init = 0
		a.ui = a.dirs[2] || ''
		if(!this.ops.some((b,c) => b.page == a.ui ? [this.ui = c] : 0)) return this.switchPage('nope')
		this.parse(this.id = a.ex || 0)
		console.log(a)
		this.update()
	}
	content() {
		var a = this.u || {}
		var b = a => [this.load_ ? 'skeleton' : 'K', a]
		var c = a => this.load_ ? '' : a
		var c_ = a => this.load_ ? undefined : a
		return ([
			{t: 'div', cl: 'cont', ch: [
				{t: 'div', at: {role: 'img', 'aria-label': 'Profile banner'}, cl: b('bann-c'), s: {'background-image': c(`url(${(a && a.banner) || '/images/default/banner_3_unoptimised.jpg'})`)}},
				{t: 'div', cl: 'scon', ch: [
					{t: 'div', cl: 'si1', ch: [
						{t: 'div', cl: b('pos'), at: {role: 'img', title: c(a && a.title && (a.title + "'s Avatar"))}, s: {'background-image': c(`url(${(a && a.poster) || '/images/default/avatar_op.jpg'})`)}},
					]},
					{t: 'div', cl: 'si2', ch: [
						{t: 'span', cl: b('name'), txt: c(a && a.title)},
					]}
				]},
				{t: 'div', cl: 'tab-c', ch: [
					{t: 'div', cl: 'hld'},
					{t: 'div', cl: 'tab-c2', ch: [
						{t: 'div', cl: b('tabs'), ch: this.ops.map((c,b) => ({t: 'a', s: {display: (c.p && !(a && a.self)) ? 'none' : 'block'}, cl: ['tab', this.ui == b ? 'sel' : 'K'], at: {href: c_('/user/' + ((a && a.name || a.id) || 0) + (c.page ? '/' + c.page : ''))}, txt: c.name}))}
					]}
				]},
			]},
			{t: 'div', cl: ['cont-r', this.ops[this.ui].id], ch: this.load_ ? [] : this.ops[this.ui].render(a, this)},
			{t: 'div', cl: nope(this.ui == 0, 'feed'), at: {role: 'feed', 'aria-busy': !!this.load_}, ch: this.load_ ? [] : [{t: 'span', cl: 'temp', txt: `user haven't create any ${a && a.self ? '' : 'public '}activities to display`}]}
		])
	}
}
export {user}
