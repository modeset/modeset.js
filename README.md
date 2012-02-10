# README


## Mode Set .js library

A repository for reusable codes.

- `app`: Pre-compiled source files for [CoffeeScript](http://jashkenas.github.com/coffee-script/) (JavaScript), [SASS](http://sass-lang.com/) (CSS) and [HAML](http://haml-lang.com/) (HTML)
- `lib`: Ruby scripts for local development
- `public`: Rendered pages for serving the static site
- `app.rb`: The [Sinatra](http://www.sinatrarb.com/) bootstrap file
- `config.ru`: The web server configuration
- `Gemfile`: The listing of Gems used within the application
- `Rakefile`: Executes tasks for compilation

## Developer Notes

    gem install bundler --no-ri --no-rdoc
    bundle
    powder install (only if you don't have pow already installed)
    powder link
    powder open


