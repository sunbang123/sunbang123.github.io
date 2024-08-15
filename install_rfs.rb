# 루비에서 쉘 명령어를 실행하기 위해 필요
require 'fileutils'

# 1. `rfs` 라이브러리 설치
puts "Installing rfs library via npm..."
system("npm install rfs")

# 2. `rfs` 라이브러리 설치 확인
node_modules_path = File.join(Dir.pwd, 'node_modules', 'rfs')
if Dir.exist?(node_modules_path)
  puts "rfs successfully installed in #{node_modules_path}"
else
  puts "Failed to install rfs. Please check your npm installation."
  exit(1)
end

# 3. SCSS 파일에 `rfs`를 포함하는 코드 추가
scss_file_path = File.join(Dir.pwd, '_sass', 'bootstrap', '_mixins.scss')
if File.exist?(scss_file_path)
  puts "Adding rfs import to #{scss_file_path}..."
  
  # 파일에 `@import 'rfs';` 추가
  File.open(scss_file_path, 'a') do |file|
    file.puts("\n@import 'rfs';")
  end
  
  puts "rfs import added to #{scss_file_path}."
else
  puts "SCSS file #{scss_file_path} not found. Please check your paths."
  exit(1)
end

puts "Script completed successfully!"
