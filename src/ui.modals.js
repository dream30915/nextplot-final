import { t, toggleFavorite, isFavorite } from './state.js'
import { escapeHtml, formatArea, formatPrice, buildShareUrl, copyToClipboard } from './utils.js'
import { properties } from './data.properties.js'
import { renderProperties } from './ui.render.js'

export function closeModal(){
  const root = document.getElementById('modalRoot')
  if(root) root.innerHTML=''
}

export function openDetail(id){
  const p = properties.find(x=>x.id===id)
  if(!p) return
  let idx=0
  const root = document.getElementById('modalRoot')
  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal">
        <button class="close" onclick="import('./ui.modals.js').then(m=>m.closeModal())">×</button>
        <h2>${escapeHtml(p.title[localStorage.getItem('np:lang')||'th'])}</h2>
        <div class="detail-grid">
          <div>
            <div class="gallery-main" id="galMain">
              <img src="${p.media[0]}" alt="${escapeHtml(p.title.th)}">
            </div>
            <div class="thumbs">
              ${p.media.map((m,i)=>`
                <button class="${i===0?'active':''}" data-img="${i}" data-pid="${p.id}">
                  <img src="${m}" alt="${escapeHtml(p.title.th)} ${i+1}">
                </button>`).join('')}
            </div>
          </div>
          <div class="detail-box">
            <div class="info-item">
              <span class="info-label">${t('property.price')}</span>
              <div style="font-size:22px;font-weight:700;color:var(--accent)">${formatPrice(p)}</div>
            </div>
            <div class="info-item">
              <span class="info-label">${t('property.area')}</span>
              <div title="${t('area.tooltip')}">${formatArea(p)}</div>
            </div>
            <div class="info-item">
              <span class="info-label">${t('property.zoning')}</span>
              <div>${p.zoning[localStorage.getItem('np:lang')||'th']}</div>
            </div>
            <div class="info-item">
              <span class="info-label">${t('property.tags')}</span>
              <div class="tag-list">
                ${p.tags[localStorage.getItem('np:lang')||'th'].map(tag=>`<span class="tag">${escapeHtml(tag)}</span>`).join('')}
              </div>
            </div>
            <div class="inline-group">
              <button class="inline-btn" id="shareBtnModal">${t('property.share')}</button>
              <button class="inline-btn" id="favBtnModal">${t('property.favorite')}</button>
              <button class="inline-btn" id="landsBtnModal" >LandsMaps</button>
              <button class="inline-btn" id="contactBtnModal">${t('property.contact')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
  // Attach events after render
  setTimeout(()=>{
    document.querySelectorAll('.thumbs button').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const i = Number(btn.getAttribute('data-img'))
        const pid = btn.getAttribute('data-pid')
        const prop = properties.find(pp=>pp.id===pid)
        if(!prop) return
        document.querySelectorAll('.thumbs button').forEach(b=>b.classList.remove('active'))
        btn.classList.add('active')
        const img = document.querySelector('#galMain img')
        img.src = prop.media[i]
      })
    })
    document.getElementById('shareBtnModal').onclick = ()=>openShare(p.id)
    document.getElementById('favBtnModal').onclick = ()=>{
      toggleFavorite(p.id)
      renderProperties() // update list in background
      openDetail(p.id)   // re-open to update state
    }
    document.getElementById('landsBtnModal').onclick = ()=>window.open('https://landsmaps.dol.go.th/','_blank','noopener')
    document.getElementById('contactBtnModal').onclick = ()=>{
      closeModal()
      import('./ui.modals.js').then(m=>m.openLeadForm(p.id))
    }
  },0)
}

export function openShare(id){
  const p = properties.find(x=>x.id===id)
  if(!p) return
  const url = buildShareUrl(p,'copy')
  const root = document.getElementById('modalRoot')
  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal">
        <button class="close" onclick="import('./ui.modals.js').then(m=>m.closeModal())">×</button>
        <h2>${t('property.share')} – ${escapeHtml(p.title[localStorage.getItem('np:lang')||'th'])}</h2>
        <div class="share-grid">
          ${['line','facebook','email','copy','wechat'].map(ch=>`
            <button class="inline-btn" data-share="${ch}" data-id="${p.id}">${ch.toUpperCase()}</button>
          `).join('')}
        </div>
        <div style="margin-top:18px;font-size:12px;word-break:break-all;">${url}</div>
      </div>
    </div>
  `
  setTimeout(()=>{
    document.querySelectorAll('[data-share]').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const channel = btn.getAttribute('data-share')
        const prop = properties.find(pp=>pp.id===id)
        if(!prop) return
        const final = buildShareUrl(prop, channel)
        if(channel==='copy' || channel==='wechat'){
          copyToClipboard(final).then(()=>alert(t('property.share')+' OK'))
        } else if(channel==='email'){
          const subj = encodeURIComponent(prop.title[localStorage.getItem('np:lang')||'th'])
          const body = encodeURIComponent(prop.title[localStorage.getItem('np:lang')||'th']+'\n'+final)
          location.href = `mailto:?subject=${subj}&body=${body}`
        } else {
          window.open(final,'_blank','noopener')
        }
      })
    })
  },0)
}

export function openLeadForm(propertyId=''){
  const target = document.getElementById('leadFormContainer')
  target.innerHTML = `
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
      <div class="notice" id="leadNotice"></div>
    </form>
  `
  const form = document.getElementById('leadForm')
  form.onsubmit = e=>{
    e.preventDefault()
    const name = document.getElementById('leadName').value.trim()
    const phone = document.getElementById('leadPhone').value.trim()
    const pdpa = document.getElementById('leadPDPA').checked
    const notice = document.getElementById('leadNotice')
    if(!name || !phone || !pdpa){
      notice.style.color='var(--danger)'
      notice.textContent = t('form.fail')
      return
    }
    notice.style.color='var(--green)'
    notice.textContent = t('form.success')
    setTimeout(()=>{
      notice.textContent=''
      form.reset()
    },1600)
  }
  document.getElementById('contact').scrollIntoView({behavior:'smooth'})
}
