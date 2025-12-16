import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
	static targets = ['dark', 'light', 'system', 'label'];

	connect() {
		this.applyTheme();
	}

	selectTheme(event) {
		const theme = event.currentTarget.dataset.theme;
		this.setTheme(theme);

		// Close dropdown after selection
		const dropdown = event.currentTarget.closest('details');
		if (dropdown) dropdown.removeAttribute('open');
	}

	getCurrentTheme() {
		return localStorage.getItem('theme') || 'dim';
	}

	setTheme(theme) {
		localStorage.setItem('theme', theme);
		this.applyTheme();
	}

	applyTheme() {
		const savedTheme = this.getCurrentTheme();
		let actualTheme = savedTheme;

		if (savedTheme === 'system') {
			actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dim'
				: 'light';
		}

		document.documentElement.setAttribute('data-theme', actualTheme);
		this.updateButtonStates();
		this.updateLabel();
	}

	updateButtonStates() {
		const theme = this.getCurrentTheme();

		// Remove active class from all buttons
		if (this.hasDarkTarget) this.darkTarget.classList.remove('btn-active');
		if (this.hasLightTarget) this.lightTarget.classList.remove('btn-active');
		if (this.hasSystemTarget) this.systemTarget.classList.remove('btn-active');

		// Add active class to current theme button
		if (theme === 'dim' && this.hasDarkTarget) {
			this.darkTarget.classList.add('btn-active');
		} else if (theme === 'light' && this.hasLightTarget) {
			this.lightTarget.classList.add('btn-active');
		} else if (theme === 'system' && this.hasSystemTarget) {
			this.systemTarget.classList.add('btn-active');
		}
	}

	updateLabel() {
		if (!this.hasLabelTarget) return;

		const theme = this.getCurrentTheme();
		const labels = {
			dim: '🌙 Dark',
			light: '☀️ Light',
			system: '💻 System',
		};

		this.labelTarget.textContent = labels[theme] || '🌙 Theme';
	}
}
