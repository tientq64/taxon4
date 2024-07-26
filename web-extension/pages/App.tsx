import m from 'mithril'
import Mousetrap from 'mousetrap'
import { testUrlPattern } from '../helpers/testUrlPattern'

export type Store = {
	is: {
		wikipedia: {
			wiki: boolean
		}
	}
}

const store: Store = {
	is: {
		wikipedia: {
			wiki: testUrlPattern('*://*.wikipedia.org/wiki/*')
		}
	}
}
export default store

Mousetrap.bind('a+leftclick', () => {
	console.log(123)
})

export function App(): JSX.Element {
	return <div class="fixed inset-0 font-[sans-serif] pointer-events-none z-10"></div>
}
