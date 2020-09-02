/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {getuser, favorites, bookmarks, followings, followers, follow} from '../account'
import {meta_init} from '../meta'
import {sign_req, AniUI, UsrUI} from '../comp'
import {ACreate} from '../comm'
import {page} from '../page'
import '../style/user.scss'

const nope = (a,b) => [a ? 'K' : 'nope', b]

class user extends page {
	constructor() {
		super()
		this.name = 'user'
		this.u = {}
		this.ui = 0
		this.uiParse = async a => {
			if(this.ui == 0) return this._load = 0
			if(this.ui == 1) {
				var b = await favorites(a.id)
				if(b.success && (b = b.result)) this.favs = (this.favs_ = b).elements
				this._load = 0
				return this.update()
			}
			if(this.ui == 2) {
				var b = await bookmarks(a.id)
				if(b.success && (b = b.result)) this.bkms = (this.bkms_ = b).elements
				this._load = 0
				return this.update()
			}
			if(this.ui == 3) {
				var b = await followings(a.id)
				if(b.success && (b = b.result)) this.flis = (this.flis_ = b).elements
				this._load = 0
				return this.update()
			}
			if(this.ui == 4) {
				var b = await followers(a.id)
				if(b.success && (b = b.result)) this.flrs = (this.flrs_ = b).elements
				this._load = 0
				return this.update()
			}
		}
		this.parse = async (a,b) => {
			a = await getuser({id: a, f: !!b})
			if(!a) return this.switchPage('nope')
			this.u = a
			this.load_ = 0
			this.uiParse(a)
			this.update()
			meta_init(0, a.title + "'s " + (this.ops[this.ui].title || this.ops[this.ui].name), a.title + "'s IAnime user profile", a.poster, a.web)
		}
		this.ops = [
			{id: 'overview', title: 'Profile', name: 'Overview', page: '', render: a => [{t: 'div', cl: 'des-c', ch: [
				{t: 'span', cl: 'des', txt: (a && a.description) || ''}
			]}]},
			{id: 'favorites', name: 'Favorites', page: 'favorites', render: a => [{t: 'div', cl: ['fa-c', !this.load_ && !this._load && this.favs && this.favs.length <= 0 ? 'no' : 'ani-li'], ch: this.favs && this.favs.length > 0 ? this.favs.map(a => AniUI(a)) : (this.load_ || this._load ? ACreate(10, 'skeleton').map(a => AniUI(a)) : [
				{t: 'div', cl: 'msg', ch: [
					{t: 'span', txt: (this.u && this.u.title && (((this.u.self && 'You') || this.u.title) + ' ')) + 'does not have any favorites'}
				]}
			])}] },
			{id: 'bookmarks', name: 'Bookmarks', page: 'bookmarks', p: 1, render: a => [{t: 'div', cl: ['bk-c', !this.load_ && !this._load && this.bkms && this.bkms.length <= 0 ? 'no' : 'ani-li'], ch: this.bkms && this.bkms.length > 0 ? this.bkms.map(a => AniUI(a)) : (this.load_ || this._load ? ACreate(10, 'skeleton').map(a => AniUI(a)) : [
				{t: 'div', cl: 'msg', ch: [
					{t: 'span', txt: (this.u && this.u.title && (((this.u.self && 'You') || this.u.title) + ' ')) + 'does not have any bookmarks'}
				]}
			])}] },
			{id: 'followings', name: 'Followings', page: 'followings', render: a => [{t: 'div', cl: ['fi-c', !this.load_ && !this._load && this.flis && this.flis.length <= 0 ? 'no' : 'usrs'], ch: this.flis && this.flis.length > 0 ? this.flis.map(a => UsrUI(a)) : (this.load_ || this._load ? ACreate(10, 'skeleton').map(a => UsrUI(a)) : [
				{t: 'div', cl: 'msg', ch: [
					{t: 'span', txt: (this.u && this.u.title && (((this.u.self && 'You') || this.u.title) + ' ')) + 'does not ' + ((this.u.self && 'follow anyone') || 'have any followings')}
				]}
			])}] },
			{id: 'followers', name: 'Followers', page: 'followers', render: a => [{t: 'div', cl: ['fr-c', !this.load_ && !this._load && this.flrs && this.flrs.length <= 0 ? 'no' : 'usrs'], ch: this.flrs && this.flrs.length > 0 ? this.flrs.map(a => UsrUI(a)) : (this.load_ || this._load ? ACreate(10, 'skeleton').map(a => UsrUI(a)) : [
				{t: 'div', cl: 'msg', ch: [
					{t: 'span', txt: (this.u && this.u.title && (((this.u.self && 'You') || this.u.title) + ' ')) + 'does not have any followers'}
				]}
			])}] },
		]
		this.flo = async a => {
			this._load = 1
			this.update()
			await follow(this.u.id, !this.u.isfollow)
			this.load_ = 1
			this.update()
			this.parse(this.u.id, 1)
		}
		this.acbtn = a => {
			if(this.u && this.u.self) return this.loadUrl(0, '/settings')
			this.flo()
		}
	}
	load(a) {
		this.u = null
		this.favs = null
		this.bkms = null
		this.flis = null
		this.flrs = null
		this.ui = 0
		this._load = 1
		this.load_ = 1
		a.ui = a.dirs[2] || ''
		if(!this.ops.some((b,c) => b.page == a.ui ? [this.ui = c] : 0)) return this.switchPage('nope')
		this.parse(this.id = a.ex || 0)
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
						{t: 'button', cl: b('flo'), txt: a && a.self ? 'Edit' : (a.isfollow ? 'Following' : 'Follow'), e: {onclick: this.acbtn}}
					]}
				]},
				{t: 'div', cl: 'tab-c', ch: [
					{t: 'div', cl: 'hld'},
					{t: 'div', cl: 'tab-c2', ch: [
						{t: 'div', cl: b('tabs'), ch: this.ops.map((c,b) => ({t: 'a', s: {display: (c.p && !(a && a.self)) ? 'none' : 'block'}, cl: ['tab', this.ui == b ? 'sel' : 'K'], at: {href: c_('/user/' + ((a && a.name || a.id) || 0) + (c.page ? '/' + c.page : ''))}, txt: c.name}))}
					]}
				]},
			]},
			{t: 'div', cl: ['cont-r', this.ops[this.ui].id], ch: this.ops[this.ui].render(a, this)},
			{t: 'div', s: {display: 'none'}, cl: nope(this.ui == 0, 'feed'), at: {role: 'feed', 'aria-busy': !!this.load_}, ch: this.load_ ? [] : [{t: 'span', cl: 'temp', txt: `user haven't create any ${a && a.self ? '' : 'public '}activities to display`}]}
		])
	}
}
export {user}
