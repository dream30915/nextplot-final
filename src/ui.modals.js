// ui.modals.js (cleaned) – แก้ปัญหา Identifier 'openShare' has already been declared
// ห้าม import ตัวเอง
import { t, toggleFavorite } from './state.js'
import { escapeHtml, formatPrice } from './utils.js'
import { properties } from './data.properties.js'
import { renderProperties } from './ui.render.js'

export function closeModal(){
  const root = document.getElementById('modalRoot')
  if(root) root.innerHTML = ''
}

export function openDetail(id){
  const p = properties.find(x=>x.id===id)
  if(!p){
    console.warn('[detail] property not found id=', id)
    return
  }
  const lang = localStorage.getItem('np:lang') || 'th'
  const title = p.title[lang] || p.title.th
  const areaHtml = verboseArea(p, lang)
  const zoning = p.zoning ? (p.zoning[lang] || p.zoning.th) : ''
  const zoningNote = p.zoning?.note ? (p.zoning.note[lang]||p.zoning.note.th) : ''
  const imgs = p.media || []
  const root = document.getElementById('modalRoot')

  root.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true">
      <div class="modal">
        <button class="close" aria-label="Close detail" onclick="import('./ui.modals.js').then(m=>m.closeModal())">×</button>
        <h2>${escapeHtml(title)}</h2>
        <div class="detail-grid">
          <div>
            <div class="gallery-main" id="galMain">
              ${imgs.length ? `<img src="${(imgs[0].src||imgs[0])}" alt="${escapeHtml(title)}">` : 'NO IMAGE'}
            </div>
            <div class="thumbs">
              ${(imgs || []).map((m,i)=>`
                <button class="${i===0?'active':''}" data-img="${i}" data-pid="${p.id}">
                  <img src="${(m.src||m)}" alt="${escapeHtml(title)} ${i+1}">
                </button>
              `).join('')}
            </div>
          </div>
          <div class="detail-box">
            <div class="info-item">
              <span class="info-label">${t('property.price')}</span>
              <div style="font-size:22px;font-weight:700;color:var(--accent)">${formatPrice(p)}</div>
            </div>
            <div class="info-item">
              <span class="info-label">${t('property.area')}</span>
              <div title="${t('area.tooltip')}">${areaHtml}</div>
            </div>
            <div class="info-item">
              <span class="info-label">${t('property.zoning')}</span>
              <div>${escapeHtml(zoning)}${zoningNote?` – <small>${escapeHtml(zoningNote)}</small>`:''}</div>
            </div>
            <div class="info-item">
              <span class="info-label">${t('property.tags')}</span>
              <div class="tag-list">
                ${(p.tags[lang]||[]).map(tag=>`<span class="tag">${escapeHtml(tag)}</span>`).join('')}
              </div>
            </div>
            <div class="inline-group">
              <button class="inline-btn" id="shareBtnModal">${t('property.share')}</button>
              <button class="inline-btn" id="favBtnModal">${t('property.favorite')}</button>
              <button class="inline-btn" id="landsBtnModal">LandsMaps</button>
              <button class="inline-btn" id="contactBtnModal">${t('property.contact')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  setTimeout(()=>{
    document.querySelectorAll('.thumbs button').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const i = Number(btn.getAttribute('data-img'))
        const pid = btn.getAttribute('data-pid')
        const prop = properties.find(pp=>pp.id===pid)
        if(!prop) return
        document.querySelectorAll('.thumbs button').forEach(b=>b.classList.remove('active'))
        btn.classList.add('active')
        const img = document.querySelector('#galMain img')
        if(img) img.src = prop.media[i].src || prop.media[i]
      })
    })
    document.getElementById('shareBtnModal')?.addEventListener('click', ()=>openShare(p.id))
    document.getElementById('favBtnModal')?.addEventListener('click', ()=>{
      toggleFavorite(p.id)
      renderProperties()
      openDetail(p.id)
    })
    document.getElementById('landsBtnModal')?.addEventListener('click', ()=>window.open('https://landsmaps.dol.go.th/','_blank','noopener'))
    document.getElementById('contactBtnModal')?.addEventListener('click', ()=>{
      closeModal()
      import('./ui.modals.js').then(m=>m.openLeadForm(p.id))
    })
  },0)
}

