const cars = [
  { id: 'm4', brand: 'BMW', model: 'M4 Competition', category: 'Performance coupe', image: 'https://images.pexels.com/photos/12170317/pexels-photo-12170317.jpeg?auto=compress&cs=tinysrgb&w=1800', accent: '#387fc7', compatibility: 'Verified fitment' },
  { id: 's-class', brand: 'Mercedes-Benz', model: 'S-Class', category: 'Luxury sedan', image: 'https://images.pexels.com/photos/261985/pexels-photo-261985.jpeg?auto=compress&cs=tinysrgb&w=1800', accent: '#9c9fa4', compatibility: 'Verified fitment' },
  { id: '911', brand: 'Porsche', model: '911 Carrera', category: 'Iconic sports car', image: 'https://images.pexels.com/photos/39810361/pexels-photo-39810361.jpeg?auto=compress&cs=tinysrgb&w=1800', accent: '#c66243', compatibility: 'Verified fitment' },
  { id: 'rs7', brand: 'Audi', model: 'RS 7 Sportback', category: 'Performance sportback', image: 'https://images.pexels.com/photos/29952735/pexels-photo-29952735.jpeg?auto=compress&cs=tinysrgb&w=1800', accent: '#c8a57c', compatibility: 'Verified fitment' },
  { id: 'mustang', brand: 'Ford', model: 'Mustang GT', category: 'American muscle', image: 'https://images.pexels.com/photos/27617440/pexels-photo-27617440.jpeg?auto=compress&cs=tinysrgb&w=1800', accent: '#4d83ac', compatibility: 'Verified fitment' },
]

const wheels = [
  { id: 'atlas', name: 'Atlas', type: 'Multi-spoke', diameter: 19, pattern: 'multi', price: '$2,480' },
  { id: 'monaco', name: 'Monaco', type: 'Split-spoke', diameter: 20, pattern: 'split', price: '$2,760' },
  { id: 'vector', name: 'Vector', type: 'Mesh', diameter: 19, pattern: 'mesh', price: '$2,590' },
  { id: 'aero', name: 'Aero', type: 'Turbine', diameter: 20, pattern: 'aero', price: '$2,840' },
  { id: 'forge', name: 'Forge', type: 'Five-spoke', diameter: 21, pattern: 'five', price: '$3,120' },
  { id: 'halo', name: 'Halo', type: 'Aero', diameter: 18, pattern: 'halo', price: '$2,260' },
]

const finishes = [
  { id: 'gloss', label: 'Gloss black', color: '#20262d' },
  { id: 'matte', label: 'Matte black', color: '#111316' },
  { id: 'silver', label: 'Metallic silver', color: '#aeb6bf' },
  { id: 'bronze', label: 'Satin bronze', color: '#866547' },
  { id: 'chrome', label: 'Liquid chrome', color: '#dce4e7' },
]

const carIcons = {
  grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="7" height="7" rx="1"/><rect x="14" y="4" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.8A2.8 2.8 0 0 1 8.8 2h6.4A2.8 2.8 0 0 1 18 4.8V21l-6-3.7L6 21V4.8Z"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.9-3L3 11m0 0V5m0 6h6M4 13a8 8 0 0 0 14.9 3L21 13m0 0v6m0-6h-6"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  rotateLeft: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7H4V3M4 7a8 8 0 1 1 2.3 9.3"/></svg>',
  rotateRight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 7h4V3m0 4a8 8 0 1 0-2.3 9.3"/></svg>',
  eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>',
  save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h11l3 3v15H5zM8 3v6h8V3M8 21v-7h8v7"/></svg>',
}

let selectedCar = cars[0]
let selectedWheel = wheels[0]
let selectedFinish = finishes[0]
let selectedSize = 19
let zoom = 1
let angle = 0
let isCompare = false
let isFavorite = false

const app = document.querySelector('#app')

