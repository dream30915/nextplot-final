import { applyTheme, toggleTheme } from './state.js'
import { renderLangSwitch, renderTexts, renderProperties } from './ui.render.js'
import { openLeadForm } from './ui.modals.js'
import { t } from './state.js'

document.getElementById('year').textContent = new Date().getFullYear()

// Initial render
applyTheme()
renderLangSwitch()
renderTexts()
renderProperties()
openLeadForm('') // preload empty lead form

// Filters
document.getElementById('applyBtn').onclick = ()=>renderProperties()
document.getElementById('clearBtn').onclick = ()=>{
  ['fKeyword','fLocation','fPriceMin','fPriceMax','fAreaMin','fAreaMax'].forEach(id=>document.getElementById(id).value='')
  document.getElementById('fStatus').value='all'
  document.getElementById('fSort').value='latest'
  renderProperties()
}

// Scroll to properties
document.getElementById('viewAllBtn').onclick = ()=>{
  document.getElementById('propertiesGrid').scrollIntoView({behavior:'smooth'})
}

// Contact button
document.getElementById('contactBtn').onclick = ()=>openLeadForm('')

// Theme
document.getElementById('themeBtn').onclick = ()=>toggleTheme()

// Auth mock (แค่ alert)
document.getElementById('authBtn').onclick = ()=>{
  alert('Auth mock – ยังไม่ทำระบบจริง')
}
