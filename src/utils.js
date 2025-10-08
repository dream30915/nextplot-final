import { currentLang } from './state.js'

export function escapeHtml(str=''){
  return str.replace(/[&<>"']/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[s]))
}

export function formatPrice(p){
  const cur = currentLang === 'th' ? 'บาท' : currentLang === 'en' ? 'THB' : '泰铢'
  return p.price.toLocaleString() + ' ' + cur
}
// (formatAreaVerbose moved inside ui.render.js — intentionally minimal here)
