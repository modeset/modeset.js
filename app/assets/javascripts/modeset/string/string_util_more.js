// From HTML5 Boilerplate
window.log = function() {
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if (this.console) {
    console.log(Array.prototype.slice.call(arguments));
  }
};

String.prototype.truncateTo = function(length) {
  var str = "";
  if (this.length > length) {
    str = this.substring(0, length) + "&hellip;";
  } else {
    str = this;
  }
  return str;
};

$.fn.collapsify = function(length, expand_text, collapse_text) {
  var $base = this;
  for (var i = 0; i < this.length; i++) {
    var $container = $(this[i]),
        container_selector = $container.selector,
        string = $(this[i]).text(),
        html = "",
        expand_text = (expand_text) ? expand_text : "more info",
        collapse_text = (collapse_text) ? collapse_text : "less info";

    if (length > $container.text().length) {
      html = string;
    } else {
      var $read_more_link = $('<a href="#read_more" class="read_more_link text_collapsed">' + expand_text + '</a>');
      var $truncated_copy = $('<span class="truncated_copy">' + string.truncateTo(length) + '</span>');
      var $entire_copy = $('<span class="entire_copy" style="display: none;">' + string + '</span>');

      html = $truncated_copy.add($entire_copy).add($read_more_link);

      $container.delegate('a.read_more_link', 'click', function(e, container_selector) {
        var $parent = $(e.target).parents(container_selector).first();
        var $link = $(this);
        if ($link.hasClass('text_collapsed')) {
          $link.removeClass('text_collapsed');
          $link.text(collapse_text);
          $parent.find('.truncated_copy').hide();
          $parent.find('.entire_copy').show();
        } else {
          $link.addClass('text_collapsed');
          $link.text(expand_text);
          $parent.find('.truncated_copy').show();
          $parent.find('.entire_copy').hide();
        }
        e.preventDefault();

      });
    }

    $container.html(html);
  }
  return $base;

}

String.prototype.parameterize = function() {
  return this.toLowerCase().replace(/ /g, '-').replace(/\./g, '_');
};

String.prototype.underscore = function() {
  return this.toLowerCase().replace(/ /g, '_').replace(/-/g, '_');
};

String.prototype.makeSafe = function() {
  return this.replace(/"/, '_')
};

(function($) {
  $.extend({
    getUrlVars: function() {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1] ? hash[1].split('#')[0] : null;
      }
      return vars;
    },
    getUrlVar: function(name) {
      return $.getUrlVars()[name];
    }
  });
})(jQuery);