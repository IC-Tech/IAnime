/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import '../icApp/icApp.js'
import {IAR} from '../icApp/icApp-render.js'
import {top, bottom, comp_init} from './comp.js'
import {TitleCase, gtag, num} from './comm.js'
import {meta_init} from './meta.js'
import './stats.scss'
import Chart from 'chart.js'

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
		this.stats = {}
    this.charts = []
		this.data = []
		if(window.IAnime.page_data && window.IAnime.page_data.stats) {
			this.stats = window.IAnime.page_data.stats
			var b = (a,b,c,d=0) => this.data[c] = this.stats[a].sort((a,b) => a.time - b.time).map(a => ({x: new Date(a.time), y: (d = d + a[b])}))
			b('animes', 'anime', 0)
			b('episodes', 'episode', 1)
			b('videos', 'video', 2)
		}
    this.csize = (a => {
    	Array.from(icApp.qsa('.chart')).forEach(a => {
    		a.width = a.parentElement.offsetWidth
    		a.height = a.parentElement.offsetHeight
    	})
    	//this.charts.forEach(a => a.resize())
    }).bind(this)
		comp_init(a => this.update())
	}
	didMount() {
    console.log('icApp-render:speed - ' + (Date.now() - window.ic.pageLoad))

    gtag('event', 'timing_complete', {
		  name: 'icApp-render',
		  value: (Date.now() - window.ic.pageLoad),
		  event_category: 'render'
		})
		window.addEventListener('resize', this.csize)
    var b = (a,b) => {
			this.charts[b] = new Chart(a, {
				type:'line',
				data:{
					//labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
					datasets: [{
						label: (['Animes', 'Episodes', 'Videos'])[b],
						backgroundColor: "rgba(255,99,132,0.2)",
						borderColor: "rgba(255,99,132,1)",
						borderWidth: 2,
						data: this.data[b],
					}]
				},
				options: {
	        scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'month',
                displayFormats: {
                  quarter: 'MMM YYYY'
                }
              }
	          }]
          }
        }
  	  })
    }
    meta_init(icApp, 'Stats')
		this.update({ui: 1})
		Chart.defaults.global.defaultFontColor = '#eee'
		Array.from(icApp.qsa('.chart')).forEach((a,c) => b(a,c))
	}
	didUpdate() {
		this.csize()
	}
	willUpdate() {}
	render() {
		var a = a => ([
			{t: 'span', cl: 'title', txt: 'New ' + a.n},
			{t: 'span', cl: 'info', txt: a.n + ': ' + num(this.data[a.v][this.data[a.v].length - 1].y)},
			{t: 'div', cl: 'chart-c', ch: [
				{t: 'canvas', cl: 'chart'},
			]}
		])
		return ([
			{s: {display: this.data.ui == 0 ? 'flex' : 'none'}},
			{s: {display: this.data.ui == 1 ? 'block' : 'none'}, t:'div', cl: 'main', ch: [
				top(this.user),
				{t: 'main', at:[['id', 'main']], cl: 'content', ch: [
					{t: 'span', cl: 'title-a', txt: 'IAnime Stats'},
					...a({n: 'Animes', v: 0}),
					...a({n: 'Episodes', v: 1}),
					...a({n: 'Videos', v: 2}),
				]},
				bottom()
			]}
		])
	}
}
new IAnime().mount(_root_.v)
})
