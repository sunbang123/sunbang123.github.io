# frozen_string_literal: true

require "rexml/document"
require "rexml/xpath"

Jekyll::Hooks.register :site, :post_write do |site|
  xml_path = File.join(site.dest, "sitemap.xml")
  text_path = File.join(site.dest, "sitemap.txt")

  unless File.file?(xml_path)
    raise Jekyll::Errors::FatalException,
          "sitemap.xml was not generated; sitemap.txt cannot be created"
  end

  document = REXML::Document.new(File.read(xml_path, encoding: "UTF-8"))
  urls = REXML::XPath
    .match(document, "//*[local-name()='loc']")
    .map { |node| node.text.to_s.strip }
    .reject(&:empty?)

  if urls.empty?
    raise Jekyll::Errors::FatalException, "sitemap.xml contains no URLs"
  end

  if urls.uniq.length != urls.length
    raise Jekyll::Errors::FatalException, "sitemap.xml contains duplicate URLs"
  end

  File.binwrite(text_path, "#{urls.join("\n")}\n".encode("UTF-8"))
  Jekyll.logger.info "Sitemap TXT:", "generated #{urls.length} URLs"
end
