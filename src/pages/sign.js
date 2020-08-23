/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {icApp} from 'ic-app'
import {meta_init} from '../meta'
import {TitleCase} from '../comm'
import {page} from '../page'
import {error} from '../error'
import '../style/sign.scss'
import {link} from '../comp'
import {data} from '../data'

var u = (a,c='') => [...Object.keys(a).map(b => b + '=' + encodeURIComponent(a[b])), ...(c ? [c] : [])].join('&')
var ends = {
	google: `${config.google.endpoint}?${u({
		client_id: config.google.id,
		scope: config.google.scope,
		redirect_uri: config.google.redirect,
		ss_domain: location.origin,
		response_type: 'code'
	})}`,
	github: `${config.github.endpoint}?${u({
		client_id: config.github.id,
		scope: config.github.scope,
		redirect_uri: config.github.redirect
	})}`,
	gitlab: `${config.gitlab.endpoint}?${u({
		client_id: config.gitlab.id,
		scope: config.gitlab.scope,
		redirect_uri: config.gitlab.redirect,
		response_type: 'code'
	})}`,
	facebook: `${config.facebook.endpoint}?${u({
		client_id: config.facebook.id,
		scope: config.facebook.scope,
		redirect_uri: config.facebook.redirect
	})}`,
	yahoo: `${config.yahoo.endpoint}?${u({
		client_id: config.yahoo.id,
		scope: config.yahoo.scope,
		redirect_uri: config.yahoo.redirect,
		context_uri: location.origin,
		response_type: 'code'
	})}`,
}

