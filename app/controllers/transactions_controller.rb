class TransactionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_transaction, only: %i[ show edit update destroy ]

  # GET /transactions or /transactions.json
  def index
    # Get filter parameters
    @view_mode = params[:view_mode] || 'daily'
    @selected_date = params[:date] ? Date.parse(params[:date]) : Date.today
    
    # Calculate date range based on view mode
    case @view_mode
    when 'monthly'
      start_date = @selected_date.beginning_of_month
      end_date = @selected_date.end_of_month
    when 'yearly'
      start_date = @selected_date.beginning_of_year
      end_date = @selected_date.end_of_year
    else # daily
      start_date = @selected_date
      end_date = @selected_date
    end
    
    # Filter transactions by date range
    @transactions = current_user.transactions
                                 .where(date: start_date..end_date)
                                 .order(date: :desc, created_at: :desc)
    
    # Calculate summary statistics
    @total_income = @transactions.where("LOWER(kind) = ?", 'income').sum(:amount)
    @total_expense = @transactions.where("LOWER(kind) != ?", 'income').sum(:amount)
    @net = @total_income - @total_expense
  end

  # GET /transactions/1 or /transactions/1.json
  def show
  end

  # GET /transactions/new
  def new
    @transaction = Transaction.new
  end

  # GET /transactions/1/edit
  def edit
  end

  # POST /transactions or /transactions.json
  def create
    @transaction = current_user.transactions.new(transaction_params)

    respond_to do |format|
      if @transaction.save
        format.html { redirect_to @transaction, notice: "Transaction was successfully created." }
        format.json { render :show, status: :created, location: @transaction }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @transaction.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /transactions/1 or /transactions/1.json
  def update
    respond_to do |format|
      if @transaction.update(transaction_params)
        format.html { redirect_to @transaction, notice: "Transaction was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @transaction }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @transaction.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /transactions/1 or /transactions/1.json
  def destroy
    @transaction.destroy!

    respond_to do |format|
      format.html { redirect_to transactions_path, notice: "Transaction was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_transaction
      @transaction = Transaction.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def transaction_params
      params.expect(transaction: [ :title, :amount, :kind, :date, :user_id ])
    end
end
