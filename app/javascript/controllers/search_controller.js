import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
	static targets = ['searchIcon', 'searchInput', 'title'];

	connect() {
		// Bind the click outside handler
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	disconnect() {
		// Clean up event listener
		document.removeEventListener('click', this.handleClickOutside);
	}

	toggleSearch() {
		// Toggle between icon and search input (title stays visible)
		this.searchIconTarget.classList.toggle('hidden');
		this.searchInputTarget.classList.toggle('hidden');

		// Focus input when shown
		if (!this.searchInputTarget.classList.contains('hidden')) {
			this.searchInputTarget.querySelector('input').focus();
			// Add click outside listener
			setTimeout(() => {
				document.addEventListener('click', this.handleClickOutside);
			}, 0);
		} else {
			// Remove click outside listener
			document.removeEventListener('click', this.handleClickOutside);
		}
	}

	handleClickOutside(event) {
		// Check if click is outside search input
		if (
			!this.searchInputTarget.contains(event.target) &&
			!this.searchIconTarget.contains(event.target)
		) {
			this.closeSearch();
		}
	}

	search() {
		const input = this.searchInputTarget.querySelector('input');
		const query = input ? input.value.toLowerCase() : '';

		// Check for table rows (transactions)
		const rows = document.querySelectorAll('tbody tr');
		if (rows.length > 0) {
			rows.forEach(row => {
				const text = row.textContent.toLowerCase();
				if (text.includes(query)) {
					row.style.display = '';
				} else {
					row.style.display = 'none';
				}
			});
		}

		// Check for card divs (todos/posts)
		const cards = document.querySelectorAll('.card');
		if (cards.length > 0) {
			cards.forEach(card => {
				const text = card.textContent.toLowerCase();
				if (text.includes(query)) {
					card.closest('div').style.display = '';
				} else {
					card.closest('div').style.display = 'none';
				}
			});
		}
	}

	closeSearch() {
		// Clear search
		const input = this.searchInputTarget.querySelector('input');
		if (input) {
			input.value = '';
		}
		this.search(); // Reset display

		// Show icon, hide search input (title stays visible)
		this.searchIconTarget.classList.remove('hidden');
		this.searchInputTarget.classList.add('hidden');

		// Remove click outside listener
		document.removeEventListener('click', this.handleClickOutside);
	}
}
