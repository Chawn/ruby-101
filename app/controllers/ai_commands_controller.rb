class AiCommandsController < ApplicationController
  before_action :authenticate_user!
  
  def index
    # Load chat history for current user
    @messages = current_user.chat_messages.order(created_at: :asc).limit(50)
    render json: {
      messages: @messages.map { |msg|
        [
          { role: 'user', content: msg.user_message, created_at: msg.created_at },
          { role: 'assistant', content: msg.ai_response, created_at: msg.created_at }
        ]
      }.flatten,
      tokens_used: current_user.ai_tokens_used || 0,
      tokens_remaining: current_user.ai_tokens_remaining,
      next_reset: current_user.next_token_reset_time
    }
  end
  
  def destroy
    # Delete all chat messages for current user
    current_user.chat_messages.destroy_all
    render json: { 
      type: 'success',
      message: 'Chat history cleared successfully'
    }
  end
  
  def create
    user_message = params[:message]
    
    if user_message.blank?
      return render json: { error: 'Message cannot be empty' }, status: :unprocessable_entity
    end
    
    # Check token limit
    unless current_user.can_use_ai_token?
      # Secret reset command
      if user_message.strip.downcase == 'please'
        current_user.update_columns(
          ai_tokens_used: 0,
          ai_tokens_reset_at: Time.current + User::TOKEN_RESET_HOURS.hours
        )
        
        ai_response = "✨ Magic word accepted! Your tokens have been reset. You now have #{User::MAX_AI_TOKENS} tokens available."
        
        current_user.chat_messages.create(
          user_message: user_message,
          ai_response: ai_response
        )
        
        return render json: {
          type: 'success',
          message: ai_response,
          tokens_used: 0,
          tokens_remaining: User::MAX_AI_TOKENS
        }
      end
      
      reset_time = current_user.next_token_reset_time.strftime('%d %b %Y at %H:%M')
      ai_response = "Token limit reached. Next reset on #{reset_time}. Please wait."
      
      return render json: {
        type: 'error',
        message: ai_response,
        tokens_used: current_user.ai_tokens_used,
        tokens_remaining: 0,
        next_reset: current_user.next_token_reset_time
      }
    end
    
    # Use a token
    current_user.use_ai_token!
    
    # Call Gemini AI to parse the command
    gemini = GeminiService.new
    parsed_data = gemini.parse_transaction_command(user_message)
    
    if parsed_data[:error]
      ai_response = "Sorry, I didn't understand. Please try again."
      
      # Save to chat history
      current_user.chat_messages.create(
        user_message: user_message,
        ai_response: ai_response
      )
      
      return render json: { 
        type: 'error',
        message: ai_response,
        details: parsed_data[:error]
      }
    end
    
    # Create resource based on action type
    result = case parsed_data[:action]
    when 'create_transaction'
      create_transaction(parsed_data, user_message)
    when 'create_todo'
      create_todo(parsed_data, user_message)
    when 'create_post'
      create_post(parsed_data, user_message)
    else
      {
        type: 'error',
        message: "Unknown action type",
        ai_response: "I couldn't determine what to create. Please try again."
      }
    end
    
    # Save to chat history if not already saved
    if result[:ai_response]
      current_user.chat_messages.create(
        user_message: user_message,
        ai_response: result[:ai_response]
      )
    end
    
    render json: result
  rescue => e
    ai_response = "System error occurred. Please try again."
    
    # Save to chat history
    current_user.chat_messages.create(
      user_message: user_message,
      ai_response: ai_response
    )
    
    render json: {
      type: 'error',
      message: ai_response,
      details: e.message
    }, status: :internal_server_error
  end
  
  private
  
  def create_transaction(parsed_data, user_message)
    transaction = current_user.transactions.new(
      title: parsed_data[:title],
      amount: parsed_data[:amount],
      kind: parsed_data[:kind],
      date: parse_date(parsed_data[:date])
    )
    
    if transaction.save
      ai_response = "✅ Transaction saved! #{transaction.kind == 'income' ? 'Income' : 'Expense'} #{number_to_currency(transaction.amount, unit: '฿')}"
      
      {
        type: 'success',
        message: ai_response,
        ai_response: ai_response,
        resource: {
          id: transaction.id,
          type: 'transaction',
          title: transaction.title,
          url: transaction_path(transaction)
        },
        tokens_used: current_user.ai_tokens_used,
        tokens_remaining: current_user.ai_tokens_remaining
      }
    else
      ai_response = "Error: #{transaction.errors.full_messages.join(', ')}"
      {
        type: 'error',
        message: ai_response,
        ai_response: ai_response
      }
    end
  end
  
  def create_todo(parsed_data, user_message)
    todo = current_user.todos.new(
      title: parsed_data[:title],
      status: parsed_data[:status] || 'pending'
    )
    
    if todo.save
      ai_response = "✅ Todo created! Task: #{todo.title}"
      
      {
        type: 'success',
        message: ai_response,
        ai_response: ai_response,
        resource: {
          id: todo.id,
          type: 'todo',
          title: todo.title,
          url: todo_path(todo)
        },
        tokens_used: current_user.ai_tokens_used,
        tokens_remaining: current_user.ai_tokens_remaining
      }
    else
      ai_response = "Error: #{todo.errors.full_messages.join(', ')}"
      {
        type: 'error',
        message: ai_response,
        ai_response: ai_response
      }
    end
  end
  
  def create_post(parsed_data, user_message)
    post = current_user.posts.new(
      title: parsed_data[:title],
      content: parsed_data[:content] || parsed_data[:title]
    )
    
    if post.save
      ai_response = "✅ Blog post created! Title: #{post.title}"
      
      {
        type: 'success',
        message: ai_response,
        ai_response: ai_response,
        resource: {
          id: post.id,
          type: 'post',
          title: post.title,
          url: post_path(post)
        },
        tokens_used: current_user.ai_tokens_used,
        tokens_remaining: current_user.ai_tokens_remaining
      }
    else
      ai_response = "Error: #{post.errors.full_messages.join(', ')}"
      {
        type: 'error',
        message: ai_response,
        ai_response: ai_response
      }
    end
  end
  
  def parse_date(date_string)
    Date.parse(date_string)
  rescue
    Date.today
  end
  
  include ActionView::Helpers::NumberHelper
end
