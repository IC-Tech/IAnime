/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {meta_init} from '../meta'
import {page} from '../page'
import '../style/settings.scss'

class settings extends page {
	constructor() {
		super()
		this.name = 'settings'
	}
	load() {
		meta_init(0, 'Settings')
	}
	content() {
		return ([
			{t: 'div', cl: 'sign-req', ch: [
				{t: 'span', cl: 'des', txt: 'Create an account or log in to IAnime to continue'},
				{t: 'a', cl: 'btn0', at: {href: '/sign?ui=register'}, txt: 'Sign Up'},
				{t: 'a', cl: 'btn0', at: {href: '/sign'}, txt: 'Sign In'}
			]}
		])
	}
}
export {settings}
