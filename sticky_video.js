$(document).ready(function(){

	$.fn.stickyVideo = function() {
		var video = this.get();
		var iframe = $(this);
		iframe.attr("id", "featured-sticky-video");
		var source = $(this).attr("src")
		iframe.wrap('<div class="video-container"></div>');
		iframe.parent('.video-container').append('<div class="close-button"></div>');
		initiateScrollFire();
		// Checks if video is youtube
		if (source.toString().toLowerCase().indexOf("youtube.com") >= 0) {
			if (source.toString().toLowerCase().indexOf("?enablejsapi=1") >= 0) {
				loadYTAPI()
				.then(function(result) {
	                window.onYouTubeIframeAPIReady = function() {
	                    player = new YT.Player( "featured-sticky-video", {
	                       events: {
	                         "onStateChange": onPlayerStateChange
	                       }
	                    } );
	                };
              	})
              	.catch(function(error) {
                  	console.log(error);
              	})
			} else {
				updateYoutubeSource(iframe, source)
		        .then(function(result) {
		            return loadYTAPI();
		        })        
		        .then(function(result) {
		            window.onYouTubeIframeAPIReady = function() {
		                player = new YT.Player( "featured-sticky-video", {
		                   events: {
		                     "onStateChange": onPlayerStateChange
		                   }
		                } );
		            };
		        })
		        .catch(function(error) {
		            console.log(error);
		        }) 
			}
		} else {
			getVimeoInfo(iframe);
		}
	}


	function updateYoutubeSource(iframe, source) {
	return new Promise(function(resolve, reject) {
		source = source + "?enablejsapi=1";
		iframe.attr("src", source);
		
		resolve();

	})

	}
	function loadYTAPI() {
	  	return new Promise(function(resolve, reject) {
	    	var tag = document.createElement('script');
	      	tag.src = "https://www.youtube.com/iframe_api";
	      	var firstScriptTag = document.getElementsByTagName('script')[0];
	      	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	      	resolve(tag);
	      	reject("error");
	  	})
	}

	// youtube api function
	function onPlayerStateChange( event ) {


	 	var isPlay  = 1 === event.data;
	 	var isPause = 2 === event.data;
	 	var isEnd   = 0 === event.data;

	 	if ( isPlay ) {
	    	$('#featured-sticky-video').removeClass( "is-paused" );
	    	$('#featured-sticky-video').toggleClass( "is-playing" );
	    	$('.close-button').toggleClass( "is-playing");
	 	}

	 	if ( isPause ) {
	    	$('#featured-sticky-video').removeClass( "is-playing" );
	    	$('#featured-sticky-video').toggleClass( "is-paused" );
	    	$('.close-button').removeClass( "is-playing");
	 	}

	 	if ( isEnd ) {
	   		$('#featured-sticky-video').removeClass( "is-playing", "is-paused" );
	   		$('.close-button').removeClass( "is-playing");
	 	}
	}

	// Vimeo API Functionality
    function getVimeoInfo(iframe) {
    	var player = new Vimeo.Player(iframe);
        player.on('play', function() {
            iframe.removeClass( "is-paused" );
            iframe.toggleClass( "is-playing" );
            $('.close-button').toggleClass( "is-playing");
        });
        player.on('pause', function() {
            iframe.removeClass( "is-playing" );
            iframe.toggleClass( "is-paused" );
            $('.close-button').removeClass( "is-playing");
        });
        player.on('ended', function() {
            iframe.removeClass( "is-playing" );
            iframe.removeClass( "is-paused" );
            $('.close-button').removeClass( "is-playing");
        });
    }

    function initiateScrollFire() {

    	$('.close-button').click(function() {
	        $('#featured-sticky-video').removeClass('move-right');
	        $('.close-button').removeClass('visible');
	    });

    	$('.video-container').scrollfire({

	        // Offsets
	        offset: 0,
	        topOffset: 0,
	        bottomOffset: 350,

	        // Fires once when element begins to come in from the top
	        onTopIn: function(elm, distance_scrolled ) {
	            $('#featured-sticky-video').removeClass('move-right');
	            $('.close-button').removeClass('visible');
	        },

	        // Fires once when element beings to go out at the top
	        onTopOut: function( elm, distance_scrolled ) {
	            $('#featured-sticky-video').addClass('move-right');
	            $('.close-button').addClass('visible');
	            
	        }

	    });
    }



    function setDimensions() {
	    var videoWidth = $('video-container').width();
	    var videoHeight = $('video-container').height();
	    $('#featured-sticky-video').css("width", videoWidth);
	    $('#featured-sticky-video').css("height",videoHeight);
	}

	function resetDimensions() {
	    var videoWidth = $('.video-container').width();
	    var videoHeight = (videoWidth*(9/16));
	    $('#featured-sticky-video').css("width", videoWidth);
	    $('#featured-sticky-video').css("height",videoHeight);
	}

	setDimensions();
	$(window).resize(resetDimensions);


})