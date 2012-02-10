
require 'redcarpet'
require 'mustache'

class DocsCompiler
  attr_accessor :template, :debug

  def initialize(template, debug=false)
    @template = template
  end

  def generate_read_me(input, template, output)
    readme_md = File.read(input)
    templ_stache = File.read(template)
    content = Markdown.new(readme_md, :smart).to_html
    html = Mustache.render(templ_stache, :content => content)
    File.open(output, "w") do |file|
      file.write(html)
    end
  end

  # TODO: Should be able to generate both js and cs files in the same setting
  def generate_rocco(src_dir, doc_dir, filetype, comment_character=nil)
    cc = comment_character ? "-c #{comment_character}" : ""
    remove_files_by_type(doc_dir, "html")
    copy_source_for_docs(src_dir, doc_dir, filetype)
    generate_landing_page(doc_dir, filetype, comment_character)
    system "rocco -t #{@template} #{cc} #{doc_dir}/*.#{filetype}"
    remove_files_by_type(doc_dir, filetype)
  end

  def copy_source_for_docs(src_dir, doc_dir, filetype)
    Dir.glob("#{src_dir}/**/*.#{filetype}").each do |file|
      FileUtils.cp file, File.join(doc_dir, File.basename(file))
    end
  end

  def remove_files_by_type(dir, filetype)
    Dir.glob("#{dir}/*.#{filetype}").each do |file|
      FileUtils.rm file
    end
  end

  def generate_landing_page(dir, filetype, comment_character)
    str = "#{comment_character} ### File Documentation for .#{filetype} files\n\n"

    Dir.glob("#{dir}/*.#{filetype}").each do |file|
      base = File.basename(file, ".#{filetype}")
      str << "#{comment_character} * [#{base}](#{base}.html)\n"
    end

    File.open(File.join(dir, "#{filetype}.#{filetype}"), "w") do |file|
      file.write(str)
    end
  end

end

