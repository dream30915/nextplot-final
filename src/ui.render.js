import { properties } from './data.properties.js'
import { currentLang, t, isFavorite, toggleFavorite, setLang } from './state.js'
import { escapeHtml, formatPrice } from './utils.js'
import { openDetail, openShare, openLeadForm } from './ui.modals.js'

console.log('[ui.render] module loaded. seed length =', Array.isArray(properties)?properties.length:'(not array)')

function favAria(id){
  return isFavorite(id)
    ? (currentLang==='th'?'เอาออกจากรายการบันทึก':'Remove favorite')
    : (currentLang==='th'?'บันทึกไว้':'Add favorite')
}

export function renderLangSwitch(){
  try{
    const c = document.getElementById('langSwitch')
    if(!c){ console.warn('[langSwitch] container not found'); return }
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
  }catch(e){
    console.error('[renderLangSwitch] error', e)
  }
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
    kw: (document.getElementById('fKeyword')?.value||'').trim().toLowerCase(),
    loc: (document.getElementById('fLocation')?.value||'').trim().toLowerCase(),
    pmin: Number(document.getElementById('fPriceMin')?.value) || 0,
    pmax: Number(document.getElementById('fPriceMax')?.value) || Infinity,
    amin: Number(document.getElementById('fAreaMin')?.value) || 0,
    amax: Number(document.getElementById('fAreaMax')?.value) || Infinity,
    status: document.getElementById('fStatus')?.value || 'all',
    sort: document.getElementById('fSort')?.value || 'latest'
  }
}

function localized(obj){ return obj?.[currentLang] || obj?.th || '' }

export function filterAndSort(list, f){
  if(!Array.isArray(list)){ return [] }
  let arr = list.filter(p=>{
    const title = localized(p.title).toLowerCase()
    const location = localized(p.location).toLowerCase()
    const tags = (p.tags?.[currentLang]||[]).join(' ').toLowerCase()
    if(f.kw && !(title.includes(f.kw) || location.includes(f.kw) || tags.includes(f.kw) || p.code?.toLowerCase().includes(f.kw))) return false
    if(f.loc && !location.includes(f.loc)) return false
    if(p.price < f.pmin || p.price > f.pmax) return false
    if(p.areaRai < f.amin || p.areaRai > f.amax) return false
    if(f.status !== 'all' && p.status!==f.status) return false
    return true
  })
  if(f.sort==='priceAsc') arr.sort((a,b)=>a.price-b.price)
  else if(f.sort==='priceDesc') arr.sort((a,b)=>b.price-a.price)
  else arr.sort((a,b)=>(a.code||'').localeCompare(b.code||''))
  return arr
}

function zoningMarkup(p){
  if(!p.zoning) return ''
  const name = escapeHtml(p.zoning[currentLang]||p.zoning.th||'')
  const note = p.zoning.note ? escapeHtml(p.zoning.note[currentLang]||p.zoning.note.th||'') : ''
  return `<div class="prop-zoning" title="${note?name+': '+note:name}">
    <span class="sw" style="background:${p.zoning.color||'#777'}"></span>
    <span>${name}</span>
  </div>`
}

function statusBadge(status){
  const map = {
    available:{ th:'ว่าง', en:'Available', zh:'可售', cls:'status-available' },
    reserved:{ th:'จอง', en:'Reserved', zh:'预订', cls:'status-reserved' },
    sold:{ th:'ขายแล้ว', en:'Sold', zh:'已售', cls:'status-sold' }
  }
  const d = map[status]
  if(!d) return ''
  return `<span class="badge ${d.cls}">${d[currentLang]||d.th}</span>`
}

function tagsLine(p){
  return (p.tags?.[currentLang]||[]).slice(0,3)
    .map(tag=>`<span class="badge badge--tag">${escapeHtml(tag)}</span>`).join('')
}

function cover(p){
  const first = p.media?.[0]
  if(!first) return `<div class="prop-cover" style="display:flex;align-items:center;justify-content:center;font-size:12px;color:#777">NO IMAGE</div>`
  const src = first.src || first
  const blur = p.is_sensitive ? 'filter:blur(6px) brightness(.7);' : ''
  return `<img class="prop-cover" src="${src}" alt="${escapeHtml(localized(p.title))}" loading="lazy" decoding="async" style="${blur}">`
}

