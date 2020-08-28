/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {icApp, xhr} from 'ic-app'
import {meta_init} from '../meta'
import {sign_req} from '../comp'
import {page} from '../page'
import {error} from '../error'
import {token} from '../account'
import '../style/settings.scss'

const nope = (a,b) => [a ? 'K' : 'nope', b]
class settings extends page {
	constructor() {
		super()
		this.name = 'settings'
		this.ui = 0
		this.bnds = [ ['name', 'display_name'], ['about', 'description'], ['username', 'name'], ['email', 'email'] ]
		this.fs = a => [
			['name', a && a.display_name],
			['about', a && a.description],
			['username', a && a.name],
			['email', a && a.email],
		]
		this.changed = {}
		this.fsf = (a,b) => this.bnds.forEach(c => (c[2] = new icApp(`[name="${c[0]}"]`)).v ? b([c[2], a && a[c[1]], c[0]]) : 0)
		this.fUpdate = a => this.fsf(a, a => a[0].val = a[1] || '')
		this.changed_fn = a => {
			this.fsf(this.user, a => this.changed[a[2]] = a[0].val != (a[1] || ''))
			if((a = new icApp(`[name="password"]`)).v) this.changed.password = !!a.val
			this.update()
		}
		this.save = a => {
			if((a = new icApp(a.target).p).d.ty != 'save' || !(a = a.d.in)) return 0
			console.log(a)
			var b = {}, c = new icApp(`[name="${a}"]`).val
			if(a == 'password' && (!c || c != new icApp(`[name="repeat_password"]`).val)) return error({code: 9, message: 'repeated password dose not match'})
			this.bnds.some(b => a == b[0] ? [a = b[1]] : 0)
			b[a] = c
			console.log(b)
		}
		this.upload = async (a, b) => {
			if(!b || !b.type.match(/image\/(jpeg|png)/i)) return error({code: 12, message: "Invalid File Format"})
			if((a == 'avatar' && b.size > 2097152) || (a == 'banner' && b.size > 4194304)) return error({code: 12, message: "file size is too big"})
			var prm = [token(), `${a}.${b.type.match(/png/i) ? 'png' : 'jpg'}`].map(a => encodeURIComponent(a))
			var c = await xhr(`${location.origin}/cdn4/upload?name=${prm[1]}&token=${prm[0]}`, 0, await new Promise(_ => {
				var c = new FileReader()
				c.onload = a => _(a.target.result)
				c.readAsArrayBuffer(b)
			}))
			if(c.error) return error(c.error)
			else location.reload()
		}
		this._drag = a => {
			var b = a.dataTransfer, c = new icApp(a.target), d = ''
			;b && Array.from(b.items).some(a => a.kind == 'file' && a.type.match(/image\/(jpeg|png)/i) ? [d = a.type] : 0)
			return ({a,b,c,d})
		}
		this.dragleave = a => {
			var c = new icApp(a.target)
			a.preventDefault()
			c.d.col = '0'
		}
		this.dragover = a => {
			a.preventDefault()
			a.dataTransfer.dropEffect = 'move'
		}
		this.dragenter = a => {
			a.preventDefault()
			var {c,d} = this._drag(a)
			c.d.col = d ? '1' : '2'
		}
		this.drop = a => {
			this.dragleave(a)
			var {b, c} = this._drag(a)
			var id = c.p.p.p.d.id
			if(!id) return
			var d = b.files[0]
			this.upload(id, !Array.from(b.files).some(a => a.type.match(/image\/(jpeg|png)/i) ? [d = a] : 0) ? null : d)
			return !1
		}
		this.file = a => this.upload(a.target.name, a.target.files[0])
		const fld = a => ({t: 'label', cl: 'fld', ch: [
			{t: 'span', cl: 'name', txt: a.name},
			{t: 'span', cl: 'des', txt: a.des},
			a.e || {t: 'input', at: {type: a.type || 'text', name: a.type || a.id, maxlength: a.maxlength || undefined}, e: {oninput: this.changed_fn}},
		]})
		const img = a => ({t: 'div', cl: 'fld', d: {ty: 'img-im', id: a.id}, ch: [
			{t: 'span', cl: 'name', txt: a.name},
			{t: 'span', cl: 'des', txt: a.des},
			{t: 'div', cl: 'imgs', ch: [
				{t: 'label', cl: 'img-im', ch: [
					{t: 'span', txt: 'Drop image here or click to upload'},
					{t: 'input', s: {display: 'none'}, at: {type: 'file', name: a.id}, e: {oninput: this.file}},
					{t: 'div', cl: 'drop', e: {ondragleave: this.dragleave, ondrop: this.drop, ondragover: this.dragover, ondragenter: this.dragenter}}
				]},
				{t: 'div', cl: 'img', at: {title: a.name + ' Image'}, s: {'background-image': `url(${a.img})`}}
			]}
		]})
		const save = a => ({t: 'div', cl: nope(this.changed[a], 'up'), d:{ty: 'save', in: a}, e: {onclick: this.save}, ch: [
			{t: 'button', txt: 'Save'}
		]})
		this.ops = [
			{name: 'profile', title: 'Profile', render: a => [
				{t: 'span', cl: 'title', txt: a.ops[a.ui].title + ' Settings'},
				fld({id: 'name', name: 'Display Name', maxlength: 48, des: 'Enter your name, so people you know can recognize you. Please use 48 characters at maximum.'}),
				save('name'),
				fld({e: {t: 'textarea', cl: 'rez', at: {name: 'about', multiline: true, maxlength: 10000}, e: {oninput: this.changed_fn}}, name: 'About', des: 'Tell us about yourself'}),
				save('about'),
				img({name: 'Avatar', id: 'avatar', img: (a.user && a.user.poster) || '/images/default/avatar_op.jpg', des: 'This is your image will display as your avatar. Allowed Formats: JPEG, PNG. Max size: 2mb.'}),
				img({name: 'Banner', id: 'banner', img: (a.user && a.user.banner) || '/images/default/banner_3_unoptimised.jpg', des: 'This is your image will display as your banner. Allowed Formats: JPEG, PNG. Max size: 4mb.'})
			]},
			{name: 'account', title: 'Account', render: a => [
				{t: 'span', cl: 'title', txt: a.ops[a.ui].title + ' Settings'},
				fld({id: 'username', maxlength: 32, name: 'User Name', des: `Enter name for user profile url ("${location.origin}/user/{username}"). Please use 32 characters at maximum.`}),
				save('username'),
				fld({type: 'email', name: 'Email', maxlength: 320, des: 'Email will not be publicly displayed. We will email you to verify the change.'}),
				save('email'),
			]},
			/*{name: 'privacy', title: 'Privacy', render: a => [
				{t: 'span', cl: 'title', txt: a.ops[a.ui].title + ' Settings'},
			]},*/
			{name: 'security', title: 'Security', render: a => [
				{t: 'span', cl: 'title', txt: a.ops[a.ui].title + ' Settings'},
				fld({e: {t: 'div', cl:'pass', ch: [
					{t: 'input', at: {type: 'password', maxlength: 256, placeholder: 'New Password', name: 'password'}, e: {oninput: this.changed_fn}},
					{t: 'input', at: {type: 'password', maxlength: 256, placeholder: 'Repeat New Password', name: 'repeat_password'}}
				]}, name: 'Change Password', des: 'Change your account password. Change your password will revoke your account from every other logged sessions.'}),
				save('password'),
				fld({e: {t: 'div'}, name: 'Revoke Seasons', des: "This will logout from all your sessions logged sessions. IAnime doesn't collect any information like IP Address, Device names, Browser names, locations. We couldn't show what are the seasons."}),
				{t: 'div', cl:'rev', ch: [
					{t: 'button', txt: 'Revoke'}
				]},
				fld({e: {t: 'div'}, name: 'Delete Account', des: 'This action will remove all your IAnime account data. Once you delete your account, there is no going back. Please be certain.'}),
				{t: 'div', cl: 'del', ch: [
					{t: 'label', ch: [
						{t: 'label', ch: [
							{t: 'input', s: {display: 'none'}, at: {type: 'checkbox', name: 'delete'}},
							{t: 'div'}
						]},
						{t: 'span', txt: 'Confirm that I want to delete my account.'}
					]},
					{t: 'button', txt: 'Delete'}
				]}
			]}
		]
	}
	load(a) {
		this.ui = 0
		if(!this.ops.some((b,c) => b.name == a.ex ? [this.ui = c] : 0)) {
			try {
				history.pushState(history.state, document.title, '/settings/' + this.ops[this.ui].name)
			}catch(e){console.error(e)}
		}
		meta_init(0, this.ops[this.ui].title + ' Settings')
		this.update()
		this.fUpdate(this.user)
		this.user_fn = a => {
			this.update()
			this.fUpdate(a)
		}
	}
	content() {
		return ([
			sign_req(!this.user),
			{t: 'div', cl: nope(this.user, 'cont'), ch: [
				{t: 'div', cl: 'ops', ch: this.ops.map((a,b) => ({t: 'a', at: {href: '/settings/' + a.name}, cl: ['op', this.ui == b ? 'sel' : 'K'], txt: a.title}))},
				{t: 'div', cl: 'opc', ch: this.ops[this.ui].render(this)}
			]}
		])
	}
}
export {settings}
