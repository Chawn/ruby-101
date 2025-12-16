import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
	static targets = ['dateInput', 'viewMode'];

	connect() {
		// Set initial values from URL params
		const urlParams = new URLSearchParams(window.location.search);
		const date =
			urlParams.get('date') || new Date().toISOString().split('T')[0];
		const viewMode = urlParams.get('view_mode') || 'daily';

		this.dateInputTarget.value = date;
		this.viewModeTarget.value = viewMode;
	}

	goToToday() {
		const today = new Date().toISOString().split('T')[0];
		this.dateInputTarget.value = today;
		this.updateUrl();
	}

	previousPeriod() {
		const currentDate = new Date(this.dateInputTarget.value);
		const viewMode = this.viewModeTarget.value;

		let newDate;
		switch (viewMode) {
			case 'monthly':
				newDate = new Date(
					currentDate.getFullYear(),
					currentDate.getMonth() - 1,
					1
				);
				break;
			case 'yearly':
				newDate = new Date(currentDate.getFullYear() - 1, 0, 1);
				break;
			default: // daily
				newDate = new Date(currentDate);
				newDate.setDate(newDate.getDate() - 1);
		}

		this.dateInputTarget.value = newDate.toISOString().split('T')[0];
		this.updateUrl();
	}

	nextPeriod() {
		const currentDate = new Date(this.dateInputTarget.value);
		const viewMode = this.viewModeTarget.value;

		let newDate;
		switch (viewMode) {
			case 'monthly':
				newDate = new Date(
					currentDate.getFullYear(),
					currentDate.getMonth() + 1,
					1
				);
				break;
			case 'yearly':
				newDate = new Date(currentDate.getFullYear() + 1, 0, 1);
				break;
			default: // daily
				newDate = new Date(currentDate);
				newDate.setDate(newDate.getDate() + 1);
		}

		this.dateInputTarget.value = newDate.toISOString().split('T')[0];
		this.updateUrl();
	}

	changeDate() {
		this.updateUrl();
	}

	changeViewMode() {
		this.updateUrl();
	}

	updateUrl() {
		const viewMode = this.viewModeTarget.value;
		let dateValue = this.dateInputTarget.value;
		let formattedDate;

		// Format date based on view mode
		switch (viewMode) {
			case 'monthly':
				// Input is in YYYY-MM format, convert to first day of month
				formattedDate = dateValue + '-01';
				break;
			case 'yearly':
				// Input is a year number, convert to first day of year
				formattedDate = dateValue + '-01-01';
				break;
			default: // daily
				// Input is already in YYYY-MM-DD format
				formattedDate = dateValue;
		}

		const url = new URL(window.location);
		url.searchParams.set('date', formattedDate);
		url.searchParams.set('view_mode', viewMode);

		// Use Turbo to navigate
		Turbo.visit(url.toString());
	}
}
