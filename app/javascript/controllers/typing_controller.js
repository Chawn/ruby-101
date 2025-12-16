import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
	static targets = ['input'];

	connect() {
		this.examples = [
			'Add income: Salary 50000 baht',
			'Add expense: Lunch 150 baht',
			'Create todo: Finish project report',
			'Add todo: Call dentist tomorrow',
			'Write post: My learning journey',
		];
		this.currentIndex = 0;
		this.currentText = '';
		this.isDeleting = false;
		this.typingSpeed = 100;
		this.deletingSpeed = 50;
		this.pauseTime = 2000;

		this.type();
	}

	type() {
		const currentExample = this.examples[this.currentIndex];

		if (this.isDeleting) {
			// Delete character
			this.currentText = currentExample.substring(
				0,
				this.currentText.length - 1
			);
		} else {
			// Add character
			this.currentText = currentExample.substring(
				0,
				this.currentText.length + 1
			);
		}

		// Update placeholder
		this.inputTarget.placeholder = this.currentText;

		let timeout = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

		// Check if finished typing
		if (!this.isDeleting && this.currentText === currentExample) {
			timeout = this.pauseTime;
			this.isDeleting = true;
		} else if (this.isDeleting && this.currentText === '') {
			this.isDeleting = false;
			this.currentIndex = (this.currentIndex + 1) % this.examples.length;
			timeout = 500;
		}

		setTimeout(() => this.type(), timeout);
	}

	openChat() {
		// Open the AI sidebar drawer
		const drawer = document.getElementById('ai-drawer');
		if (drawer) {
			drawer.checked = true;
		}

		// Focus on the chat input
		setTimeout(() => {
			const chatInput = document.querySelector('[data-ai-chat-target="input"]');
			if (chatInput) {
				chatInput.focus();
			}
		}, 100);
	}
}
