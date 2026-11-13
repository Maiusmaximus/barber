/* Distrito Barber · interacciones (sin dependencias) */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '573113234989';

  /* Menú hamburguesa accesible */
  var burger = d.getElementById('burger'), menu = d.getElementById('menu');
  function cerrarMenu() { if (!burger) return; menu.classList.remove('abierto'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Abrir menú'); }
  if (burger) {
    burger.addEventListener('click', function () {
      var abre = burger.getAttribute('aria-expanded') !== 'true';
      menu.classList.toggle('abierto', abre);
      burger.setAttribute('aria-expanded', String(abre));
      burger.setAttribute('aria-label', abre ? 'Cerrar menú' : 'Abrir menú');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) cerrarMenu(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarMenu(); });
  }

  /* Cabecera compacta + botón subir */
  var cab = d.getElementById('cabecera'), subir = d.getElementById('subir');
  function onScroll() {
    var y = window.scrollY;
    if (cab) cab.classList.toggle('compacta', y > 60);
    if (subir) subir.hidden = y < 600;
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (subir) subir.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* Aparición al desplazarse */
  var rev = d.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    rev.forEach(function (el, i) { el.style.transitionDelay = ((i % 3) * 90) + 'ms'; io.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add('visible'); }); }

  /* Contadores animados (cifras reales del brief) */
  function fmt(n, sep) { return sep === '' ? String(n) : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  var cont = d.querySelectorAll('[data-count]');
  function animar(el) {
    var fin = +el.dataset.count, pre = el.dataset.prefix || '', sep = el.dataset.sep;
    if (reduce) { el.textContent = pre + fmt(fin, sep); return; }
    var t0 = null, dur = 1400;
    (function paso(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), v = Math.round(fin * (1 - Math.pow(1 - p, 3)));
      el.textContent = pre + fmt(v, sep);
      if (p < 1) requestAnimationFrame(paso);
    })(performance.now());
  }
  if (cont.length && 'IntersectionObserver' in window) {
    var ioc = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { animar(en.target); ioc.unobserve(en.target); } });
    }, { threshold: .6 });
    cont.forEach(function (c) { ioc.observe(c); });
  }

  /* Filtros (servicios y equipo) */
  var filtros = d.querySelectorAll('.filtro');
  if (filtros.length) {
    var items = d.querySelectorAll('.servicio[data-cat], .barbero[data-grupo]');
    var cnt = d.getElementById('contador'), vacio = d.getElementById('vacio');
    filtros.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.dataset.filtro, n = 0;
        filtros.forEach(function (x) { var on = x === b; x.classList.toggle('activo', on); x.setAttribute('aria-pressed', String(on)); });
        items.forEach(function (it) {
          var ok = f === 'todos' || it.dataset.cat === f || it.dataset.grupo === f;
          it.classList.toggle('oculto', !ok);
          if (ok) { n++; it.classList.add('visible'); }
        });
        if (cnt) cnt.textContent = 'Mostrando ' + n + ' de ' + items.length + ' servicios';
        if (vacio) vacio.hidden = n !== 0;
      });
    });
  }

  /* Galería con ampliación */
  var lb = d.getElementById('lightbox');
  if (lb) {
    var gi = Array.prototype.slice.call(d.querySelectorAll('.gal-item')), idx = 0, ult = null;
    var img = d.getElementById('lb-img');
    function ver(i) { idx = (i + gi.length) % gi.length; img.src = gi[idx].dataset.full; img.alt = gi[idx].dataset.alt; }
    function abrir(i) { ult = d.activeElement; ver(i); lb.hidden = false; d.body.style.overflow = 'hidden'; d.getElementById('lb-cerrar').focus(); }
    function cerrar() { lb.hidden = true; d.body.style.overflow = ''; if (ult) ult.focus(); }
    gi.forEach(function (g, i) { g.addEventListener('click', function () { abrir(i); }); });
    d.getElementById('lb-cerrar').addEventListener('click', cerrar);
    d.getElementById('lb-prev').addEventListener('click', function () { ver(idx - 1); });
    d.getElementById('lb-next').addEventListener('click', function () { ver(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) cerrar(); });
    d.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') cerrar();
      else if (e.key === 'ArrowLeft') ver(idx - 1);
      else if (e.key === 'ArrowRight') ver(idx + 1);
      else if (e.key === 'Tab') { // mantiene el foco dentro del diálogo
        var f = lb.querySelectorAll('button'), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && d.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
  }

  /* Formulario de cita: valida y abre WhatsApp con los datos (no hay servidor) */
  var form = d.getElementById('form-cita');
  if (form) {
    var fecha = form.elements.fecha, hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
    fecha.min = hoy.toISOString().slice(0, 10);
    var q = new URLSearchParams(location.search).get('servicio');
    if (q) { for (var i = 0; i < form.elements.servicio.options.length; i++) { if (form.elements.servicio.options[i].text === q) form.elements.servicio.selectedIndex = i; } }

    var reglas = {
      nombre: function (v) { return v.trim().length < 3 ? 'Escribe tu nombre completo.' : ''; },
      telefono: function (v) { return /^3\d{9}$/.test(v.replace(/[\s-]/g, '')) ? '' : 'Ingresa un celular colombiano de 10 dígitos (ej. 3001234567).'; },
      servicio: function (v) { return v ? '' : 'Selecciona un servicio.'; },
      fecha: function (v) { return !v ? 'Elige una fecha.' : (v < fecha.min ? 'La fecha no puede ser pasada.' : ''); },
      hora: function (v) { return v ? '' : 'Elige una hora.'; }
    };
    function validar(n) {
      var el = form.elements[n], msg = reglas[n](el.value);
      d.getElementById('e-' + n).textContent = msg;
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) el.setAttribute('aria-describedby', 'e-' + n); else el.removeAttribute('aria-describedby');
      return !msg;
    }
    Object.keys(reglas).forEach(function (n) {
      form.elements[n].addEventListener('blur', function () { validar(n); });
      form.elements[n].addEventListener('input', function () { if (form.elements[n].getAttribute('aria-invalid') === 'true') validar(n); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var primero = null;
      Object.keys(reglas).forEach(function (n) { if (!validar(n) && !primero) primero = form.elements[n]; });
      if (primero) { primero.focus(); return; }
      var f = form.elements;
      var fe = f.fecha.value.split('-').reverse().join('/');
      var txt = 'Hola, quiero pedir una cita en Distrito Barber.\n' +
        'Nombre: ' + f.nombre.value.trim() + '\n' +
        'Teléfono: ' + f.telefono.value.trim() + '\n' +
        'Servicio: ' + f.servicio.value + '\n' +
        'Barbero: ' + (f.barbero.value || 'Sin preferencia') + '\n' +
        'Fecha: ' + fe + '\nHora: ' + f.hora.value;
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
    });
  }
})();
