/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {meta_init} from '../meta'
import {page} from '../page'
import '../style/user.scss'

class user extends page {
	constructor() {
		super()
		this.name = 'user'
	}
	load() {
		meta_init(0, 'User')
	}
	content() {
		return ([
		])
	}
}
export {user}
