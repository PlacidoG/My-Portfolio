// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('primary-nav');
if (toggle && nav) {
	toggle.addEventListener('click', () => {
		const isOpen = nav.classList.toggle('open');
		toggle.setAttribute('aria-expanded', String(isOpen));
	});
}

// Close menu on link click (mobile)
document.querySelectorAll('#primary-nav a').forEach(a => a.addEventListener('click', () => {
	if (nav && nav.classList.contains('open')) {
		nav.classList.remove('open');
		toggle?.setAttribute('aria-expanded', 'false');
	}
}));

// Active link on scroll
const sections = ['projects','resume','contact']
	.map(id => document.getElementById(id))
	.filter(Boolean);
const linkMap = new Map();
document.querySelectorAll('#primary-nav a').forEach(a => {
	const hash = a.getAttribute('href') || '';
	if (hash.startsWith('#')) linkMap.set(hash.slice(1), a);
});

const onScroll = () => {
	let current = null;
	const scrollY = window.scrollY + 120; // offset for header
	sections.forEach(sec => {
		if (sec && sec.offsetTop <= scrollY) current = sec.id;
	});
	document.querySelectorAll('#primary-nav a').forEach(a => a.classList.remove('active'));
	if (current && linkMap.get(current)) {
		linkMap.get(current).classList.add('active');
	}
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Current year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

console.log('Portfolio UI initialized');

// Render projects from projects.json with inline fallback
(async function renderProjects() {
	const grid = document.getElementById('projects-grid');
	if (!grid) return;

	const inlineEl = document.getElementById('projects-data');
	let data = [];

	async function tryFetchJSON() {
		try {
			const res = await fetch('projects.json', { cache: 'no-store' });
			if (!res.ok) throw new Error('projects.json not found');
			return await res.json();
		} catch (_) {
			return null;
		}
	}

	const remote = await tryFetchJSON();
	if (remote && Array.isArray(remote)) {
		data = remote;
	} else if (inlineEl?.textContent) {
		try { data = JSON.parse(inlineEl.textContent); } catch { data = []; }
	}

	if (!Array.isArray(data) || data.length === 0) return;

	grid.innerHTML = data.map(p => {
		const demo = p.demo ? `<a class="btn btn-small" href="${p.demo}" target="_blank" rel="noopener">Demo</a>` : '';
		const src = p.source ? `<a class="btn btn-small btn-ghost" href="${p.source}" target="_blank" rel="noopener">Source</a>` : '';
		const tags = Array.isArray(p.tags) && p.tags.length ? `<div class="muted" style="font-size:.9rem">${p.tags.join(' • ')}</div>` : '';
		return `
			<article class="card">
				<h3 class="card-title">${p.title || 'Untitled'}</h3>
				<p class="card-body">${p.description || ''}</p>
				${tags}
				<div class="card-actions">${demo}${src}</div>
			</article>`;
	}).join('');
})();

// Contact form (Formspree placeholder + mailto fallback)
(function contactForm() {
	const form = document.getElementById('contact-form');
	if (!form) return;
	const status = document.getElementById('form-status');
	const endpoint = form.getAttribute('data-endpoint');
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		status.textContent = 'Sending…';
		const formData = new FormData(form);

		if (!endpoint || endpoint === '#') {
			status.textContent = 'Form endpoint not configured — using email';
			const name = encodeURIComponent(formData.get('name') || '');
			const email = encodeURIComponent(formData.get('email') || '');
			const message = encodeURIComponent(formData.get('message') || '');
			const mailto = document.getElementById('mailto-link');
			const to = (mailto?.getAttribute('href') || 'mailto:garayp2@gator.uhd.edu').replace('mailto:', '');
			const url = `mailto:${to}?subject=Portfolio%20contact%20from%20${name}&body=${message}%0A%0AFrom:%20${name}%20<${email}>`;
			window.location.href = url;
			status.textContent = 'Opened email client.';
			return;
		}

		try {
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Accept': 'application/json' },
				body: formData,
			});
			if (res.ok) {
				status.textContent = 'Thanks! Your message has been sent.';
				form.reset();
			} else {
				status.textContent = 'There was a problem sending your message. Please try email.';
			}
		} catch (err) {
			status.textContent = 'Network error. Please try email.';
		}
	});
})();

// Theme toggle with persistence
(function themeToggle() {
	const btn = document.querySelector('.theme-toggle');
	const root = document.documentElement;
	const apply = (mode) => {
		if (mode === 'light') root.classList.add('theme-light');
		else root.classList.remove('theme-light');
		localStorage.setItem('theme', mode);
		const icon = btn?.querySelector('.theme-icon');
		if (icon) icon.textContent = mode === 'light' ? '☀' : '☾';
	};
	const saved = localStorage.getItem('theme');
	if (saved) apply(saved);
	else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) apply('light');
	btn?.addEventListener('click', () => {
		const current = root.classList.contains('theme-light') ? 'light' : 'dark';
		apply(current === 'light' ? 'dark' : 'light');
	});
})();

// Copy email buttons
(function copyEmailInit() {
	const buttons = document.querySelectorAll('.copy-email');
	if (!buttons.length) return;
	buttons.forEach(btn => {
		btn.addEventListener('click', async () => {
			const email = btn.getAttribute('data-email') || 'garayp2@gator.uhd.edu';
			try {
				await navigator.clipboard.writeText(email);
					const tip = btn.querySelector('.tooltip-bubble');
					if (tip) {
						tip.classList.add('show');
						setTimeout(() => tip.classList.remove('show'), 1200);
					}
			} catch {
				// Fallback: open mailto if clipboard not available
				window.location.href = `mailto:${email}`;
			}
		});
	});
})();