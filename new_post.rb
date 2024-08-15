#!/usr/bin/env ruby
require 'date'

# 포스트 제목을 인자로 받아옵니다.
title = ARGV[0] || "new-post"
date = DateTime.now

# 파일 이름을 'YYYY-MM-DD-title.md' 형식으로 만듭니다.
filename = "#{date.strftime('%Y-%m-%d')}-#{title.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')}.md"

# 파일 경로를 설정합니다.
filepath = "_posts/#{filename}"

# 포스트 파일을 생성하고 기본 내용을 작성합니다.
File.open(filepath, "w") do |file|
  file.puts "---"
  file.puts "layout: post"
  file.puts "title: \"#{title.split('-').map(&:capitalize).join(' ')}\""
  file.puts "date: #{date.strftime('%Y-%m-%d %H:%M:%S %z')}"
  file.puts "categories: "
  file.puts "tags: "
  file.puts "---"
  file.puts
  file.puts "Content goes here"
end

puts "New post created: #{filepath}"
