import '../icApp/icApp.js'
import {XHR} from '../icApp/common.js'
import {TitleCase, API, parentClass} from './comm.js'
const icApp = ic.icApp
var _ev, fo, _res = {length: 0}, res = [], serTimeout, _search, up = a => {}, state = 0, req
var search = a => {
	if(!(a = _search)) return
	if(_ev) _ev(a_search)
	state = 1
	up()
	//no advanced mode, for speed improvement
	//maybe I should add it anyway
	const r = Date.now()
	req = r
	XHR(API + '/search?q=' + encodeURIComponent(a) + '&mode=advanced&limit=6', a => {
		if(r != req) return
		if(!a.success) return state = 2
		res = (_res = a.result).data
		state = _res.length == 0 ? 2 : 0
		up()
	})
}
var serEv1 = a => {
	a = serEv0({e: a.target, timeout: serTimeout, search: search})
	serTimeout = a.timeout
	_search = a._search
}
var serEv0 = op => {
	var a = op.e
	var c = [a.selectionStart, a.selectionEnd, a.selectionDirection]
	var b = TitleCase(op._search = a.value.toLowerCase())
	if(op.search) {
		clearTimeout(op.timeout)
		op.timeout = setTimeout(op.search, 1000)
	}
	if(a.value != b) a.value = b
	if(a.selectionStart != c[0]) a.selectionStart = c[0]
	if(a.selectionEnd != c[1]) a.selectionEnd = c[1]
	if(a.selectionDirection != c[2]) a.selectionDirection = c[2]
	return op
}
document.addEventListener('click', a => {
	a = fo = parentClass(new icApp.e(a.target), 'top')
	var b = new icApp.e('.top')
	var c = icApp.qs('.top-r-m input')
	if(b.clc('fo') && !a) b.clr('fo')
	else if(!b.clc('fo') && a) b.cla('fo')
	if(!a && c.checked) c.checked = !!0
})
const top = user => ({t: 'header', cl: fo ? ['top', 'fo'] : 'top', ch: [
	{t:'a', txt: 'Skip to content', at: [['href', '#main']]},
	{t:'div', cl: 'top-l', ch: [
		{t: 'a', cl: 'logo', at: [['href', '/']], ch: [
		 	{t: 'div', ch: [
				{t: 'img', at:[['src', '/favicon-32x32.png'], ['alt', 'IAnime icon']]},
				{t: 'span', txt: 'IAnime'}
		 	]}
		]},
		{t: 'a', at: [['href', '/search']], ch: [
			{t: 'span', txt: 'Browse'}
		]}
	]},
	{t: 'div', cl: 'top-r', ch: [
		{t: 'div', cl: 'ser', ch: [
			{t: 'div', ch: [
				{t: 'div', html: '<svg width="25" height="25" class="svgIcon-use" viewBox="0 0 25 25"><path d="M20.067 18.933l-4.157-4.157a6 6 0 10-.884.884l4.157 4.157a.624.624 0 10.884-.884zM6.5 11c0-2.62 2.13-4.75 4.75-4.75S16 8.38 16 11s-2.13 4.75-4.75 4.75S6.5 13.62 6.5 11z"></path></svg>'},
				{t:'input', at:[['type', 'text']], e: [['oninput', serEv1]]}
			]},
			{t: 'div', cl: 's-res', ch: state != 0 ? [{t: 'div', cl: 'n-res', ch: [{t: 'span', txt: state == 1 ? 'Searching...' : 'Nothing found'}]}] : res.map(a => ({t:'div', cl: 'res-c', ch: [
				{t:'a', at: [['href', a.web]], cl:'res', ch: [
						{t:'div', cl:'img', s:{'background-image': `url("${a.poster || '/images/default/poster_2.jpg'}"), url("/images/default/poster.gif")`}},
						{t:'div', cl: 'name-c', ch: [
							{t:'span', cl: 'name', txt: TitleCase(a.name)}
						]}
					]}
				]})
			).concat(_res.length > 6 ? ([{t: 'a', at:[['href', '/search?q=' + encodeURIComponent(_search)]], cl: 'more', txt: 'Show More'}]) : ([]))}
		]},
		{t:'div', cl: 'prof', s: {'background-image': `url(${user.avatar})`}, ch: []}
	]},
	{t: 'label', cl: 'top-r-m', ch: [
		{t: 'input', at:[['type', 'checkbox']]},
		{t: 'div', cl: 'btn', ch: [0,0,0].map(a => ({t: 'div'}))},
		{t: 'div', cl: 'men', ch: [
			{t: 'a', txt: 'Search', at: [['href', '/search']]},
			{t: 'a', txt: 'Profile'}
		]}
	]}
]})
const bottom = a => ({t: 'footer', cl: 'bottom', ch: [
	{t: 'div', ch: [
		{t: 'div', ch: [{t: 'span', nodes: 1, ch: [
			{t: 'a', at: [['href', '/privacy']], txt: 'Privacy Policy'}, ' | ',
			{t: 'a', at: [['href', '/terms']], txt: 'Terms of Service'}, ' | ',
			{t: 'a', at: [['href', '/dmca']], txt: 'Disclaimer'}, ' | ',
			{t: 'a', at: [['href', '/dmca']], txt: 'DMCA'}, ' | ',
			{t: 'a', at: [['href', '/stats']], txt: 'Stats'}, ' | ',
			{t: 'a', at: [['href', '/about']], txt: 'About'},
		]}]},
		{t: 'span', nodes: 1, ch: ['IAnime © 2020, All Rights Reserved. Developed by ', {t: 'a', at: [['href', 'https://ic-tech.now.sh']], txt: 'IC-Tech'}]}
	]}
]})
const comp_init = a => up = a
const animeUI = a => ({t:'div', cl: 'ani-c', ch: [
	{t:'a', cl: 'ani', at:[['href', a.web], ['title', TitleCase(a.name)]], ch: [
		{t:'div', cl: 'img', s: {'background-image': `url("${a.poster || '/images/default/poster_2.jpg'}"), url("/images/default/poster.gif")`}, ch: [
			...(a.ep ? [{t: 'span', cl: 'ani-ep', txt: 'Ep.' + a.ep}] : []),
			...(a.d_year ? [{t: 'span', cl: 'ani-yr', txt: a.d_year}] : []),		
		]},
		{t:'span', cl: 'name', txt: TitleCase(a.name)}
	]}
]})
const episodeUI = (a,b,c) => ({ t: 'a', at: [['href', a.web], ['title', TitleCase((a.a = (c ? c + ' ' : '') + 'Episode ' + (a.ep || '')) + ' ' + (a.name || ''))]], cl: 'ep', ch: [
	{t:'div', cl: 'poster', s: {'background-image': `url("${a.image || b.poster || '/images/default/episode_2.jpg'}"), url("/images/default/episode.gif")`}},
	{t:'span', cl: 'title', txt: TitleCase(a.a + ' ')},
	{t:'span', cl: 'name', txt: TitleCase(a.name) || ''},
]})
export {top, bottom, comp_init, serEv0, animeUI as AniUI, episodeUI as EpUI}
