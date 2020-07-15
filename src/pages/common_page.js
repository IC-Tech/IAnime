/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import './common_page.scss'
import {page} from '../page.js'

const comm = op => {
	class comm extends page {
		constructor() {
			super()
			this.name = 'comm'
			this.subName = op.name
		}
		load() {}
		content() {
			return ([
				{t: 'div', cl: 'cent', ch: op.content}
			])
		}
	}
	return comm
}
export default comm
