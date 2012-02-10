
require 'rubygems'
require 'bundler/setup'

require 'rack'
require File.join(File.dirname(__FILE__), 'lib', 'sprockets', 'config')
require './app'

map '/assets' do
  run $sprockets_environment
end

map '/' do
  run App::Application.new
end

