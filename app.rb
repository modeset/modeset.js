
require 'sinatra'
require 'haml'
require 'coffee-filter'

module App
  class Application < Sinatra::Base

    set :public_folder,  File.join(File.dirname(__FILE__), 'public')
    set :root,           File.join(File.dirname(__FILE__), 'app')

    # Setup some common copy blocks used in the styleguide
    before do
      @lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    end

    get '/' do
      @page = 'home'
      haml :index, :layout => :"/layouts/layout"
    end

    # get '/specs' do
    #   @page = 'specs'
    #   haml :specs, :layout => false
    # end

    get '/:name' do
      @page = params[:name]
      haml :"/#{@page}", :layout => :"/layouts/layout"
    end

    get '/demos/:name' do
      @page = params[:name]
      haml :"/demos/#{@page}", :layout => :"/layouts/layout"
    end

  end
end

