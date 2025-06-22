import { configResponsive } from 'ahooks'
import { init, use } from 'i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import { languages } from '../constants/languages'

// Cấu hình lại responsive của ahooks cho phù hợp với tailwind.
configResponsive({
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	xxl: 1536
})

use(I18NextHttpBackend)
use(initReactI18next)
init({
	lng: navigator.language,
	fallbackLng: languages.map((language) => language.code),
	backend: {
		loadPath: '/locales/translations/{{lng}}.json'
	}
})
