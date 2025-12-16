class AddAiTokensToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :ai_tokens_used, :integer
    add_column :users, :ai_tokens_reset_at, :datetime
  end
end