function verboseArea(p, lang){
  const rai = Math.floor(p.areaRai||0)
  const totalWah = (p.areaRai||0) * 400
  const remainWah = totalWah - rai*400
  const ngan = Math.floor(remainWah/100)
  const wah = Math.round(remainWah - ngan*100)
  const sqm = p.areaSqm || (p.areaRai||0)*1600
  const w = {
    rai: lang==='th'?'ไร่':lang==='en'?'Rai':'莱',
    ngan: lang==='th'?'งาน':lang==='en'?'Ngan':'岸',
    wah: lang==='th'?'ตร.วา':lang==='en'?'Sq.wah':'平方哇',
    sqm: lang==='th'?'ตร.ม.':lang==='en'?'Sq.m.':'平方米'
  }
  const parts=[]
  if(rai) parts.push(`${rai} ${w.rai}`)
  if(ngan) parts.push(`${ngan} ${w.ngan}`)
  if(wah) parts.push(`${wah} ${w.wah}`)
  if(!parts.length) parts.push(`0 ${w.rai}`)
  return `${parts.join(' ')} (${sqm.toLocaleString()} ${w.sqm})`
}

export function openShare(id){
  const p = properties.find(x=>x.id===id)
  if(!p){
    console.warn('[share] not found id=', id)
    return
  }
  const lang = localStorage.getItem('np:lang') || 'th'
  const base = location.origin + location.pathname
  const url = `${base}?property=${encodeURIComponent(p.id)}`
  const root = document.getElementById('modalRoot')
  root.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true">
      <div class="modal">
        <button class="close" aria-label="Close share" onclick="import('./ui.modals.js').then(m=>m.closeModal())">×</button>
        <h2>${t('property.share')} – ${escapeHtml(p.title[lang]||p.title.th)}</h2>
        <div class="share-grid">
          ${['line','facebook','email','copy'].map(ch=>`
            <button class="inline-btn" data-share="${ch}" data-id="${p.id}">${ch.toUpperCase()}</button>
          `).join('')}
        </div>
        <div style="margin-top:16px;font-size:12px;word-break:break-all;">${url}</div>
      </div>
    </div>
  `
  setTimeout(()=>{
    document.querySelectorAll('[data-share]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const channel = btn.getAttribute('data-share')
        shareChannel(p, channel)
      })
    })
  },0)
}

function shareChannel(p, channel){
  const base = location.origin + location.pathname
  const raw = `${base}?property=${encodeURIComponent(p.id)}&utm_source=${channel}&utm_medium=share&utm_campaign=property&utm_content=${p.id}`
  if(channel==='copy'){ navigator.clipboard.writeText(raw).then(()=>alert('COPIED')); return }
  if(channel==='email'){
    const subj = encodeURIComponent(p.title.th)
    const body = encodeURIComponent(p.title.th + '\\n' + raw)
    location.href = `mailto:?subject=${subj}&body=${body}`; return
  }
  if(channel==='facebook'){ window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(raw)}`,'_blank','noopener'); return }
  if(channel==='line'){ window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(raw)}`,'_blank','noopener'); return }
  window.open(raw,'_blank','noopener')
}

export function openLeadForm(propertyId=''){
  const container = document.getElementById('leadFormContainer')
  container.innerHTML = `
    <form class="form-lead" id="leadForm">
      <h3 style="margin:0;font-size:16px;">Lead Form</h3>
      <input type="hidden" id="leadPropertyId" value="${propertyId}">
      <div>
        <label style="display:block;font-size:12px;margin-bottom:4px;" data-i18n="form.name">${t('form.name')}</label>
        <input id="leadName" required placeholder="${t('form.name')}">
      </div>
      <div>
        <label style="display:block;font-size:12px;margin-bottom:4px;" data-i18n="form.phone">${t('form.phone')}</label>
        <input id="leadPhone" required placeholder="${t('form.phone')}">
      </div>
      <div>
        <label style="display:block;font-size:12px;margin-bottom:4px;" data-i18n="form.email">${t('form.email')}</label>
        <input id="leadEmail" placeholder="${t('form.email')}">
      </div>
      <div>
        <label style="display:block;font-size:12px;margin-bottom:4px;" data-i18n="form.message">${t('form.message')}</label>
        <textarea id="leadMessage" rows="3" placeholder="${t('form.message')}"></textarea>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="leadPDPA" required>
        <label for="leadPDPA" style="cursor:pointer;">${t('form.pdpa')}</label>
      </div>
        <button class="btn" style="width:100%;">${t('form.submit')}</button>
      <div class="notice" id="leadNotice" aria-live="polite"></div>
    </form>
  `
  const form = document.getElementById('leadForm')
  form.onsubmit = e=>{
    e.preventDefault()
    const name = document.getElementById('leadName').value.trim()
    const phone = document.getElementById('leadPhone').value.trim()
    const consent = document.getElementById('leadPDPA').checked
    const notice = document.getElementById('leadNotice')
    if(!name || !phone || !consent){
      notice.style.color='var(--danger)'
      notice.textContent = t('form.fail')
      return
    }
    notice.style.color='var(--green)'
    notice.textContent = t('form.success')
    setTimeout(()=>{ notice.textContent=''; form.reset() },1500)
  }
  document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})
}
