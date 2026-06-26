#!/usr/bin/env ruby
require 'date'

# 파일명으로 쓸 영문 슬러그(slug)와 실제 포스트 제목을 인자로 받습니다.
slug = ARGV[0] || "new-devlog"
title = ARGV[1] || slug

date = DateTime.now

# 파일 이름을 'YYYY-MM-DD-slug.md' 형식으로 만듭니다. (영문, 숫자, 하이픈만 남김)
filename = "#{date.strftime('%Y-%m-%d')}-#{slug.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')}.md"

# 파일 경로를 설정합니다. (Jekyll 설정에 따라 _devlogs 컬렉션을 쓴다면 폴더명을 변경하세요)
filepath = "_devlogs/#{filename}"

# 포스트 파일을 생성하고 개발 일지 기본 양식을 작성합니다.
File.open(filepath, "w") do |file|
  # Front Matter 부분
  file.puts "---"
  file.puts "title: \"#{title}\""
  file.puts "date: #{date.strftime('%Y-%m-%d %H:%M:%S %z')}"
  file.puts "tags: []"
  file.puts "---"
  
end

puts "New devlog template created: #{filepath}"