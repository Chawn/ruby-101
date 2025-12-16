class GeminiService
  require "httparty"

  API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

  def initialize
    @api_key = ENV["GEMINI_API_KEY"]
  end

  def parse_transaction_command(user_message)
    prompt = build_prompt(user_message)

    begin
      response = HTTParty.post(
        "#{API_URL}?key=#{@api_key}",
        headers: { 'Content-Type': "application/json" },
        body: {
          contents: [ {
            parts: [ {
              text: prompt
            } ]
          } ]
        }.to_json,
        timeout: 30
      )

      if response.code == 200
        text = response.dig("candidates", 0, "content", "parts", 0, "text")
        if text
          parse_ai_response(text)
        else
          { error: "No response from AI" }
        end
      else
        Rails.logger.error "Gemini API Error: #{response.code} - #{response.body}"
        { error: "API returned status #{response.code}" }
      end
    rescue HTTParty::Error, Net::ReadTimeout => e
      Rails.logger.error "Gemini API Connection Error: #{e.message}"
      { error: "Connection error: #{e.message}" }
    rescue => e
      Rails.logger.error "Gemini Service Error: #{e.message}\n#{e.backtrace.join("\n")}"
      { error: e.message }
    end
  end

  private

  def build_prompt(user_message)
    <<~PROMPT
      You are a helpful assistant that parses commands to create transactions, todos, or blog posts.

      CRITICAL: Check for these EXACT patterns FIRST before anything else:

      1. TODO PATTERNS (Highest Priority):
         - Starts with: "add todo", "create task", "todo:", "task:", "new todo", "new task"
         - Contains: "todo:" or "task:" anywhere in text
         - Examples:
           * "Add todo: Finish project report" → create_todo with title="Finish project report"
           * "Create task: Call dentist" → create_todo with title="Call dentist"
           * "todo: Buy groceries" → create_todo with title="Buy groceries"

      2. BLOG POST PATTERNS (Highest Priority):
         - Starts with: "create post", "write blog", "post:", "blog:", "new post", "write post"
         - Contains: "post:" or "blog:" anywhere in text
         - Examples:
           * "Create post: My first blog" → create_post with title="My first blog"
           * "Write blog: Today's learning" → create_post with title="Today's learning"
           * "post: Hello world" → create_post with title="Hello world"

      3. TRANSACTION PATTERNS (Only if NO todo/post keywords found):
         - Contains: numbers AND money keywords ("baht", "bath", "$", "฿", "บาท")
         - OR starts with: "income", "expense", "รายรับ", "รายจ่าย"
         - Examples:
           * "Expense 50 baht for lunch" → create_transaction
           * "Income 1000 from sales" → create_transaction

      DECISION RULES:
      1. If text contains "todo:" or "task:" or starts with "add todo/create task" → MUST return create_todo
      2. If text contains "post:" or "blog:" or starts with "create post/write blog" → MUST return create_post
      3. Only if neither todo nor post keywords exist → check for transaction

      Return ONLY valid JSON with ONE of these structures:

      For TODOS:
      {
        "action": "create_todo",
        "title": "task description (remove 'add todo:', 'task:', etc.)",
        "status": "pending"
      }

      For BLOG POSTS:
      {
        "action": "create_post",
        "title": "post title (remove 'create post:', 'blog:', etc.)",
        "content": "same as title if no separate content"
      }

      For TRANSACTIONS:
      {
        "action": "create_transaction",
        "title": "description",
        "amount": 123,
        "kind": "income" or "expense",
        "date": "#{Date.today.strftime('%Y-%m-%d')}"
      }

      User command: "#{user_message}"

      Return ONLY the JSON object. No markdown. No explanation.
    PROMPT
  end

  def parse_ai_response(text)
    # Remove markdown code blocks if present
    json_text = text.strip
    json_text = json_text.gsub(/```json\n?/, "").gsub(/```\n?/, "").strip

    parsed = JSON.parse(json_text, symbolize_names: true)

    # Validate based on action type
    case parsed[:action]
    when "create_transaction"
      required_fields = [ :action, :title, :amount, :kind, :date ]
    when "create_todo"
      required_fields = [ :action, :title, :status ]
    when "create_post"
      required_fields = [ :action, :title, :content ]
    else
      return { error: "Unknown action: #{parsed[:action]}" }
    end

    missing_fields = required_fields - parsed.keys

    if missing_fields.any?
      { error: "Missing fields: #{missing_fields.join(', ')}" }
    else
      parsed
    end
  rescue JSON::ParserError => e
    Rails.logger.error "JSON Parse Error: #{e.message}\nText: #{text}"
    { error: "Failed to parse AI response" }
  end
end
