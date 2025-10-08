import { translations } from './translations.js'
export let currentLang = localStorage.getItem('np:lang') || 'th'
export let theme = localStorage.getItem('np:theme') || 'dark'
export let favorites = JSON.parse(localStorage.getItem('np:favs') || '[]')

export function setLang(l){
  currentLang = l
  localStorage.setItem('np:lang', l)
  document.documentElement.lang = l
}

export function toggleTheme(){
  theme = theme === 'dark' ? 'light' : 'dark'
  localStorage.setItem('np:theme', theme)
  applyTheme()
}

export function applyTheme(){
  if(theme === 'light') document.documentElement.setAttribute('data-theme','light')
  else document.documentElement.removeAttribute('data-theme')
  const btn = document.getElementById('themeBtn')
  if(btn) btn.textContent = theme === 'dark' ? '🌙' : '☀'
}

export function t(key){
  const pack = translations[currentLang] || translations.th
  return pack[key] || key
}

export function toggleFavorite(id){
  const idx = favorites.indexOf(id)
  if(idx>=0) favorites.splice(idx,1)
  else favorites.push(id)
  localStorage.setItem('np:favs', JSON.stringify(favorites))
}

export function isFavorite(id){
  return favorites.includes(id)
}