class sign extends page {
	constructor() {
		super()
		this.data = this.data || {}
		this.data.mode = 0
		this.name = 'sign'
		;["https://www.google.com/recaptcha/api.js?onload=recaptcha_load&render=explicit"].forEach(a => {
			var b = new icApp('script',1)
			b.v.src = a //a.src
			b.v.async = !0
			b.v.defer = !0
			new icApp('head').ap(b)
			//b.ae('load', a.fn)
		})
		this.recaptcha_load = a => {
			if(typeof grecaptcha == 'undefined' || this._recaptcha || !this.ready) return
			try {
				this.robotkey = grecaptcha.render(new icApp('#robot').v, {
					sitekey : config.recaptcha,
					theme: 'dark'
				})
				this._recaptcha = 1
				window.recaptcha_load = a => -1
			}
			catch(e) {
				error({code: 11, message: 'reCAPTCHA Render Failed'})
				console.error(e)
			}
		}
		window.recaptcha_load = a => this.recaptcha_load()
		;['opClick', 'submit'].forEach(a => this[a] = this[a].bind(this))
	}
	didMount() {
		this.ready = 1
		this.recaptcha_load()
	}
	load(a) {
		meta_init(0, 'Sign')
		if(a.pram.ic_sign && ends[a.pram.ic_sign = a.pram.ic_sign.toLowerCase()] && (a.pram.code || a.pram.error)) {
			try {
				history.replaceState(history.state, document.title, location.pathname)
			}
			catch(e) {console.error(e)}
			if(!a.pram.code && a.pram.error) error({code: 11, message: TitleCase(a.pram.ic_sign) + ' authentication Failed'})
			else if(a.pram.code) {

			}
		}
	}
	signEx(a) {
		if(ends[a]) window.location.href = ends[a]
	}
	opClick(a) {
		a = new icApp(a.target)
		if(!a.v || a.d.ty != 'op') return
		this.update({mode: parseInt(a.d.in) || 0})
	}
	submit(a) {
		a.preventDefault()
		var b = {}
		;['email', 'password', 'repeat_password'/*, 'code'*/].forEach(a => {
			var c = new icApp(`[name="${a}"]`)
			if(!c.v || !c.val) return
			b[a] = c.val.trim()
		})
		;['password', 'repeat_password'].forEach(a => b[a] ? [b[a] = btoa(b[a])] : 0)
		try {
			b.recaptcha = grecaptcha.getResponse(this.robotkey)
		}catch (e) {console.error(e)}
		if(!b.email) return error({code: 9, message: 'email required'})
		if(this.data.mode == 0 && !b.password) return error({code: 9, message: 'password required'})
		if(this.data.mode == 1 && b.password != b.repeat_password) return error({code: 9, message: 'repeated password dose not match'})
		
		return !1
	}
	content() {
		var ops = [0,1,2,3].filter(a => this.data.mode != a),
		opns = ['Login', 'Register', 'Frogot Password', 'Resend Verification Email'],
		opr = a => ({t: 'button', at: {type: 'button'}, cl: 'op', d: {ty: 'op', in: a = ops[a]}, e: {onclick: this.opClick}, txt: opns[a]})
		return ([
			{t: 'span', cl: 'title', txt: (['Login to IAnime', 'Register to IAnime', 'Frogot Password', 'Resend Verification Email'])[this.data.mode]},
			//{t: 'span', cl: 'desc', txt: "You do not need an account to watch and download anime. This is just an external feature to improve our service."},
			{t: 'span', cl: 'desc', s: {display: this.data.mode == 1 ? 'block' : 'none'}, nodes: 1, ch: ["Email registration is not recommended due server issues. ", link({l: 'https://gist.github.com/IC-Tech/d367256b87fef431dc58956885dbf3a3', t: 'More Info'}), '. use the social media access if you can.']},
			{t: 'div', cl: 'cont', ch: [
				{t: 'form', s: {display: !this.wait ? 'block' : 'none'}, at: {method: 'post', action: location.pathname, target: '_self'}, e: {onsubmit: this.submit}, ch: [
					{t: 'div', cl: 'fields', ch: [{t: 'email', n: 'Email'}, {t: 'password', n: 'Password', d: this.data.mode != 1 && this.data.mode != 0}, {t: 'password', f: 'repeat_password', n: 'Repeat Password', d: this.data.mode != 1}, {t: 'text', f: 'code', n: 'Code', d: this.data.mode != 4}].map(a => ({t: 'div', cl: ['field', a.d ? 'nope' : 'K'], ch: [
						{t: 'span', cl: 'tit', txt: a.n},
						{t: 'input', at: {type: a.t, placeholder: a.n, name: a.f || a.t}}
					]}))},
					{t: 'div', cl: 'ops', ch: [
						opr(0), {t: 'span', cl: 'dot', txt: '•'}, opr(1), {t: 'span', cl: 'dot', txt: '•'}, opr(2)
					]},
					{t: 'div', cl: 'robot', ch: [
						{t: 'div', at: {id: 'robot'}}
					]},
					{t: 'div', cl: 'sbtn-c', ch: [
						{t: 'button', cl: 'sbtn', txt: (['Login', 'Register', 'Send Email', 'Send Email'])[this.data.mode]}
					]},
				]},
				{t: 'div', s: {display: !this.wait ? 'block' : 'none'}, cl: 'exop', ch: [
					{t: 'span', txt: 'Continue With'},
					{t: 'div', cl: 'exops', ch:[
						{t: 'button', e: {onclick: a => this.signEx('google')}, at: {title: 'Sign with Google'}, html: `<svg xmlns="http://www.w3.org/2000/svg" focusable="false" role="img" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>`},
						{t: 'button', e: {onclick: a => this.signEx('github')}, at: {title: 'Sign with Github'}, html: `<svg xmlns="http://www.w3.org/2000/svg" focusable="false" role="img" viewBox="0 0 496 512"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>`},
						{t: 'button', e: {onclick: a => this.signEx('gitlab')}, at: {title: 'Sign with Gitlab'}, html: `<svg xmlns="http://www.w3.org/2000/svg" focusable="false" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M105.2 24.9c-3.1-8.9-15.7-8.9-18.9 0L29.8 199.7h132c-.1 0-56.6-174.8-56.6-174.8zM.9 287.7c-2.6 8 .3 16.9 7.1 22l247.9 184-226.2-294zm160.8-88l94.3 294 94.3-294zm349.4 88l-28.8-88-226.3 294 247.9-184c6.9-5.1 9.7-14 7.2-22zM425.7 24.9c-3.1-8.9-15.7-8.9-18.9 0l-56.6 174.8h132z"></path></svg>`},
						{t: 'button', e: {onclick: a => this.signEx('facebook')}, at: {title: 'Sign with Facebook'}, html: `<svg xmlns="http://www.w3.org/2000/svg" focusable="false" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path></svg>`},
						{t: 'button', e: {onclick: a => this.signEx('yahoo')}, at: {title: 'Sign with Yahoo!'}, html: `<svg xmlns="http://www.w3.org/2000/svg" focusable="false" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M223.69,141.06,167,284.23,111,141.06H14.93L120.76,390.19,82.19,480h94.17L317.27,141.06Zm105.4,135.79a58.22,58.22,0,1,0,58.22,58.22A58.22,58.22,0,0,0,329.09,276.85ZM394.65,32l-93,223.47H406.44L499.07,32Z"></path></svg>`}
					]}
				]},
				{t: 'div', s: {display: this.wait ? 'block' : 'none'}, cl: 'load', ch: [
					{t: 'div'}
				]}
			]}
		])
	}
}
export {sign}
