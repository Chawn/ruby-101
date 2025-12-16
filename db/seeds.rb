# Create a default user
User.find_or_create_by!(email: 'admin@example.com') do |user|
  user.password = 'admin'
  user.password_confirmation = 'admin'
end

puts "Default user created:"
puts "Email: admin@example.com"
puts "Password: admin"
