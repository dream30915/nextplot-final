import { currentLang, t } from './state.js'

export function escapeHtml(str=''){
  return str.replace(/[&<>"']/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[s]))
}

export function formatArea(p){
  const unitRai = currentLang === 'th' ? 'ไร่' : currentLang === 'en'? 'Rai':'莱'
  const sqmUnit = currentLang === 'th' ? 'ตร.ม.' : currentLang === 'en' ? 'Sq.m.' : '平方米'
  return `${p.areaRai} ${unitRai} (${p.areaSqm.toLocaleString()} ${sqmUnit})`
}

export function formatPrice(p){
  const cur = currentLang === 'th' ? 'บาท' : currentLang === 'en' ? 'THB' : '泰铢'
  return p.price.toLocaleString() + ' ' + cur
}

export function buildShareUrl(p, channel){
  const base = location.origin + location.pathname
  return `${base}?property=${encodeURIComponent(p.id)}&utm_source=${channel}&utm_medium=share&utm_campaign=property`
}

export function copyToClipboard(text){
  return navigator.clipboard.writeText(text)
}

export function setPlaceholder(el, key){
  el.setAttribute('placeholder', t(key))
}
