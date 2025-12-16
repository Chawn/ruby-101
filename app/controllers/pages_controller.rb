class PagesController < ApplicationController
  def home
    if user_signed_in?
      @income = current_user.transactions.where("LOWER(kind) = ?", "income").sum(:amount)
      @expense = current_user.transactions.where("LOWER(kind) != ?", "income").sum(:amount)
      @balance = @income - @expense

      @pending_todos_count = current_user.todos.where.not(status: "completed").count
      @recent_posts = current_user.posts.order(created_at: :desc).limit(3)
    end
  end
end
