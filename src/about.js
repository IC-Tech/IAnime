/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import '../icApp/icApp.js'
import {IAR} from '../icApp/icApp-render.js'
import {top, bottom, comp_init, AniUI, EpUI, serEv0} from './comp.js'
import {TitleCase, gtag} from './comm.js'
import {meta_init} from './meta.js'
import './about.scss'

window.ic = window.ic || []
window.ic.pageLoad = Date.now()

document.addEventListener('DOMContentLoaded', () => {
let icApp = ic.icApp
var _root_ = new icApp.e('#root')
;['name="theme-color"', 'name="msapplication-navbutton-color"', 'name="apple-mobile-web-app-status-bar-style"'].forEach(a => new icApp.e(`[${a}]`).sa('content', '#171b22'))

window.IAnime = window.IAnime || {}

class IAnime extends IAR {
	constructor() {
		super()
		this.data = {
			ui: 0
		}
		this.user = {
			login: false,
			avatar: '/images/default/avatar_op.jpg'
		}
		comp_init(a => this.update())
	}
	didMount() {
    console.log('icApp-render:speed - ' + (Date.now() - window.ic.pageLoad))
    meta_init(icApp, 'About')
    gtag('event', 'timing_complete', {
		  name : 'icApp-render',
		  value : (Date.now() - window.ic.pageLoad),
		  event_category: 'render'
		})
		this.update({ui: 1})
	}
	didUpdate() {}
	willUpdate() {}
	render() {
		var a = a => {
			var b = [
				{t: 'span', cl: 'title', txt: a.title},
				{t: 'div', cl: ['block', a.dir ? 's1' : 0].filter(a => !!a), ch: [
					{t: 'div', cl: 'inf', ch: [
						{t: 'span', txt: a.txt}
					]},
					{t: 'div', cl: 'img', ch: [
						{t: 'div', s: {'background-image': `url("${a.img}")`}}
					]}
				]}
			]
			if(a.dir) b[1].ch = b[1].ch.reverse()
			return b
		}
		return ([
			{s: {display: this.data.ui == 0 ? 'flex' : 'none'}},
			{s: {display: this.data.ui == 1 ? 'block' : 'none'}, t:'div', cl: 'main', ch: [
				top(this.user),
				{t: 'main', at:[['id', 'main']], cl: 'content', ch: [
					...a({title: 'About IAnime', img: '/images/ianime-i16-196px.png', txt: "IAnime is just a another place to watch animes for free. IAnime offers subbed dubbed anime shows, movies with a variety of quality options. IAnime does not host any video, it only connects users with relevant videos on the web. IAnime does not show ads, but video providers may contain ads. Our first release was at Wed May 27 2020 01:44:40 GMT+0530."}),
					...a({title: 'About Developer', dir: 1, img: '/images/ic-tech-196px.png', txt: "My name is Imesh Chamara (pronunciation: eemesh). I made the IAnime. I like to make new things and love to learn new things. I'm still just a unprofessional programmer who code as a hobby and its the only thing I good at."}),
					{t: 'div', cl: 'cred', ch: [
						{t: 'span', cl: 'title', txt: 'Credits'},
						{t: 'div', ch: [
							['https://www.mongodb.com/company', 'MongoDB'],
							['https://vercel.com/about', 'Vercel'],
							['https://nodejs.org/en/', 'NodeJS'],
							['https://github.com/IC-Tech/icApp', 'icApp-render'],
							['https://www.cloudaccess.net/about-us/network.html', 'CloudAccess'],
						].map((a,b) => ({t: 'a', cl: 'it', at:[['href', a[0]]], ch:[
							{t: 'div', cl: 'img', s: {'background-image': `url("/images/202006151356.png")`, 'background-position-x': (b * -100) + 'px'}},
							{t: 'span', cl: 'na', txt: a[1]}
						]}))}
					]}
				]},
				bottom()
			]}
		])
	}
}
new IAnime().mount(_root_.v)
})
