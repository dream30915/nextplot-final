import { applyTheme } from './state.js'
import { renderLangSwitch, renderTexts, renderProperties } from './ui.render.js'
import { openLeadForm } from './ui.modals.js'

document.getElementById('year').textContent = new Date().getFullYear()

applyTheme()
renderLangSwitch()
renderTexts()
renderProperties()
openLeadForm('')

document.getElementById('applyBtn').onclick = ()=>renderProperties()
document.getElementById('clearBtn').onclick = ()=>{
  ['fKeyword','fLocation','fPriceMin','fPriceMax','fAreaMin','fAreaMax'].forEach(id=>document.getElementById(id).value='')
  document.getElementById('fStatus').value='all'
  document.getElementById('fSort').value='latest'
  renderProperties()
}
document.getElementById('viewAllBtn').onclick = ()=>{
  document.getElementById('propertiesGrid').scrollIntoView({behavior:'smooth'})
}
document.getElementById('contactBtn').onclick = ()=>openLeadForm('')
document.getElementById('themeBtn').onclick = ()=>import('./state.js').then(m=>m.toggleTheme())
document.getElementById('authBtn').onclick = ()=>alert('Auth mock – ยังไม่ทำระบบจริง')
