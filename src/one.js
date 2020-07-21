/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import '../icApp/icApp.js'
import {IAR} from '../icApp/icApp-render.js'

;(a => {
window.ic = window.ic || []
window.IAnime = window.IAnime || {}
window.ic.pageLoad = Date.now()
let icApp = ic.icApp, cpage
var _root_ = new icApp.e('#root')
;['name="theme-color"', 'name="msapplication-navbutton-color"', 'name="apple-mobile-web-app-status-bar-style"'].forEach(a => new icApp.e(`[${a}]`).sa('content', '#171b22'))
const pages = ['anime', 'episode', 'dmca', 'privacy', 'terms', 'search', 'stats', 'about', 'random', 'faq', 'home', '']
class IAnime extends IAR {
	constructor() {
		super()
		this.data = {
			ui: 0
		}
		this.pages = {}
		this.getPage = async a => {
			if(this.pages[a]) return this.pages[a]
			var b = await import(
				/* webpackMode: 'lazy' */
				'./pages/' + a
			)
			b = new b[a]
			const c = new icApp.e(icApp.cE('div'))
			c.st.display = this.data.ui == 1 ? 'block' : 'none'
			c.cla('main')
			b.mount(c.v)
			return this.pages[a] = b
		}
		this.switchPage = async (a, op) => {
			cpage = cpage || {}
			cpage._load = 1
			if(cpage.update) cpage.update()
			var b = await this.getPage(a || 'home')
			b._load = 1
			b.loadUrl = this.loadUrl
			b.switchPage = this.switchPage
			var a = cpage.e || new icApp.e('.main')
			a.p.v.replaceChild(b.e.v, a.v)
			cpage.active = 0
			if(cpage.core_unload) cpage.core_unload(op)
			cpage = b
			cpage.active = 1
			cpage._load = 0
			cpage.core_load(op)
			new icApp.e(document.body).sa('ui', cpage.name)
			this.update()
			document.scrollingElement.scrollTop = 0
		}
		this.urlTest = a => {
			var b
			if(!a) return 0
			a = (a.startsWith('//') ? location.protocol + a : a).replace(location.origin, '')
			if(a.startsWith('http')) return 0
			if(!a.startsWith('/')) a = (b = location.pathname.split('/')).slice(0, b.length - 1).join('/') + '/' + a
			a = a.split('/').slice(1)
			if(a.length == 0) return 0
			if(!a[0] && a[0] == '') a[0] == 'home'
			return pages.some(b => b == a[0]) ? a : 0
		}
		this.loadUrl = (a,b) => {
			a = a || (this.urlTest(typeof b == 'string' ? b : location.href) || !1)
			b = (b = b || a && a.join('/')) && b.startsWith('/') ? b : (typeof b == 'string' ? '/' + b : b)
			if(a && b && pages.some(b => b == a[0])) {
				this.switchPage(...a)
			}
			else {
				this.switchPage('nope')
			}
		}
    this.click = (a => {
    	var b = new icApp.e(a.target)
    	while(b.v && !(b.tag.toLowerCase() == 'a' && b.v.href && !b.d.reg)) b = b.p
    	if(b.v && (b = this.urlTest(b.v.href))) {
    		a.preventDefault()
    		this.loadUrl(b)
    		return !1
    	}
    }).bind(this)
	}
	didMount() {
    document.addEventListener('click', this.click)
    //window.addEventListener("unload", _ => navigator.sendBeacon("/api/sayonara", window.ic_token || ' '))
    this.loadUrl(0, '/')
		this.update({ui: 1})
	}
	render() {
		return ([
			{s: {display: this.data.ui == 0 ? 'flex' : 'none'}},
			{s: {display: this.data.ui == 1 ? 'block' : 'none'}, t:'div', cl: 'main', ch: (cpage && cpage.render && cpage.render()) || []}
		])
	}
}
new IAnime().mount(_root_.v)
})()
