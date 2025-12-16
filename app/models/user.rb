class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :transactions, dependent: :destroy
  has_many :posts, dependent: :destroy
  has_many :todos, dependent: :destroy
  has_many :chat_messages, dependent: :destroy

  MAX_AI_TOKENS = 10
  TOKEN_RESET_HOURS = 5

  def ai_tokens_remaining
    reset_tokens_if_needed
    MAX_AI_TOKENS - (ai_tokens_used || 0)
  end

  def can_use_ai_token?
    ai_tokens_remaining > 0
  end

  def use_ai_token!
    reset_tokens_if_needed
    increment!(:ai_tokens_used)
  end

  def next_token_reset_time
    return Time.current + TOKEN_RESET_HOURS.hours if ai_tokens_reset_at.nil?
    ai_tokens_reset_at
  end

  private

  def reset_tokens_if_needed
    if ai_tokens_reset_at.nil? || Time.current >= ai_tokens_reset_at
      update_columns(
        ai_tokens_used: 0,
        ai_tokens_reset_at: Time.current + TOKEN_RESET_HOURS.hours
      )
    end
  end
end