function render() {
  app.innerHTML = `
    <main class="studio-shell">
      <div class="noise"></div>
      <header class="topbar">
        <a class="wordmark" href="#" aria-label="Rimstudio home"><span>RIM</span><strong>STUDIO</strong><i></i></a>
        <div class="topbar-center"><span class="eyebrow">Personalize your drive</span><span class="topbar-line"></span><span class="topbar-context">${selectedCar.brand} / ${selectedCar.model}</span></div>
        <div class="topbar-actions">
          <button class="icon-button ${isFavorite ? 'is-active' : ''}" data-action="favorite" aria-label="${isFavorite ? 'Remove from favorites' : 'Save favorite'}">${carIcons.bookmark}</button>
          <button class="reset-button" data-action="reset">${carIcons.refresh}<span>Reset</span></button>
        </div>
      </header>

      <div class="studio-layout">
        <aside class="control-rail">
          <div class="rail-heading"><div><span class="eyebrow">01 / Vehicle</span><h1>Choose your<br><em>canvas.</em></h1></div><span class="step-count">01—03</span></div>
          <div class="car-list">${cars.map((car, index) => `
            <button class="car-card ${car.id === selectedCar.id ? 'is-selected' : ''}" data-car="${car.id}">
              <span class="car-index">0${index + 1}</span><img src="${car.image}" alt="${car.brand} ${car.model}"><span class="car-card-copy"><strong>${car.brand}</strong><span>${car.model}</span></span>${car.id === selectedCar.id ? `<span class="selected-dot"></span>` : ''}
            </button>`).join('')}</div>
          <div class="rail-divider"></div>
          <section class="wheel-section">
            <div class="section-heading"><div><span class="eyebrow">02 / Wheel design</span><h2>Find your <em>signature.</em></h2></div><span class="section-index">${wheels.indexOf(selectedWheel) + 1} / 06</span></div>
            <div class="filter-row">${['All', 'Performance', 'Luxury'].map((label, index) => `<button class="filter-pill ${index === 0 ? 'is-active' : ''}" data-filter="${label}">${label}</button>`).join('')}</div>
            <div class="wheel-grid">${wheels.map((wheel) => `
              <button class="wheel-card ${wheel.id === selectedWheel.id ? 'is-selected' : ''}" data-wheel="${wheel.id}">
                <span class="wheel-visual wheel-pattern-${wheel.pattern}" style="--finish:${selectedFinish.color}"><span></span></span>
                <span class="wheel-meta"><strong>${wheel.name}</strong><small>${wheel.type}</small><b>${wheel.diameter}"</b></span>
                ${wheel.id === selectedWheel.id ? '<span class="wheel-check">✓</span>' : ''}
              </button>`).join('')}</div>
          </section>
          <section class="finish-section"><span class="eyebrow">03 / Finish</span><div class="finish-list">${finishes.map((finish) => `<button class="finish-swatch ${finish.id === selectedFinish.id ? 'is-selected' : ''}" data-finish="${finish.id}" style="--swatch:${finish.color}" aria-label="${finish.label}"><span></span><small>${finish.label}</small></button>`).join('')}</div></section>
        </aside>

        <section class="preview-panel">
          <div class="preview-topline"><span class="status"><i></i> Studio mode <span class="live-label">Live preview</span></span><span class="preview-note">Drag to explore <span class="mouse-mark">↔</span></span></div>
          <div class="scene" style="--accent:${selectedCar.accent}">
            <div class="studio-light light-one"></div><div class="studio-light light-two"></div><div class="studio-arch"></div><div class="floor-grid"></div>
            <div class="car-stage" style="transform: translateX(${angle}px) scale(${zoom})">
              <img class="hero-car ${isCompare ? 'is-muted' : ''}" src="${selectedCar.image}" alt="${selectedCar.brand} ${selectedCar.model} in studio lighting">
              ${isCompare ? '' : `<div class="wheel-overlay front-wheel wheel-size-${selectedSize} wheel-pattern-${selectedWheel.pattern}" style="--finish:${selectedFinish.color}"><span></span></div><div class="wheel-overlay rear-wheel wheel-size-${selectedSize} wheel-pattern-${selectedWheel.pattern}" style="--finish:${selectedFinish.color}"><span></span></div>`}
              <div class="car-shadow"></div>
            </div>
            <div class="scene-caption"><span class="caption-line"></span><div><span class="eyebrow">Current configuration</span><h2>${selectedCar.brand} <strong>${selectedCar.model}</strong></h2></div><div class="caption-spec"><span>${selectedWheel.name} / ${selectedFinish.label}</span><b>${selectedSize}"</b></div></div>
            <div class="wheel-detail-card"><div class="detail-number">0${wheels.indexOf(selectedWheel) + 1}</div><div><span class="eyebrow">Selected wheel</span><h3>${selectedWheel.name}</h3><p>${selectedWheel.type} <span>/</span> ${selectedFinish.label}</p></div><div class="detail-price"><span>From</span><strong>${selectedWheel.price}</strong></div></div>
          </div>
          <div class="preview-bottomline"><div class="compatible"><span class="check-mark">✓</span><div><span class="eyebrow">Fitment</span><strong>${selectedCar.compatibility}</strong></div></div><div class="size-picker"><span class="eyebrow">Diameter</span><div>${[18, 19, 20, 21].map((size) => `<button class="size-button ${size === selectedSize ? 'is-selected' : ''} ${size === 21 && selectedCar.id === 's-class' ? 'is-disabled' : ''}" data-size="${size}">${size}"</button>`).join('')}</div></div></div>
          <div class="control-dock"><button class="dock-button" data-action="rotate-left" aria-label="Rotate left">${carIcons.rotateLeft}</button><button class="dock-button" data-action="rotate-right" aria-label="Rotate right">${carIcons.rotateRight}</button><span class="dock-divider"></span><button class="dock-button" data-action="zoom-out" aria-label="Zoom out">${carIcons.minus}</button><span class="zoom-readout">${Math.round(zoom * 100)}%</span><button class="dock-button" data-action="zoom-in" aria-label="Zoom in">${carIcons.plus}</button><span class="dock-divider"></span><button class="dock-button dock-wide ${isCompare ? 'is-active' : ''}" data-action="compare">${carIcons.eye}<span>${isCompare ? 'Show custom' : 'Compare original'}</span></button><button class="dock-button dock-wide" data-action="save">${carIcons.save}<span>Save build</span></button></div>
        </section>
      </div>
      <div class="toast" role="status"></div>
    </main>
  `
  bindEvents()
}

function showToast(message) {
  const toast = document.querySelector('.toast')
  if (!toast) return
  toast.textContent = message
  toast.classList.add('is-visible')
  window.setTimeout(() => toast.classList.remove('is-visible'), 2200)
}

function bindEvents() {
  document.querySelectorAll('[data-car]').forEach((button) => button.addEventListener('click', () => {
    const car = cars.find((item) => item.id === button.dataset.car)
    if (!car) return
    selectedCar = car
    selectedSize = car.id === 's-class' && selectedSize === 21 ? 20 : selectedSize
    render()
  }))
  document.querySelectorAll('[data-wheel]').forEach((button) => button.addEventListener('click', () => {
    const wheel = wheels.find((item) => item.id === button.dataset.wheel)
    if (!wheel) return
    selectedWheel = wheel
    selectedSize = wheel.diameter
    render()
  }))
  document.querySelectorAll('[data-finish]').forEach((button) => button.addEventListener('click', () => {
    const finish = finishes.find((item) => item.id === button.dataset.finish)
    if (!finish) return
    selectedFinish = finish
    render()
  }))
  document.querySelectorAll('[data-size]').forEach((button) => button.addEventListener('click', () => {
    if (button.classList.contains('is-disabled')) return
    selectedSize = Number(button.dataset.size)
    render()
  }))
  document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => {
    const action = button.dataset.action
    if (action === 'favorite') { isFavorite = !isFavorite; render(); showToast(isFavorite ? 'Build saved to favorites' : 'Removed from favorites') }
    if (action === 'reset') { selectedWheel = wheels[0]; selectedFinish = finishes[0]; selectedSize = 19; zoom = 1; angle = 0; isCompare = false; render(); showToast('Configuration reset') }
    if (action === 'rotate-left') { angle = Math.max(angle - 12, -36); render() }
    if (action === 'rotate-right') { angle = Math.min(angle + 12, 36); render() }
    if (action === 'zoom-out') { zoom = Math.max(zoom - 0.1, 0.8); render() }
    if (action === 'zoom-in') { zoom = Math.min(zoom + 0.1, 1.3); render() }
    if (action === 'compare') { isCompare = !isCompare; render() }
    if (action === 'save') showToast('Configuration saved to your studio')
  }))
}

render()
