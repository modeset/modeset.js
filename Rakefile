
require File.join(File.dirname(__FILE__), 'lib', 'sprockets', 'config')
require File.join(File.dirname(__FILE__), 'lib', 'markup_compiler')
require File.join(File.dirname(__FILE__), 'lib', 'docs_compiler')

DEBUG = true


# Sprockets Tasks
namespace :assets do
  task :environment do
    @sources = %w(application.css application.js modernizr.js prettify.js)
    @target = File.join(File.dirname(__FILE__), 'public', 'assets')
    @dest_target = File.join(File.dirname(__FILE__), 'build', 'assets')
    @static_compiler = Sprockets::StaticCompiler.new($sprockets_environment, @target, :digest => false)
  end

  desc 'Precompile assets for static deployment'
  task :precompile => :environment do
    @static_compiler.precompile(@sources)
  end

  desc 'Clean compiled assets from the target directory'
  task :clean => :environment do
    @sources.each do |source|
      source += "*"
      FileUtils.rm Dir.glob(File.join(@target, source))
    end
  end

  desc 'Copy the assets from sprockets precompile to the build directory'
  task :copy => :precompile do
    @sources.each do |source|
      puts "copying: #{File.basename(source)}" unless DEBUG == false
      FileUtils.cp File.join(@target, source), File.join(@dest_target, File.basename(source))
    end
  end

  desc 'Clean the compiled sprockets assets from the build directory'
  task :cut => :environment do
    @sources.each do |source|
      source += "*"
      FileUtils.rm Dir.glob(File.join(@dest_target, source))
    end
  end

  desc 'Clean the javascript and css assets out of the build directory and copy the assets generated from sprockets'
  task :build => ['assets:cut', 'assets:copy', 'assets:clean']
end


# Markup Tasks
namespace :markup do
  task :environment do
    @dest_target = File.join(File.dirname(__FILE__), 'build')
    @routes_target = File.join(File.dirname(__FILE__), 'app', 'views')
    @markup_compiler = MarkupCompiler.new(@dest_target, DEBUG)
  end

  desc 'Compile static markup from existing routes in the views directory'
  task :compile => :environment do
    routes = @markup_compiler.find_routes(@routes_target)
    @markup_compiler.curl_and_save(routes, "holiday:bitb0t")
  end

  desc 'Clean compiled markup from the build directory'
  task :clean => :environment do
    Dir["#{@dest_target}/*.html"].each do |html|
      FileUtils.rm html
    end
  end

  desc 'Clean the markup build directory and compile the haml files to static html files'
  task :build => ['markup:clean', 'markup:compile']
end


# Image Tasks
namespace :images do
  task :environment do
    @src_target = File.join(File.dirname(__FILE__), 'public')
    @dest_target = File.join(File.dirname(__FILE__), 'build')
  end

  desc 'Copy over all image assets, cursors, icons'
  task :compile => :environment do
    FileUtils.cp_r File.join(@src_target, 'images'), @dest_target
    FileUtils.cp_r File.join(@src_target, 'cursors'), @dest_target
  end

  desc 'Clean out the image assets from the build directory'
  task :clean => :environment do
    FileUtils.rm_r File.join(@dest_target, 'images')
    FileUtils.rm_r File.join(@dest_target, 'cursors')
  end

  desc 'Clean the images build directory, crush pngs and copy over the new images'
  task :build => ['images:clean', 'images:compile']
end



# Documentation Tasks
namespace :docs do
  task :environment do
    @root_dir = File.join(File.dirname(__FILE__))
    @docs_dir = File.join(File.dirname(__FILE__), 'public', 'docs')
    @coff_src = File.join(File.dirname(__FILE__), 'app', 'assets', 'javascripts')
    @coff_doc = File.join(File.dirname(__FILE__), 'public', 'docs', 'javascripts')
    @docs_compiler = DocsCompiler.new(@template, DEBUG)
  end

  desc 'Generate Rocco Documentation for CoffeeScript Files'
  task :coffeescript => :environment do
    @docs_compiler.generate_rocco(@coff_src, @coff_doc, "coffee")
  end

  desc 'Generate Rocco Documentation for SASS Files'
  task :sass => :environment do
    @docs_compiler.generate_rocco(@sass_src, @sass_doc, "sass", "//")
  end

  desc 'Generate the README to HTML'
  task :readme => :environment do
    input = File.join(@root_dir, 'README.md')
    template = File.join(@docs_dir, 'templates', 'readme.mustache')
    output = File.join(@docs_dir, 'readme.html')
    puts "generating readme" unless DEBUG == false
    @docs_compiler.generate_read_me(input, template, output)
  end

  desc "Generate All Documentation"
  task :all => ["docs:coffeescript", "docs:sass", "docs:readme"]

end

# Wrapper Tasks
namespace :build do
  desc 'Build out all of the static assets for javascript, css, markup and images for deployment'
  task :statics => ['assets:build', 'markup:build', 'images:build', 'data:build']

  desc "Generate All Documentation"
  task :docs => ['docs:all']
end


desc "Generate a Build Release and Documentation"
task :default => ['build:statics', 'build:docs']

