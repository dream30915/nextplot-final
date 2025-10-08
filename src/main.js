import { applyTheme } from './state.js'
import { renderLangSwitch, renderTexts, renderProperties } from './ui.render.js'
import { openLeadForm } from './ui.modals.js'
import { properties } from './data.properties.js'

function safe(fn,label){
  try{ fn() }catch(e){ console.error('[init]',label,'failed:',e) }
}

console.log('[main] script start')
document.getElementById('year').textContent = new Date().getFullYear()

safe(applyTheme,'applyTheme')
safe(renderLangSwitch,'renderLangSwitch')
safe(renderTexts,'renderTexts')
console.log('[main] seed properties length =', Array.isArray(properties)?properties.length:'(not array)')
safe(renderProperties,'renderProperties')
safe(()=>openLeadForm(''),'openLeadForm')

window.__dbgProperties = properties
console.log('[main] window.__dbgProperties set for inspection')

document.getElementById('applyBtn')?.addEventListener('click', ()=>renderProperties())
document.getElementById('clearBtn')?.addEventListener('click', ()=>{
  ['fKeyword','fLocation','fPriceMin','fPriceMax','fAreaMin','fAreaMax']
    .forEach(id=>{ const el=document.getElementById(id); if(el) el.value='' })
  const st=document.getElementById('fStatus'); if(st) st.value='all'
  const so=document.getElementById('fSort'); if(so) so.value='latest'
  renderProperties()
})
document.getElementById('viewAllBtn')?.addEventListener('click', ()=>{
  document.getElementById('properties')?.scrollIntoView({behavior:'smooth'})
})
document.getElementById('contactBtn')?.addEventListener('click', ()=>openLeadForm(''))
document.getElementById('themeBtn')?.addEventListener('click', ()=>import('./state.js').then(m=>m.toggleTheme()))
document.getElementById('authBtn')?.addEventListener('click', ()=>alert('Auth mock'))
