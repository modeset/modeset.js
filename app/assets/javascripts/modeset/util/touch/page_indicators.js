var BasePageIndicator = Class.create({
  num_pages : 0,
	page_index : 0,
	container : 0,
	holder : false,
	active_color : false,
	initialize : function( parent, numPages ) {
	  this.container = parent;
		this.num_pages = numPages;
		
		if( this.num_pages > 1 ) this.build();
		else this.dispose();
	},
	build : function() {
	  alert('override BasePageIndicator.build()');
	},
	setIndex : function( index ) {
	  alert('override BasePageIndicator.setIndex()');
	},
	dispose : function() {
	  this.num_pages = false;
  	this.page_index = false;
  	this.container = false;
  	this.holder = false;
  	this.active_color = false;
  }
});



var NumericPageIndicator = Class.create(BasePageIndicator, {
  
  numbers_holder : false,
  
	initialize : function( $super, parent, numPages, numbersHolder ) {
	  $super( parent, numPages );
	  this.numbers_holder = numbersHolder;
	},

	build : function( $super ) {
    this.setIndex(0);
	},
	
	setIndex : function( $super, index ) {
	  if( index >= 0 ) {
      this.numbers_holder.innerHTML = ( index + 1 ) + ' /' + this.num_pages;
    }
	},

  dispose : function( $super ) {
    $super();
    this.numbers_holder = false;
  }
});






var SimplePageIndicator = Class.create(BasePageIndicator, {
	inactive_color : false,
	y_offset : false,
	dots : false,

	initialize : function( $super, parent, numPages, yOffset, activeColor, inactiveColor ) {
		this.active_color = activeColor;
		this.inactive_color = inactiveColor;
		this.y_offset = yOffset;
	  $super( parent, numPages );
	},

	build : function( $super ) {
    // outer dots container
    this.holder = document.createElement('div');
    this.holder.className = 'page_indicator';
    this.holder.style.position = 'absolute';
    this.holder.style.zIndex = '10';

    // build dots per page
    this.dots = [];
    for(var i = 0; i < this.num_pages; i++) {
      var dot = document.createElement( 'div' );
      dot.style.backgroundColor = '#222277';
      dot.style.width = '6px';
      dot.style.height = '6px';
      dot.style.display = 'block';
      dot.style.cssFloat = 'left';
      dot.style.styleFloat = 'left';
      dot.style.margin = '0px 9px 0px 9px';
      dot.style.borderRadius = '3px';
      dot.style.MozBorderRadius = '3px';
      dot.style.WebkitBorderRadius = '3px';
  
      this.holder.appendChild( dot );
      this.dots.push( dot );
    }

    var indicatorWidth = this.num_pages * 24;
    this.holder.style.width = indicatorWidth + 'px';
    this.holder.style.left = ( this.container.offsetWidth - indicatorWidth ) * .5 + 'px';
    this.holder.style.top = ( this.container.offsetHeight - this.y_offset ) + 'px';
    this.container.appendChild( this.holder );

    this.setIndex(0);
	},
	
	setIndex : function(  $super, index ) {
    for(var i = 0; i < this.dots.length; i++) {
      this.dots[i].style.backgroundColor = ( index == i ) ? "#"+this.active_color : "#"+this.inactive_color;
    }
	},

  dispose : function( $super ) {
    $super();
    if( this.holder ) { 
      this.holder.replace('');
    }
  }
});




