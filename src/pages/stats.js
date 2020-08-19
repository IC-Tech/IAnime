/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {icApp} from 'ic-app'
import {ACreate, num} from '../comm'
import {meta_init} from '../meta'
import {data} from '../data'
import {page} from '../page'
import Chart from 'chart.js'
import (/* webpackPreload: true */ '../style/stats.scss')

class stats extends page {
	constructor() {
		super()
		this.name = 'stats'
		this.charts = []
		this.data = [[],[],[]]
		this.parse = async a => {
			a = await data('stats')
			if(!(a = (a && a.success && a.result))) return
			this.load_ = 0
			this._load = 0
			var b = (b,c) => a[c] = a[b].history.map(a => ({x: new Date(a.time), y: a.count}))
			;[
				'anime',
				'episode',
				'video',
			].map((a,c) => b(a,c))
			this.data = a
			this.chartsUpdate(1)
			this.update()
		}
		this.chartsUpdate = data => {
			var a = Array.from(icApp.qsa('.chart'))
			if(!this.chartsE || this.chartsE.map((b,c) => a[c] != b)) {
				this.chartsE = a
				this.charts.forEach(a => a && a.destroy())
				this.charts = a.map((a,b) => new Chart(a.getContext('2d'), {
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
				}))
			}
			if(!data) return
			this.charts.forEach((a,b) => {
				a.data.datasets[0].data = this.data[b]
				a.update()
			})
		}
		this.csize = a => {
			if(!this.active || this.load_) return
			this.chartsUpdate()
			;(this.chartsE|| []).forEach(a => {
				if(!a && !a.parentElement) return
				a.width = a.parentElement.offsetWidth
				a.height = a.parentElement.offsetHeight
			})
			this.charts.forEach(a => a.resize())
		}
	}
	didMount() {
		Chart.defaults.global.defaultFontColor = '#eee'
		window.addEventListener('resize', this.csize)
	}
	load() {
		this.load_ = 1
		this._load = 1
		this.parse()
		this.update()
		meta_init(0, 'Stats')
	}
	didUpdate() {
		this.csize()
	}
	willUpdate() {}
	content() {
		var b = a => this.load_ ? ['skeleton', a] : a
		var a = a => ([
			{t: 'span', cl: 'title', txt: 'New ' + a.n},
			{t: 'span', cl: 'info', txt: a.n + ': ' + (this.load_ ? 'loading..' : num((a = this.data[a.v][this.data[a.v].length - 1]) && a.y || 0))},
			{t: 'div', cl: b('chart-c'), ch: [
				{t: 'canvas', cl: 'chart', txt: 'Your browser does not support.'},
			]}
		])
		return ([
			{t: 'span', cl: 'title-a', txt: 'IAnime Stats'},
			{t: 'span', cl: b('range'), txt: this.load_ ? 'loading..' : (this.data.range || []).map(a => new Date(a).toDateString()).join(' - ')},
			...(b => {
				(b = b.map((b,c) => a({n: b, v: c}))).slice(1).forEach(c => b[0] = b[0].concat(...c))
				return b[0]
			})(['Animes', 'Episodes', 'Videos'])
		])
	}
}

export {stats}
