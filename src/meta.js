var icApp = (window.ic && window.ic.icApp) || {}
const meta_init = (a, b, c, d, e) => {
	icApp = a
	if(b) title(b)
	if(c) description(c)
	if(d) image(d)
	if(e) url(e)
    
/*
	Backend will mange this
	var ap =[]

		b = (new icApp.e('title').txt = b + ' · IAnime')
		ap.push(['meta', [['name', 'title'], ['content', b], ['property', 'og:title']]])
		ap.push(['meta', [['name', 'twitter:title'], ['content', b]]])


    ap.push(['meta', [['name', 'description'], ['content', c]]])
    ap.push(['meta', [['name', 'twitter:description'], ['content', c]]])
		ap.push(['meta', [['property', 'og:description'], ['content', c]]])


		ap.push(['meta', [['name', 'twitter:image'], ['content', d]]])
    ap.push(['meta', [['property', 'og:image'], ['content', d]]])


		ap.push(['link', [['rel', 'canonical'], ['href', e]]])
    ap.push(['meta', [['property', 'og:url'], ['content', e]]])

	var a = new icApp.e('head')
	ap.forEach(b => {
		var _a = new icApp.e(icApp.cE(b[0]))
		b[1].forEach(a => _a.sa(a[0], a[1]))
		a.ap(_a.v)
	})
*/
}
const _con = (a, b) => a.forEach(a => new icApp.e(a).sa('content', b))
const title = a => _con(['[name="title"]', '[name="twitter:title"]'], new icApp.e('title').txt = a + ' · IAnime')
const description = a => _con(['[name="description"]', '[name="twitter:description"]', '[property="og:description"]'], a)
const image = a => _con(['[name="twitter:image"]', '[property="og:image"]'], a)
const url = a => _con(['[rel="canonical"]', '[property="og:url"]'], a)

export { meta_init, title, description, image, url }
