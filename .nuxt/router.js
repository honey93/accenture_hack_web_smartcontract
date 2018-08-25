import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _69e8cf5c = () => import('../pages/mystory/index.vue' /* webpackChunkName: "pages/mystory/index" */).then(m => m.default || m)
const _4fa016b2 = () => import('../pages/favourite/index.vue' /* webpackChunkName: "pages/favourite/index" */).then(m => m.default || m)
const _a73ab62e = () => import('../pages/contact/index.vue' /* webpackChunkName: "pages/contact/index" */).then(m => m.default || m)
const _6902d8d4 = () => import('../pages/about/index.vue' /* webpackChunkName: "pages/about/index" */).then(m => m.default || m)
const _77f74da9 = () => import('../pages/create/index.vue' /* webpackChunkName: "pages/create/index" */).then(m => m.default || m)
const _54f1f218 = () => import('../pages/index.vue' /* webpackChunkName: "pages/index" */).then(m => m.default || m)



if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected
  if (to.matched.length < 2) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise(resolve => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/mystory",
			component: _69e8cf5c,
			name: "mystory"
		},
		{
			path: "/favourite",
			component: _4fa016b2,
			name: "favourite"
		},
		{
			path: "/contact",
			component: _a73ab62e,
			name: "contact"
		},
		{
			path: "/about",
			component: _6902d8d4,
			name: "about"
		},
		{
			path: "/create",
			component: _77f74da9,
			name: "create"
		},
		{
			path: "/",
			component: _54f1f218,
			name: "index"
		}
    ],
    
    
    fallback: false
  })
}
