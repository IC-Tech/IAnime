import {icApp} from 'ic-app'

const meta_init = (a, b, c, d, e) => {
	title(b || defaults.title)
	description(c || defaults.description)
	image(d || defaults.image)
	url(e || defaults.url)
}
const _con = (a, c) => a.forEach(a => {
	var b = new icApp(`${a[0]}[${a[1][0]}="${a[1][1]}"]`)
	if(b.v) return b.sa(a[2][0], c)
	b = new icApp(a[0], 1)
	a.slice(1).forEach(a => b.sa(a[0], a[1] == '!' ? c : a[1]))
	new icApp('head').ap(b.v)
})
const title = a => _con([
	[
		'meta',
		['name', 'title'],
		['content', '!'],
		['property', 'og:title']
	],
	[
		'meta',
		['name', 'twitter:title'],
		['content', '!']
	],
], new icApp('title').txt = (a=a.toString().trim()).length > 0 ? a + ' · IAnime' : defaults.title)
const description = a => _con([
	[
		'meta',
		['name','description'],
		['content', '!']
	],
	[
		'meta',
		['name','twitter:description'],
		['content', '!']
	],
	[
		'meta',
		['property','og:description'],
		['content', '!']
	],
], a)
const image = a => _con([
	[
		'meta',
		['name', 'twitter:image'],
		['content', '!']
	],
	[
		'meta',
		['property', 'og:image'],
		['content', '!']
	],
], a)
const url = a => _con([
	[
		'link',
		['rel', 'canonical'],
		['href', '!']
	],
	[
		'meta',
		['property', 'og:url'],
		['content', '!']
	],
], a)
const defaults = {
	title: 'IAnime',
	description: 'Watch, Stream Subbed Dubbed Anime Shows, Movies for Free at IAnime',
	image: 'https://ianime.now.sh/images/ianime-i17-512px.png',
	url: location.origin // https://ianime.now.sh
}
export { meta_init, title, description, image, url, defaults }
