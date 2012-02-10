
class MarkupCompiler
  attr_accessor :destination, :debug, :port

  def initialize(destination, debug=false, port="9393")
    @destination = destination
    @debug = debug
    @port = port
  end

  def find_routes(dirname, filetype = "haml")
    routes = []
    Dir["#{dirname}/*.haml"].each do |file|
      routes.push File.basename(file, ".#{filetype}")
    end
    return routes
  end

  def curl_and_save(routes, credentials = nil)
    creds = credentials ? "-u #{credentials}" : ""

    child_pid = fork do
      exec "rackup -p 9393"
    end
    sleep 5

    routes.each do |route|
      output = File.join(@destination, "#{route}.html")
      puts "generating: #{route}.html" unless @debug == false
      system "curl #{creds} -o #{output} localhost:#{@port}/#{route}"
    end
    system "kill -9 #{child_pid}"
  end

end