function formatAreaVerbose(p){
  const lang = currentLang
  const rai = Math.floor(p.areaRai||0)
  const totalWah = (p.areaRai||0) * 400
  const remainWah = totalWah - rai*400
  const ngan = Math.floor(remainWah/100)
  const wah = Math.round(remainWah - ngan*100)
  const sqm = p.areaSqm||0
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
  try{
    const grid = document.getElementById('propertiesGrid')
    const noRes = document.getElementById('noResults')
    if(!grid){ console.error('[renderProperties] #propertiesGrid not found'); return }
    if(!Array.isArray(properties)){
      console.error('[renderProperties] properties is not array', properties)
      noRes.style.display='block'
      noRes.textContent='ผิดปกติ: ไม่มีข้อมูล seed'
      return
    }

    const f = getFilters()
    const list = filterAndSort(properties, f)
    console.log('[renderProperties] filters:', f, '=> result length:', list.length)

    if(!list.length){
      grid.innerHTML=''
      noRes.style.display='block'
      noRes.innerHTML = `ไม่พบข้อมูล
        <br><button id="reloadSeedBtn" class="btn-small" style="margin-top:10px;">Reload seed</button>`
      document.getElementById('reloadSeedBtn').onclick = ()=>{
        location.reload()
      }
      return
    }
    noRes.style.display='none'
    grid.innerHTML = list.map(p=>{
      const fav = isFavorite(p.id)
      return `
        <article class="prop-card" data-id="${p.id}">
          ${cover(p)}
          <button class="prop-fav ${fav?'active':''}" data-fav="${p.id}" aria-label="${favAria(p.id)}">${fav?'❤':'♡'}</button>
          <div class="prop-body">
            <div class="prop-head">
              <div class="prop-code">${p.code||''}</div>
              <h3 class="prop-title">${escapeHtml(localized(p.title))}</h3>
              <div class="prop-location">${escapeHtml(localized(p.location))}</div>
            </div>
            <div class="prop-meta">
              <div class="prop-price">${formatPrice(p)}</div>
              <div>${formatAreaVerbose(p)}</div>
            </div>
            <div class="badges">
              ${statusBadge(p.status)} ${tagsLine(p)}
            </div>
            ${zoningMarkup(p)}
            <div class="prop-actions">
              <button class="prop-detail-btn" data-detail="${p.id}">${t('property.viewDetails')}</button>
              <button class="prop-share-btn" data-share="${p.id}" aria-label="Share ${escapeHtml(localized(p.title))}">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15.5 5a2.5 2.5 0 1 1 .002 5.002A2.5 2.5 0 0 1 15.5 5m-7 4a2.5 2.5 0 1 1-.001-5.001A2.5 2.5 0 0 1 8.5 9m7 6a2.5 2.5 0 1 1 .002 5.002A2.5 2.5 0 0 1 15.5 15m-6.062-4.25 4.926 2.465-.45.895-4.925-2.465.45-.895Zm4.922-4.856-.45.893-4.692-2.367.45-.893 4.692 2.367Zm.006 9.727.446.895-4.922 2.46-.446-.894 4.922-2.46Z"/>
                </svg>
              </button>
            </div>
          </div>
        </article>
      `
    }).join('')

    grid.querySelectorAll('[data-fav]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        toggleFavorite(btn.getAttribute('data-fav'))
        renderProperties()
      })
    })
    grid.querySelectorAll('[data-detail]').forEach(btn=>{
      btn.addEventListener('click', ()=>openDetail(btn.getAttribute('data-detail')))
    })
    grid.querySelectorAll('[data-share]').forEach(btn=>{
      btn.addEventListener('click', ()=>openShare(btn.getAttribute('data-share')))
    })
  }catch(e){
    console.error('[renderProperties] fatal error', e)
    const noRes = document.getElementById('noResults')
    if(noRes){
      noRes.style.display='block'
      noRes.textContent='เกิดข้อผิดพลาดในการแสดงผล'
    }
  }
}
