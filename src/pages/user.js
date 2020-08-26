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
			this.update()
		}
		this.ops = [
			{id: 'overview', name: 'Overview', page: '', render: a => []},
			{id: 'favorites', name: 'Favorites', page: 'favorites', render: a => []},
			{id: 'bookmarks', name: 'Bookmarks', page: 'bookmarks', render: a => []},
			{id: 'followings', name: 'Followings', page: 'followings', render: a => []},
			{id: 'followers', name: 'Followers', page: 'followers', render: a => []},
		]
	}
	load(a) {
		this.u = {}
		this.ui = 0
		this._load = 1
		this.load_ = 1
		this.init = 0
		this.parse(a.ex)
		console.log(a)
		this.update()
	}
	content() {
		var a = this.user || {}
		return ([
			{t: 'div', cl: 'cont', ch: [
				{t: 'div', at: {role: 'img', 'aria-label': 'Profile banner'}, cl: 'bann-c', s: {'background-image': `url(${(a.user && a.user.banner) || '/images/default/banner_3_unoptimised.jpg'})`}},
				{t: 'div', cl: 'scon', ch: [
					{t: 'div', cl: 'si1', ch: [
						{t: 'div', cl: 'pos', s: {'background-image': `url(${(a.user && a.user.poster) || '/images/default/avatar_op.jpg'})`}},
					]},
					{t: 'div', cl: 'si2', ch: [
						{t: 'span', cl: 'name', txt: (a.user && a.user.display_name) || 'Imesh'},
					]}
				]},
				{t: 'div', cl: 'tab-c', ch: [
					{t: 'div', cl: 'hld'},
					{t: 'div', cl: 'tab-c2', ch: [
						{t: 'div', cl: 'tabs', ch: this.ops.map((c,b) => ({t: 'a', cl: ['tab', this.ui == b ? 'sel' : 'K'], at: {href: '/user/' + ((a.user && a.user.id) || 1) + (c.page ? '/' + c.page : '')}, txt: c.name}))}
					]}
				]},
			]},
			{t: 'div', cl: ['cont-r', this.ops[this.ui].id], ch: this.ops[this.ui].render(this)}
		])
	}
}
export {user}
