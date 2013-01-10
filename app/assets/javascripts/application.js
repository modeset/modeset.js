
/* VENDOR ASSETS */
//= require vendor/lib/jquery-1.7.1.min
//= require vendor/lib/dat.gui.min

/* SYSTEM */
//= require modeset/system/cookie

/* DEBUG */
//= require modeset/debug/stats
//= require modeset/debug/debug

/* BASE */
//= require modeset/lib/bindable
//= require modeset/lib/bindable_init

/* ANIM */
//= require modeset/anim/request_animation_frame
//= require modeset/anim/fps_time_factor
//= require modeset/anim/sprite_animation
//= require modeset/anim/transition-callback
//= require modeset/anim/ease_to_value_callback

/* MATH */
//= require modeset/math/math_util
//= require modeset/math/easing_float
//= require modeset/math/elastic_point
//= require modeset/math/displacement_point
//= require modeset/math/random
//= require modeset/math/realtime_sampling_value

/* MEDIA */
//= require modeset/media/image/image_crop
//= require modeset/media/image/image_util
//= require modeset/media/image/canvas_util
//= require modeset/media/audio/sound_player

/* STRING */
//= require modeset/string/formatter
//= require modeset/string/path_util
//= require modeset/string/string_util
//= require modeset/string/validate_util

/* MOUSE */
//= require modeset/mouse/cursor_hand
//= require modeset/mouse/cursor_loading
//= require modeset/mouse/touch_tracker
//= require modeset/mouse/circle_touch_tracker

/* MOBILE */
//= require modeset/mobile/mobile-util
//= require modeset/mobile/accelerometer-util
//= require modeset/mobile/button_touch_callback
//= require_tree ./modeset/gesture/

/* COMPONENTS */
//= require modeset/components/carousel/carousel-base
//= require modeset/components/carousel/carousel-touch
//= require modeset/components/carousel/carousel-touch-infinite
//= require modeset/style/css_helper
//= require modeset/components/scroll/touch_scroller
//= require modeset/components/scroll/touch_scroller_form_focus
//= require modeset/components/logo/mode-set-logo
//= require modeset/form/signature
//= require modeset/form/slider

/* DEMO BINDABLES */
//= require_tree ./demos/



var debug = new Debug();