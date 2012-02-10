# Stub alerts
@window.alerts = []
@window.alert = (msg) -> window.alerts.push(msg)

# Set up Timecop
Timecop.install()

Timecop.MockDate.prototype.toUTCString = ->
  this._underlyingDate.toUTCString.apply(this._underlyingDate, arguments)
