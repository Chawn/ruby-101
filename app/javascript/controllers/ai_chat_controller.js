import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
	static targets = ['messages', 'input', 'form'];

	connect() {
		this.messages = [];
		this.loadHistory();
		// Store reference globally for modal access
		window.aiChatController = this;
	}

	disconnect() {
		window.aiChatController = null;
	}

	async loadHistory() {
		try {
			const response = await fetch('/ai_commands', {
				headers: {
					'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
				},
			});

			if (response.ok) {
				const data = await response.json();

				// Update token display
				this.updateTokenDisplay(data.tokens_used, data.tokens_remaining);

				// Clear welcome message if there's history
				if (data.messages && data.messages.length > 0) {
					this.messagesTarget.innerHTML = '';
					this.hasHistory = true;
				} else {
					this.hasHistory = false;
				}

				// Display history
				if (data.messages) {
					data.messages.forEach(msg => {
						this.addMessage(msg.role, msg.content, false);
					});
				}
			}
		} catch (error) {
			console.error('Failed to load chat history:', error);
		}
	}

	async send(event) {
		event.preventDefault();

		const message = this.inputTarget.value.trim();
		if (!message) return;

		// Clear welcome message on first send
		if (!this.hasHistory) {
			this.messagesTarget.innerHTML = '';
			this.hasHistory = true;
		}

		// Add user message to chat
		this.addMessage('user', message);
		this.inputTarget.value = '';

		// Show loading
		this.addMessage('assistant', '...', true);

		try {
			const response = await fetch('/ai_commands', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
				},
				body: JSON.stringify({ message: message }),
			});

			const data = await response.json();

			// Remove loading message
			this.removeLoadingMessage();

			// Update token display if available
			if (
				data.tokens_used !== undefined &&
				data.tokens_remaining !== undefined
			) {
				this.updateTokenDisplay(data.tokens_used, data.tokens_remaining);
			}

			// Add AI response
			if (data.type === 'success') {
				this.addMessage('assistant', data.message);
				if (data.resource) {
					this.addResourceLink(data.resource);
				}
			} else {
				this.addMessage(
					'assistant',
					data.message || 'Error occurred. Please try again.'
				);
			}
		} catch (error) {
			this.removeLoadingMessage();
			this.addMessage('assistant', 'Connection error occurred.');
		}
	}

	addMessage(role, content, isLoading = false) {
		const messageDiv = document.createElement('div');
		messageDiv.className =
			role === 'user' ? 'chat chat-end' : 'chat chat-start';

		let bubbleHTML = '';
		if (role === 'user') {
			// User messages: light background with base-100
			bubbleHTML = `<div class="chat-bubble bg-base-100 text-base-content">${this.escapeHtml(
				content
			)}</div>`;
		} else {
			// AI messages: no background, just text
			bubbleHTML = `<div class="text-sm opacity-90 ${
				isLoading ? 'loading-message' : ''
			}">${content}</div>`;
		}

		messageDiv.innerHTML = bubbleHTML;
		this.messagesTarget.appendChild(messageDiv);
		this.scrollToBottom();
	}

	escapeHtml(text) {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}

	addResourceLink(resource) {
		const linkDiv = document.createElement('div');
		linkDiv.className = 'chat chat-start';

		const icon =
			resource.type === 'transaction'
				? '💰'
				: resource.type === 'todo'
				? '✅'
				: '📝';

		linkDiv.innerHTML = `
      <div class="chat-bubble chat-bubble-accent">
        <a href="${resource.url}" class="link link-hover font-bold">
          ${icon} View: ${resource.title}
        </a>
      </div>
    `;

		this.messagesTarget.appendChild(linkDiv);
		this.scrollToBottom();
	}

	removeLoadingMessage() {
		const loadingMsg = this.messagesTarget.querySelector('.loading-message');
		if (loadingMsg) {
			loadingMsg.closest('.chat').remove();
		}
	}

	scrollToBottom() {
		this.messagesTarget.scrollTop = this.messagesTarget.scrollHeight;
	}

	toggleDrawer() {
		const drawer = document.getElementById('ai-drawer');
		if (drawer) {
			drawer.checked = !drawer.checked;
		}
	}

	updateTokenDisplay(used, remaining) {
		const tokenDisplay = document.getElementById('ai-token-display');
		if (tokenDisplay) {
			tokenDisplay.textContent = `${used}/${used + remaining}`;
		}
	}

	fillInput(event) {
		const text = event.currentTarget.dataset.text;
		this.inputTarget.value = text;
		this.inputTarget.focus();
		// Move cursor to end
		this.inputTarget.setSelectionRange(text.length, text.length);
	}

	showExamples() {
		// Add examples message without clearing history
		const examplesDiv = document.createElement('div');
		examplesDiv.className = 'chat chat-start';
		examplesDiv.innerHTML = `
			<div class="text-sm opacity-90">
				<strong>📚 Command Examples:</strong><br><br>
				
				<strong>💰 Transactions:</strong><br>
				• "Income 1000 baht from noodle sales"<br>
				• "Expense 50 baht for lunch"<br><br>
				
				<strong>✅ Todos:</strong><br>
				• "Add todo: Finish project report"<br>
				• "Create task: Call dentist tomorrow"<br><br>
				
				<strong>📝 Blog Posts:</strong><br>
				• "Create post: My first blog entry"<br>
				• "Write blog: Today's learning"
			</div>
		`;

		this.messagesTarget.appendChild(examplesDiv);
		this.scrollToBottom();
	}

	confirmClearHistory() {
		// Show DaisyUI modal
		const modal = document.getElementById('clear-history-modal');
		if (modal) {
			modal.showModal();
		}
	}

	async clearHistory() {
		// Close modal first
		const modal = document.getElementById('clear-history-modal');
		if (modal) {
			modal.close();
		}

		try {
			const response = await fetch('/ai_commands', {
				method: 'DELETE',
				headers: {
					'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
				},
			});

			if (response.ok) {
				// Clear messages display
				this.messagesTarget.innerHTML = '';

				// Show welcome message
				const welcomeDiv = document.createElement('div');
				welcomeDiv.className = 'chat chat-start';
				welcomeDiv.innerHTML = `
					<div class="text-sm opacity-90">
						Hi! I'm your AI Assistant. I can help you quickly log transactions, todos, and posts.<br><br>
						<strong>Examples:</strong><br>
						• "Income 1000 baht from noodle sales"<br>
						• "Add todo: Finish project report"<br>
						• "Create post: My first blog entry"
					</div>
				`;
				this.messagesTarget.appendChild(welcomeDiv);

				// Show success message
				this.addMessage('assistant', '✅ Chat history cleared successfully!');
			}
		} catch (error) {
			console.error('Failed to clear history:', error);
			this.addMessage(
				'assistant',
				'❌ Failed to clear history. Please try again.'
			);
		}
	}
}
