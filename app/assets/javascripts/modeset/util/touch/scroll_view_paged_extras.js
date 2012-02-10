var ScrollViewPagedCanvas = Class.create(ScrollViewPagedHorizontal, {
    
    scroll_pages : false,
    is_scroll_disabled : false,
    resting_callback : false,

	initialize : function( $super, scrollContainer, scrollContentElement, indicator, startIndex, restingCallback ) {
        var index = startIndex || 0;
        this.resting_callback = restingCallback;
        this.setPage(index, true);
		$super( scrollContainer, scrollContentElement, indicator );
		this.scroll_pages = this.scroll_content.select( '.paged_menu_page' );
	},
    runTimer : function( $super ) {
		$super();
		// ease to target if disabled and touching
        if( this.touch_tracker && this.is_scroll_disabled && this.touch_tracker.is_touching ) this.easeToIndex();
	},
	// override scrolling if flags set by other parts of the app
	onStart : function($super, touchEvent) {
		if( !this.is_scroll_disabled ) $super( touchEvent );
		app_events.fireEvent( app_events.MAIN_NAV_SCROLL_DISABLE, null );
	},
	onMove : function($super, touchEvent) {
		if( !this.is_scroll_disabled ) $super( touchEvent );
	},
	onEnd : function($super, touchEvent) {
		if( !this.is_scroll_disabled ) {
		    // let the paged scroller calculate our current page index
		    // disable scrolling until resting  & images activated
		    if( this.touch_lock_direction != this.VERTICAL && Math.abs( this.touch_tracker.touchmoved.x ) > this.decide_threshold ) { 
        		this.is_scroll_disabled = true; 
    	    }
		    else {
		        this.is_scroll_disabled = false;
		    }
		    
		    $super( touchEvent );
		}

		setTimeout( function(){ app_events.fireEvent( app_events.MAIN_NAV_SCROLL_ENABLE, null ); }, 10 ); 
	},
	handleDestination: function ( $super ) {
	    $super();
        this.updateCanvii();
        if(this.resting_callback) {
            this.resting_callback( this.page_index );
        }
	},
	reEnableScrolling: function() {
	    // backup timeout in case of weird state that would break scrolling if you touched it at the right moment
        var self = this;
        setTimeout( function() {
            self.is_scroll_disabled = false;   
        }, 500 );
	},
	activate : function( $super ) {
        $super();
        this.scroll_pages = this.scroll_content.select( '.paged_menu_page' );
        this.updateCanvii();
	},
	deactivate : function( $super ) {
        this.deactivateImages( this.scroll_content );
        $super();
    },
	updateCanvii : function() {
	    // make sure up to 3 pages are activated
        var activated = 0;
        var deactivated = 0;
	    for( var i=0; i < this.scroll_pages.length; i++ ) {
	        if( i == this.page_index || i == this.page_index - 1 || i == this.page_index + 1 ) {
	            this.activateImages( this.scroll_pages[ i ] );
                activated++;
	        } else {
                this.deactivateImages( this.scroll_pages[ i ] );
                deactivated++;
            }
	    }
	    this.imagesActivated();
	},
	activateImages : function( page_container ) {
        var self = this;
        canvas_pool.replaceImagesInContainer( page_container, CanvasPool.IMAGE_SCROLLER, null ); // function() { self.imagesActivated(); }
    },
    imagesActivated : function() {
        var self = this;
        setTimeout( function() {
            self.is_scroll_disabled = false;   
        }, 150 );
    },
    deactivateImages : function( page_container ) {
        canvas_pool.replaceCanvasesInContainer( page_container, CanvasPool.IMAGE_SCROLLER );
    },
	setPageIndex: function ( index, immediately ) {
	    this.setPage( index, immediately );
        this.updateCanvii();
	},
    dispose : function( $super ) {
        this.deactivate();
        $super();
	}
    
});






var ScrollViewPagedCached = Class.create(ScrollViewPagedHorizontal, {
	is_cached : false,
	cache_frame_count : 0,
	initialize : function( $super, scrollContainer, scrollContentElement ) {
		$super( scrollContainer, scrollContentElement );
	},
	stepThroughFrameCaching : function() {
		// ...by scrolling through the entire site, half-a-view at a time, mobile safari caches the view, reducing artifacts as you quickly scroll/swipe through the pages the first time.
		platform_helper.update2DPosition( this.scroll_content, (-this.cache_frame_count * this.container_size.width), 0 );                     

		this.cache_frame_count += 0.5;

		if( this.cache_frame_count >= this.num_pages ){
			this.cachingFinished();
		}
	},
	cachingFinished : function() {
		this.cache_frame_count = -1;
		
		// start off in the correct index position since caching is now done
		this.cur_position.x = this.page_index * -this.container_size.width;
	},
	runTimer : function($super) {
		$super();
		
		// cache entire view into memory - happens after super, which updates view to current scroll position
		if( this.cache_frame_count !== -1 ) {
			this.stepThroughFrameCaching();
		}
	}
});
