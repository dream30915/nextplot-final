import { properties } from './data.properties.js'
import { currentLang, t, isFavorite, toggleFavorite, setLang } from './state.js'
import { escapeHtml, formatArea, formatPrice } from './utils.js'
import { openDetail, openShare, openLeadForm } from './ui.modals.js'

export function renderLangSwitch(){
  const c = document.getElementById('langSwitch')
  c.innerHTML = ['th','en','zh'].map(l=>`
    <button class="${l===currentLang?'active':''}" data-set-lang="${l}">${l.toUpperCase()}</button>
  `).join('')
  c.querySelectorAll('[data-set-lang]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      setLang(btn.getAttribute('data-set-lang'))
      renderTexts()
      renderProperties()
      // re-render lead form labels if exists
      const lf = document.getElementById('leadFormContainer')
      if(lf && lf.innerHTML.trim()) openLeadForm(document.getElementById('leadPropertyId')?.value||'')
    })
  })
}

export function renderTexts(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n')
    el.textContent = t(key)
  })
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    const key = el.getAttribute('data-i18n-ph')
    el.setAttribute('placeholder', t(key))
  })
}

export function getFilters(){
  return {
    kw: document.getElementById('fKeyword').value.trim().toLowerCase(),
    loc: document.getElementById('fLocation').value.trim().toLowerCase(),
    pmin: Number(document.getElementById('fPriceMin').value) || 0,
    pmax: Number(document.getElementById('fPriceMax').value) || Infinity,
    amin: Number(document.getElementById('fAreaMin').value) || 0,
    amax: Number(document.getElementById('fAreaMax').value) || Infinity,
    status: document.getElementById('fStatus').value,
    sort: document.getElementById('fSort').value
  }
}

export function filterAndSort(list, f){
  let arr = list.filter(p=>{
    const title = p.title[currentLang].toLowerCase()
    const location = p.location[currentLang].toLowerCase()
    const tags = p.tags[currentLang].join(' ').toLowerCase()
    if(f.kw && !(title.includes(f.kw) || location.includes(f.kw) || tags.includes(f.kw) || p.code.toLowerCase().includes(f.kw))) return false
    if(f.loc && !location.includes(f.loc)) return false
    if(p.price < f.pmin || p.price > f.pmax) return false
    if(p.areaRai < f.amin || p.areaRai > f.amax) return false
    if(f.status !== 'all' && p.status!==f.status) return false
    return true
  })
  if(f.sort==='priceAsc') arr.sort((a,b)=>a.price-b.price)
  else if(f.sort==='priceDesc') arr.sort((a,b)=>b.price-a.price)
  else arr.sort((a,b)=>b.id.localeCompare(a.id))
  return arr
}

export function renderProperties(){
  const f = getFilters()
  const list = filterAndSort(properties, f)
  const grid = document.getElementById('propertiesGrid')
  const noRes = document.getElementById('noResults')
  if(!list.length){
    grid.innerHTML=''
    noRes.style.display='block'
    return
  }
  noRes.style.display='none'
  grid.innerHTML = list.map(p=>{
    const fav = isFavorite(p.id)
    return `
      <div class="card">
        <button class="favorite-btn ${fav?'active':''}" data-fav="${p.id}">${fav?'★':'☆'}</button>
        <h3>${escapeHtml(p.title[currentLang])}</h3>
        <div class="meta">
          <span><strong>${t('property.price')}</strong>: ${formatPrice(p)}</span>
          <span><strong>${t('property.area')}</strong>: ${formatArea(p)}</span>
          <span><strong>${t('property.zoning')}</strong>: ${p.zoning[currentLang]}</span>
        </div>
        <div class="badges">
          <span class="badge status-${p.status}">${t('status.'+p.status)}</span>
          ${p.tags[currentLang].slice(0,2).map(tag=>`<span class="badge">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="actions">
          <button data-detail="${p.id}">${t('property.viewDetails')}</button>
          <button data-share="${p.id}">${t('property.share')}</button>
        </div>
      </div>
    `
  }).join('')

  // bind buttons
  grid.querySelectorAll('[data-fav]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = btn.getAttribute('data-fav')
      toggleFavorite(id)
      renderProperties()
    })
  })
  grid.querySelectorAll('[data-detail]').forEach(btn=>{
    btn.addEventListener('click', ()=>openDetail(btn.getAttribute('data-detail')))
  })
  grid.querySelectorAll('[data-share]').forEach(btn=>{
    btn.addEventListener('click', ()=>openShare(btn.getAttribute('data-share')))
  })
}
