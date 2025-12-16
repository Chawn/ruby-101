import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
	static values = { title: String, message: String };

	connect() {
		// No-op
	}

	delete(event) {
		event.preventDefault();

		// Create Modal HTML
		const modalId = 'confirm-modal-' + new Date().getTime();
		const modal = document.createElement('dialog');
		modal.className = 'modal';
		modal.id = modalId;

		modal.innerHTML = `
      <div class="modal-box">
        <h3 class="font-bold text-lg">${
					this.titleValue || 'Confirm Deletion'
				}</h3>
        <p class="py-4">${
					this.messageValue ||
					'Are you sure you want to delete this item? This action cannot be undone.'
				}</p>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-ghost" id="cancel-${modalId}">Cancel</button>
            <button class="btn btn-error" id="confirm-${modalId}">Delete</button>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    `;

		document.body.appendChild(modal);
		modal.showModal();

		// Handle Actions
		const confirmBtn = modal.querySelector(`#confirm-${modalId}`);
		const cancelBtn = modal.querySelector(`#cancel-${modalId}`);

		confirmBtn.addEventListener('click', e => {
			// Find the form that was originally submitted or link clicked
			// For Turbo methods, we need to allow the event to proceed
			// This is a simplified version, for proper Rails UJS/Turbo it's tricky to re-trigger
			// So we will just submit the form if it's a form submit, or follow link
			modal.close();
			this.element.removeAttribute('data-action'); // Prevent recursion
			this.element.click(); // Re-click without the interceptor
			this.element.setAttribute('data-action', 'click->confirm#delete'); // Restore
		});

		modal.addEventListener('close', () => {
			modal.remove();
		});
	}
}
