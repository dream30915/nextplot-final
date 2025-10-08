import { properties } from './data.properties.js'
import { currentLang, t, isFavorite, toggleFavorite, setLang } from './state.js'
import { escapeHtml, formatPrice } from './utils.js'
import { openDetail, openShare, openLeadForm } from './ui.modals.js'

function favAria(id){
  return isFavorite(id)
    ? (currentLang==='th'?'เอาออกจากรายการบันทึก':'Remove favorite')
    : (currentLang==='th'?'บันทึกไว้':'Add favorite')
}

export function renderLangSwitch(){
  const c = document.getElementById('langSwitch')
  c.innerHTML = ['th','en','zh'].map(l=>`
    <button class="${l===currentLang?'active':''}" data-set-lang="${l}" aria-label="Set language ${l}">
      ${l.toUpperCase()}
    </button>
  `).join('')
  c.querySelectorAll('[data-set-lang]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      setLang(btn.getAttribute('data-set-lang'))
      renderTexts()
      renderProperties()
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

function localized(obj){ return obj[currentLang] || obj['th'] }

export function filterAndSort(list, f){
  let arr = list.filter(p=>{
    const title = localized(p.title).toLowerCase()
    const location = localized(p.location).toLowerCase()
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
  else arr.sort((a,b)=>a.code.localeCompare(b.code))
  return arr
}

function zoningLine(p){
  if(!p.zoning) return ''
  const zName = escapeHtml(p.zoning[currentLang] || p.zoning.th)
  const note = p.zoning.note ? escapeHtml(p.zoning.note[currentLang]||p.zoning.note.th) : ''
  return `
    <div class="prop-zoning" title="${note?zName+': '+note:zName}">
      <span class="prop-zoning__swatch" style="background:${p.zoning.color}"></span>
      <span class="prop-zoning__text">${zName}</span>
    </div>
  `
}

function buildStatusBadge(status){
  const map = {
    available:{ th:'ว่าง', en:'Available', zh:'可售', cls:'status-available' },
    reserved:{ th:'จอง', en:'Reserved', zh:'预订', cls:'status-reserved' },
    sold:{ th:'ขายแล้ว', en:'Sold', zh:'已售', cls:'status-sold' }
  }
  const data = map[status]
  if(!data) return ''
  return `<span class="badge ${data.cls}" data-status="${status}">${data[currentLang]||data.th}</span>`
}

function buildTags(p){
  return p.tags[currentLang].slice(0,3).map(tag=>`<span class="badge badge--tag">${escapeHtml(tag)}</span>`).join('')
}

function coverHTML(p){
  const img = p.media?.[0]
  if(!img) return `<div class="prop-cover prop-cover--empty">NO IMAGE</div>`
  const blur = p.is_sensitive ? 'filter:blur(6px) brightness(.7);' : ''
  return `<picture class="prop-cover"><img src="${img}" alt="${escapeHtml(localized(p.title))}" loading="lazy" decoding="async" style="${blur}"></picture>`
}

function formatAreaVerbose(p){
  const lang = currentLang
  const rai = Math.floor(p.areaRai)
  const totalWah = p.areaRai * 400
  const remainWah = totalWah - rai*400
  const ngan = Math.floor(remainWah/100)
  const wah = Math.round(remainWah - ngan*100)
  const sqm = p.areaSqm
  const wRai = lang==='th'?'ไร่':lang==='en'?'Rai':'莱'
  const wNgan = lang==='th'?'งาน':lang==='en'?'Ngan':'岸'
  const wWah = lang==='th'?'ตร.วา':lang==='en'?'Sq.wah':'平方哇'
  const wSqm = lang==='th'?'ตร.ม.':lang==='en'?'Sq.m.':'平方米'
  let parts=[]
  if(rai) parts.push(`${rai} ${wRai}`)
  if(ngan) parts.push(`${ngan} ${wNgan}`)
  if(wah) parts.push(`${wah} ${wWah}`)
  if(!parts.length) parts.push(`0 ${wRai}`)
  return `${parts.join(' ')} (${sqm.toLocaleString()} ${wSqm})`
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
      <article class="card prop-card" data-id="${p.id}">
        ${coverHTML(p)}
        <button class="favorite-btn ${fav?'active':''}" data-fav="${p.id}" aria-label="${favAria(p.id)}">${fav?'★':'☆'}</button>
        <div class="prop-card__body">
          <header class="prop-card__head">
            <div class="prop-code" aria-label="Code ${p.code}">${p.code}</div>
            <h3 class="prop-title">${escapeHtml(localized(p.title))}</h3>
          </header>
          <div class="meta">
            <span><strong>${t('property.price')}</strong>: ${formatPrice(p)}</span>
            <span><strong>${t('property.area')}</strong>: ${formatAreaVerbose(p)}</span>
            <span><strong>${t('property.zoning')}</strong>: ${escapeHtml(p.zoning[currentLang]||p.zoning.th)}</span>
          </div>
          <div class="badges">
            ${buildStatusBadge(p.status)}
            ${buildTags(p)}
          </div>
          ${zoningLine(p)}
          <div class="actions">
            <button data-detail="${p.id}" aria-label="View ${escapeHtml(localized(p.title))}">${t('property.viewDetails')}</button>
            <button data-share="${p.id}" aria-label="Share ${escapeHtml(localized(p.title))}">${t('property.share')}</button>
          </div>
        </div>
      </article>
    `
  }).join('')

  grid.querySelectorAll('[data-fav]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
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
