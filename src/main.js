import { applyTheme } from './state.js'
import { renderLangSwitch, renderTexts, renderProperties } from './ui.render.js'
import { openLeadForm } from './ui.modals.js'
import { properties } from './data.properties.js'

function guard(label, fn){
  try { fn() } catch(e){ console.error('[init]',label,'error:', e) }
}

console.log('[main] start')
document.getElementById('year').textContent = new Date().getFullYear()

guard('applyTheme', applyTheme)
guard('renderLangSwitch', renderLangSwitch)
guard('renderTexts', renderTexts)
console.log('[main] seed length =', Array.isArray(properties)?properties.length:properties)
guard('renderProperties', renderProperties)
guard('openLeadForm', ()=>openLeadForm(''))

// expose for quick debugging
window.__DBG = { properties }
console.log('[main] window.__DBG ready')

// EVENTS
document.getElementById('applyBtn')?.addEventListener('click', ()=>renderProperties())
document.getElementById('clearBtn')?.addEventListener('click', ()=>{
  ['fKeyword','fLocation','fPriceMin','fPriceMax','fAreaMin','fAreaMax'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value=''
  })
  const s=document.getElementById('fStatus'); if(s) s.value='all'
  const so=document.getElementById('fSort'); if(so) so.value='latest'
  renderProperties()
})
document.getElementById('viewAllBtn')?.addEventListener('click', ()=>{
  document.getElementById('properties')?.scrollIntoView({behavior:'smooth'})
})
document.getElementById('contactBtn')?.addEventListener('click', ()=>openLeadForm(''))
document.getElementById('themeBtn')?.addEventListener('click', ()=>import('./state.js').then(m=>m.toggleTheme()))
document.getElementById('authBtn')?.addEventListener('click', ()=>alert('Auth mock'))
