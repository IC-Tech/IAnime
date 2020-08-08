/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import '../style/common_page.scss'
import {meta_init} from '../meta'
import {page} from '../page'

const comm = op => {
	class comm extends page {
		constructor() {
			super()
			this.name = 'comm'
			this.subName = op.name
		}
		load() {
			meta_init(0, op.title)
		}
		content() {
			return ([
				{t: 'div', cl: 'cent', ch: op.content}
			])
		}
	}
	return comm
}
export default comm
