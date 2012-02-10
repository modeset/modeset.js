require 'sprockets'
require 'sprockets-sass'
require 'compass'

require File.join(File.dirname(__FILE__), 'static_compiler')

$sprockets_environment = Sprockets::Environment.new
$sprockets_environment.append_path 'vendor/assets/javascripts'
$sprockets_environment.append_path 'app/assets/javascripts'
$sprockets_environment.append_path 'app/assets/stylesheets'
$sprockets_environment.append_path 'spec/javascripts'
$sprockets_environment.append_path 'vendor/jasmine-1.1.0'