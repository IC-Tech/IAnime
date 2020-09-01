import {icApp} from 'ic-app'
import {TitleCase, parentClass} from './comm'
import {data} from './data'
import {logout} from './account'
const _logout = a => logout()
var _ev, fo, _res = {length: 0}, res = [], serTimeout, _search, up = a => {}, state = 0, req
var search = a => {
	if(!(a = _search)) return
	if(_ev) _ev(a_search)
	state = 1
	up()
	const r = Date.now()
	req = r
	data('anime:search', {search: a, mode: 'advanced', limit: 6, filter: {data: {title: 1, poster: 1, web: 1}}}).then(a => {
		if(r != req) return
		if(!a.success) return state = 2
		res = ((_res = a.result).data || [])
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
	a = fo = parentClass(new icApp(a.target), 'top')
	var b = new icApp('.top')
	var c = icApp.qs('.top-r-m input')
	if(b.clc('fo') && !a) b.clr('fo')
	else if(!b.clc('fo') && a) b.cla('fo')
	if(!a && c.checked) c.checked = !!0
})
const nope = (a, b) => [...(typeof b == 'string' ? [b] : b), a ? 'K' : 'nope']
const top = user => ({t: 'header', cl: fo ? ['top', 'fo'] : 'top', ch: [
	{t:'a', txt: 'Skip to content', at: {href: '#main'}},
	{t:'div', cl: 'top-l', ch: [
		{t: 'a', cl: 'topl', cl: 'logo', at: {href: '/'}, ch: [
			{t: 'div', ch: [
				{t: 'img', at:[['src', '/images/ianime-i16-196px.png'], ['alt', 'IAnime icon']]},
			]}
		]},
		{t: 'a', cl: 'topl', at: {href: '/search'}, ch: [
			{t: 'span', txt: 'Browse'}
		]}
	]},
	{t: 'div', cl: 'top-r', ch: [
		{t: 'div', cl: 'ser', ch: [
			{t: 'label', ch: [
				{t: 'div', html: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="img" viewBox="0 0 25 25"><path d="M20.067 18.933l-4.157-4.157a6 6 0 10-.884.884l4.157 4.157a.624.624 0 10.884-.884zM6.5 11c0-2.62 2.13-4.75 4.75-4.75S16 8.38 16 11s-2.13 4.75-4.75 4.75S6.5 13.62 6.5 11z"></path></svg>'},
				{t:'input', at:{type: 'text', name: 'quick-search', placeholder: 'Search Anime'}, e: {oninput: serEv1}}
			]},
			{t: 'div', cl: 's-res', ch: state != 0 ? [{t: 'div', cl: 'n-res', ch: [{t: 'span', txt: state == 1 ? 'Searching...' : 'Nothing found'}]}] : res.map(a => ({t:'div', cl: 'res-c', ch: [
				{t:'a', at: [['href', a.web]], cl:'res', ch: [
						{t:'div', cl:'img', s:{'background-image': `url("${a.poster || '/images/default/poster_2.jpg'}"), url("/images/default/poster.gif")`}},
						{t:'div', cl: 'name-c', ch: [
							{t:'span', cl: 'name', txt: TitleCase(a.title)}
						]}
					]}
				]})
			).concat(_res.length > 6 ? ([{t: 'a', at:[['href', '/search?q=' + encodeURIComponent(_search)]], cl: 'more', txt: 'Show More'}]) : ([]))}
		]},
		{t: 'a', cl: nope(!user, 'topl'), at: {href: '/sign?ui=register'}, ch:[
			{t: 'span', txt: 'Sign Up'}
		]},
		{t: 'a', cl: nope(!user, 'topl'), at: {href: '/sign'}, ch:[
			{t: 'span', txt: 'Sign In'}
		]},
		{t: 'label', cl: nope(user, ['topl', 'prof']), at: {title: 'Profile', role: 'button', 'aria-label': 'user menu', tabindex: '0'}, ch:[
			{t: 'div', cl: 'prof-c', at: {title: 'Profile'}, ch:[
				{t:'div', s: {'background-image': `url(${(user && user.poster) || '/images/default/avatar_op.jpg'})`}},
			]},
			{t: 'input', at:[['type', 'checkbox']]},
			{t: 'div', cl: 'men', ch: [
				{t: 'a', txt: 'Profile', at: {href: user && user.web}},
				{t: 'a', txt: 'Settings', at: {href: '/settings'}},
				{t: 'button', txt: 'Logout', e: {onclick: _logout}},
			]}
		]}
	]},
	{t: 'label', cl: 'top-r-m', at: {role: 'button', 'aria-label': 'menu', tabindex: '0'}, ch: [
		{t: 'input', at:[['type', 'checkbox']]},
		{t: 'div', cl: 'btn', ch: [0,0,0].map(a => ({t: 'div'}))},
		{t: 'div', cl: 'men', ch: [
			{t: 'a', cl: 'mi', txt: 'Search', at: {href: '/search'}},
			{t: 'a', cl: 'mi', _: !!user, txt: 'Sign Up', at: {href: '/sign?ui=register'}},
			{t: 'a', cl: 'mi', _: !!user, txt: 'Sign In', at: {href: '/sign'}},
			{t: 'a', cl: 'mi', _: !user, txt: 'Profile', at: {href: user && user.web}},
			{t: 'a', cl: 'mi', _: !user, txt: 'Settings', at: {href: '/settings'}},
			{t: 'button', cl: 'mi', _: !user, txt: 'Logout', e: {onclick: _logout}},
		].filter(a => !a._)}
	]}
]})
const bottom = a => ({t: 'footer', cl: 'bottom', ch: [
	{t: 'div', ch: [
		{t: 'div', ch: [{t: 'span', nodes: 1, ch: [
			{t: 'a', at: {href: '/privacy'}, txt: 'Privacy'}, ' • ',
			{t: 'a', at: {href: '/terms'}, txt: 'Terms'}, ' • ',
			{t: 'a', at: {href: '/dmca'}, txt: 'DMCA'}, ' • ',
			{t: 'a', at: {href: '/faq'}, txt: 'FAQ'}, ' • ',
			{t: 'a', at: {href: 'https://ic-tech.now.sh/contact.html?product=IAnime', target: '_blank', rel: 'noreferrer'}, txt: 'Contact'},
		]}]},
		{t: 'span', txt: 'IAnime © 2020, All Rights Reserved.'}
	]}
]})
const comp_init = a => up = a
const clean_search = a => {
	res = []
	_res = {length:0}
	state = 0
	if((a = new icApp('.top .ser input')).v) a.val = ''
}
const animeUI = a => ({t:'div', cl: 'ani-c', ch: [
	{t:'a', cl: a == 'skeleton' ? ['skeleton', 'ani'] : 'ani', at: (b => a == 'skeleton' ? b.map(a => [a[0], undefined]) : b)([['href', a.web], ['title', TitleCase(a.title)]]), ch: [
		{t:'div', cl: 'img-c', ch: [
			{t:'div', cl: 'img', s: {'background-image': a == 'skeleton' ? '' : `url("${a.poster || '/images/default/poster_2.jpg'}"), url("/images/default/poster.gif")`}},
			...(a.d_year ? [{t: 'span', cl: 'ani-yr', txt: a.d_year}] : []),
			...(a.ep ? [{t: 'span', cl: 'ani-ep', txt: 'Ep.' + a.ep}] : []),
		]},
		{t:'span', cl: 'name', txt: a == 'skeleton' ? '' : TitleCase(a.title)}
	]}
]})
const episodeUI = (a,b,op) => (op = op || {}).view == 'list' ? ({t: 'div', cl: ['ep', 'list', a == 'skeleton' ? 'skeleton' : 'k'], ch: [
	{t: 'div', cl: 'se-1', ch: [
		{t: 'a', cl: 'poster-c', at: a == 'skeleton' ? [['href', undefined],['title', '']] : [['href', a.web], ['title', TitleCase(a.title + ((a.name && (' ' + a.name)) || ''))]], ch: [
			{t:'div', cl: 'poster', s: {'background-image': a == 'skeleton' ? '' : `url("${a.image || b.poster || '/images/default/episode_2.jpg'}"), url("/images/default/episode.gif")`}}
		]},
	]},
	{t:'div', cl: 'se-2', ch: [
		{t:'a', at: {href: a == 'skeleton' ? undefined : a.web}, cl: 'title', txt: a == 'skeleton' ? '' : TitleCase(a.title)},
		{t:'a', at: {href: a == 'skeleton' ? undefined : a.web}, cl: 'name', txt: a == 'skeleton' ? '' : TitleCase(a.name) || ''},
	]}
]}) : ({t:  'a', cl: ['ep', 'grid', a == 'skeleton' ? 'skeleton' : 'k'], at: a == 'skeleton' ? [['href', undefined],['title', '']] : [['href', a.web], ['title', TitleCase(a.title + ((a.name && (' ' + a.name)) || ''))]], ch: [
	{t:'div', cl: 'poster-c', ch: [
		{t:'div', cl: 'poster', s: {'background-image': a == 'skeleton' ? '' : `url("${a.image || b.poster || '/images/default/episode_2.jpg'}"), url("/images/default/episode.gif")`}}
	]},
	{t:'span', cl: 'title', txt: a == 'skeleton' ? '' : TitleCase(a.title + ' ')},
	{t:'span', cl: 'name', txt: a == 'skeleton' ? '' : TitleCase(a.name) || ''},
]})
const userUI = a => ({t:'a', cl: a == 'skeleton' ? ['skeleton', 'usr'] : 'usr', at: (b => a == 'skeleton' ? b.map(a => [a[0], undefined]) : b)([['href', a.web], ['title', a.title]]), ch: [
	{t:'div', cl: 'img-c', ch: [
		{t:'div', cl: 'img', s: {'background-image': a == 'skeleton' ? '' : `url("${a.poster || '/images/default/avatar_op.jpg'}"), url("/images/default/poster.gif")`}},
	]},
	{t:'span', cl: 'name', txt: a == 'skeleton' ? '' : a.title}
]})
const link = a => ({t: 'a', txt: a.t, at: {href: a.l, target: '_blank', rel: 'noopener'}})
const sign_req = a => ({t: 'div', cl: nope(a, 'sign-req'), ch: [
	{t: 'span', cl: 'des', txt: 'Create an account or log in to IAnime to continue'},
	{t: 'a', cl: 'btn0', at: {href: '/sign?ui=register'}, txt: 'Sign Up'},
	{t: 'a', cl: 'btn0', at: {href: '/sign'}, txt: 'Sign In'}
]})
export {top, bottom, comp_init, serEv0, animeUI as AniUI, episodeUI as EpUI, clean_search, link, sign_req, userUI as UsrUI}
