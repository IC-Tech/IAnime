/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import '../../icApp/icApp.js'
import {meta_init} from '../meta'
import {page} from '../page'
import './faq.scss'

let icApp = ic.icApp

class faq extends page {
	constructor() {
		super()
		this.name = 'faq'
		var link = a => ({t: 'a', txt: a.t, at: [['href', a.l], ['target', '_blank']]})
		this.faq = [
			{q: 'Why are there advertisements when watching videos?', a: 'We know that advertisements are annoying.\nIAnime dose not show any advertisements. but video providers may contain ads.'},
			{q: 'Why IAnime dose not provides the videos?', a: "The main reason is that we do not have the money to pay for a large storage server."},
			{q: 'How can I report DMCA takedowns?', ch: ['Please Read the ', {t: 'a', txt: 'DMCA page', at: [['href', '/dmca']]}, '.']},
			{q: 'Does IAnime have shortcuts/hotkeys?', a: 'Unfortunately, We do not have shortcut keys. We will build them asap.'},
			{q: 'How many anime do you have?', ch: ['Please check the ', {t: 'a', txt: 'stats page', at: [['href', '/stats']]}, '.']},
			{q: "Why can't I go back/forward?", a: 'We have build different system to offer you and us a better website performance.\ntry to update the browser or refresh the page.'},
			{q: 'How to create an IAnime Account?', a: "The accounts is not complete building and we have a lack of users."},
			{q: 'How to find trending/popular anime?', a: "You can't find them right now. We have a lack of users so we do not have enough data to calculate them. Sorry."},
			{q: 'What is "Safe Mode"?', a: "IAnime could have nsfw/adult/+18 contents. This will let you surf safe on our website and blur/hide all nsfw content."},
			{q: 'Can I donate you?', ch: ['sure, thank you very much.\n', link({t: 'ko-fi.com/imesh', l: 'https://ko-fi.com/imesh'})]},
			{q: 'Links?', ch: ((a,b=[]) => ([a.forEach(a => [b.push(a[0]), b.push(link({t: a[1], l: a[2]})), b.push({t: 'br'})]), b])[1])([
				['Developer: ', 'IC-Tech', 'https://ic-tech.now.sh'],
				['Roadmap: ', 'Trello Board', 'https://trello.com/b/viWs81k8/ianime'],
				['Donate: ', 'ko-fi.com/imesh', 'https://ko-fi.com/imesh'],
				['Client Framework: ', 'icApp-render', 'https://github.com/IC-Tech/icApp'],
				['Source Code: ', 'Github', 'https://github.com/IC-Tech/IAnime'],
				['Source Code: ', 'Gitlab', 'https://gitlab.com/IC-Tech/IAnime'],
				['Source Code: ', 'Bitbucket', 'https://bitbucket.org/IC-Tech/IAnime'],
			])},
		]
		this.faq_ = (a => {
			a = new icApp.e(a.target)
			while(a.v && !a.d.ty) a = a.p
			if(!a.v) return
			a = [a.d.in, a.d.s].map(a => parseInt(a))
			if(!this.faq[a[0]]) return
			this.faq[a[0]].s = !this.faq[a[0]].s
			this.update()
		}).bind(this)
	}
	load() {
		this.faq = this.faq.map(a => {
			a.s = !1
			return a
		})
		meta_init(0, 'Frequently Asked Questions')
	}
	content() {
		var c = (a,b) => b ? [a, 'show'] : a
		var a = (a,b) => ({t: 'div', cl: 'faq', d: {ty: 'q', in: b.toString(), sh: a.s ? 1 : 0}, ch: [
			{t: 'button', cl: c('que-c', a.s), e: [['onclick', this.faq_]], ch: [
				{t: 'span', cl: c('que', a.s), txt: a.q},
				{t: 'div', cl: c('ico', a.s), html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" role="img"><path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path></svg>`}
			]},
			{t: 'span', cl: c('ans', a.s), nodes: a.ch ? 1 : 0, txt: a.a, ch: a.ch}
		]})
		return ([
			{t: 'span', cl: 'title', txt: 'Frequently Asked Questions'},
			...this.faq.map((b,c) => a(b, c))
		])
	}
}
export {faq}