var VerticalScrollIndicator = Class.create({
	container : 0,
	container_height : 0,
	content_height : 0,
	scroll_indicator : null,
	scroll_indicator_bar : null,
	scroll_indicator_x : 0,
	scroll_indicator_height : 0,
	scroll_indicator_opacity : 0.5,
	is_showing : false,
	fade : false,

	initialize : function( container, containerWidth, containerHeight, contentHeight ) {
		this.container = container;
		this.container_width = containerWidth;
		this.container_height = containerHeight;
		this.content_height = contentHeight;
		this.build();
		this.resize( this.container_width, this.container_height, this.content_height );
	},

	build : function() {
    // store reused position/dimensions
    this.scroll_indicator_height = ( this.container_height / this.content_height ) * this.container_height;
    this.scroll_indicator_x = this.container_width - 7;
    this.bottom_limit = this.container_height - this.content_height;

    // create div, set size and hide it
    this.scroll_indicator = document.createElement('div');
    this.scroll_indicator.className = 'scroll_indicator';
    this.scroll_indicator.style.width = '5px';
    this.scroll_indicator.style.height = this.container_height + 'px';
    this.scroll_indicator.style.left = '0px';
    this.scroll_indicator.style.top = '0px';
    this.scroll_indicator.style.position = 'absolute';
    this.scroll_indicator.style.overflow = 'hidden';
    this.scroll_indicator.style.zIndex = '10';
    this.scroll_indicator.style.MozBorderRadius = '6px';
    this.scroll_indicator.style.WebkitBorderRadius = '6px';

    this.scroll_indicator_bar = document.createElement('div');
    this.scroll_indicator_bar.className = 'scroll_indicator_bar';
    this.scroll_indicator_bar.style.width = '5px';
    this.scroll_indicator_bar.style.height = this.scroll_indicator_height + 'px';
    this.scroll_indicator_bar.style.left = '0px';
    this.scroll_indicator_bar.style.top = '0px';
    this.scroll_indicator_bar.style.display = 'none';
    this.scroll_indicator_bar.style.position = 'absolute';
    this.scroll_indicator_bar.style.backgroundColor = 'black';
    this.scroll_indicator_bar.style.opacity = '0.5';
    this.scroll_indicator_bar.style.MozBorderRadius = '6px';
    this.scroll_indicator_bar.style.WebkitBorderRadius = '6px';

    // attach to the scroll container div
    this.scroll_indicator.appendChild( this.scroll_indicator_bar );
    this.container.appendChild( this.scroll_indicator );
	},
  resize : function( containerWidth, containerHeight, contentHeight ) {
	  this.container_width = containerWidth;
		this.container_height = containerHeight;
		this.content_height = contentHeight;
		this.bottom_limit = this.container_height - this.content_height;

    this.scroll_indicator_height = ( this.container_height / this.content_height ) * this.container_height;
    if( this.scroll_indicator_height > this.container_height ) this.scroll_indicator_height = this.container_height;
    if( this.scroll_indicator_bar ) this.scroll_indicator_bar.style.height = Math.round( this.scroll_indicator_height ) + 'px';
  },
  update : function( scrollYPosition ) {
    if( this.scroll_indicator && this.scroll_indicator_bar ) {
      platform_helper.update2DPosition( this.scroll_indicator, this.scroll_indicator_x, 0 );
      var verticalDistanceRatio = MathUtil.getPercentWithinRange( 0, this.bottom_limit, scrollYPosition );
      var yPosition = Math.round( verticalDistanceRatio * ( this.container_height - this.scroll_indicator_height ) );
      platform_helper.update2DPosition( this.scroll_indicator_bar, 0, yPosition );

      // force opacity
      if( this.is_showing ) {
        this.scroll_indicator_bar.style.display = 'block';
        this.scroll_indicator_bar.style.opacity = this.scroll_indicator_opacity;
      }
    }

  },
	show : function() {
    if( this.is_showing == false ) {
      if( this.container_height < this.content_height ) {
        this.scroll_indicator_bar.style.display = 'block';
        this.is_showing = true;
        
        // tween opacity or just set it if no tweener
        if( typeof JSTweener !== 'undefined' ) {
          JSTweener.addTween( this.scroll_indicator_bar.style, { time: 0.3, transition: 'linear', opacity: this.scroll_indicator_opacity } );
        } else {
          this.scroll_indicator_bar.style.opacity = this.scroll_indicator_opacity;
        }
      }
    }
	},
	hide : function() {
    if( this.is_showing == true ) {
      this.is_showing = false;

      // tween opacity or just set it if no tweener
      if( typeof JSTweener !== 'undefined' ) {
        JSTweener.addTween( this.scroll_indicator_bar.style, { time: 0.3, transition: 'linear', opacity: 0 } );
      } else {
        this.scroll_indicator_bar.style.opacity = 0;
      }
    }
	},
  dispose : function() {
    // if( this.holder ) this.holder.remove();
  }
});

