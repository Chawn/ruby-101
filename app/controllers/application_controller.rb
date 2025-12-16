class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  
  layout :layout_by_resource

  private

  def layout_by_resource
    if devise_controller?
      "auth"
    else
      "application"
    end
  end

  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path
  end

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes
end
