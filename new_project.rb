#!/usr/bin/env ruby
require 'date'

# 파일명으로 쓸 영문 슬러그(slug)와 실제 포스트 제목을 인자로 받습니다.
# 입력 예시: ruby new-project.rb "wafer-simulator" "웨이퍼 결함 탐지 및 모니터링 시뮬레이터"
slug = ARGV[0] || "new-project"
title = ARGV[1] || slug

date = DateTime.now

# 파일 이름을 'YYYY-MM-DD-slug.md' 형식으로 만듭니다. (영문, 숫자, 하이픈만 남김)
filename = "#{date.strftime('%Y-%m-%d')}-#{slug.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')}.md"

# 파일 경로를 설정합니다. (Jekyll 설정에 따라 _projects 컬렉션을 쓴다면 폴더명을 변경하세요)
filepath = "_posts/#{filename}"

# 포스트 파일을 생성하고 프로젝트 기본 양식을 작성합니다.
File.open(filepath, "w") do |file|
  # Front Matter 부분
  file.puts "---"
  file.puts "layout: project"
  file.puts "title: \"#{title}\""
  file.puts "date: #{date.strftime('%Y-%m-%d')}"
  file.puts "description: \"\""
  file.puts "thumbnail: \"\""
  file.puts "icon: \"\""
  file.puts "tags: []"
  file.puts "demo_url: \"\""
  file.puts "github_url: \"\""
  file.puts "status: \"\""
  file.puts "---"
  file.puts ""
  
  # Markdown Body 부분
  file.puts "# #{title}"
  file.puts ""
  file.puts "### Project Title: #{title}"
  file.puts ""
  file.puts "> 프로젝트 대시보드 Preview 이미지"
  file.puts ""
  file.puts "> <h4><a href=\"#\">상세한 아키텍처 보러가기</a></h4>"
  file.puts ""
  file.puts "* * *"
  file.puts ""
  file.puts "### 프로젝트의 탄생"
  file.puts ""
  file.puts "## Project Overview"
  file.puts "**목적:** "
  file.puts ""
  file.puts "**핵심 구현 기능:**"
  file.puts "1. "
  file.puts "2. "
  file.puts "3. "
  file.puts ""
  file.puts "## Project Document"
  file.puts ""
  file.puts "목표: 프로젝트 아키텍처 설계 및 트러블슈팅 기록 관리 (Notion)"
  file.puts ""
  file.puts "## Tech Stack"
  file.puts ""
  file.puts "- **UI & Control:** "
  file.puts "- **Core Vision Logic:** "
  file.puts "- **Documentation:** "
  file.puts ""
  file.puts "## Project Term"
  file.puts "- **진행 방식 (작게 시작하기):** "
  file.puts "- **기록 및 관리:** "
end

puts "New project template created: #{filepath}"