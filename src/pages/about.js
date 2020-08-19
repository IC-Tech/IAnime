/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import '../style/about.scss'
import {meta_init} from '../meta'
import {page} from '../page'

class about extends page {
	constructor() {
		super()
		this.name = 'about'
	}
	load() {
		meta_init(0, 'About')
	}
	content() {
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
		var b = [1590524080000, parseInt(__BUILD_TIME__)]
		return ([
			...a({title: 'About IAnime', img: '/images/ianime-i16-196px.png', txt: "IAnime is just a another place to watch animes for free. IAnime offers subbed dubbed anime shows, movies with a variety of quality options. IAnime does not host any video, it only connects users with relevant videos on the web. IAnime does not show ads, but video providers may contain ads. Our first release was at " + new Date(b[0]).toUTCString() + " and This is IAnime " + __VER__ + " at " + new Date(b[1]).toUTCString() + '.'}),
			//...a({title: 'About Developer', dir: 1, img: '/images/ic-tech-196px.png', txt: "My name is Imesh Chamara (pronunciation: eemesh). I made the IAnime. I like to make new things and love to learn new things. I'm still just a unprofessional programmer who code as a hobby and its the only thing I good at."}),
			{t: 'div', cl: 'cred', ch: [
				{t: 'span', cl: 'title', txt: 'Credits'},
				{t: 'div', ch: [
					['https://www.mongodb.com/company', 'MongoDB'],
					['https://vercel.com/about', 'Vercel'],
					['https://github.com/IC-Tech/icApp', 'icApp-render'],
					['https://www.cloudaccess.net/about-us/network.html', 'CloudAccess'],
				].map((a,b) => ({t: 'a', cl: 'it', at:[['href', a[0]]], ch:[
					{t: 'div', cl: 'img', s: {'background-image': `url("/images/202006151356.png")`, 'background-position-x': (b * -100) + 'px'}},
					{t: 'span', cl: 'na', txt: a[1]}
				]}))},
				{t: 'span', cl: 'end', txt: 'Developed by IC-Tech'}
			]}
		])
	}
}
export {about}
