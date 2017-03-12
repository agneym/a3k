jQuery(document).ready(function($){
	
	var dept = window.location.search.substr(1).split('=')[1];
	var id = null;

	$('h1').addClass('page-load');		

	$('#branchLogo').attr('src', '../../images/dept/'+dept+'.jpg');

	for(i=0; i<events[dept].length; i++) {
		$('#gallery').append('<li class="cd-item" style="background-image: url(images/'+dept+'/'+i+'.jpg)";>\
				<a href="item.html?dept='+dept+'&id='+i+'" data-dept="'+dept+'" data-id="'+i+'">\
					<div>\
						<h2>'+events[dept][i].name+'</h2>\
						<p>'+events[dept][i].description.substr(0,30)+'...</p>\
						<b>View More</b>\
					</div>\
				</a>\
			</li>');
	}

	var gallery = $('.cd-gallery'),
		foldingPanel = $('.cd-folding-panel'),
		mainContent = $('.cd-main');
	/* open folding content */
	gallery.on('click', 'a', function(event){
		event.preventDefault();
		id = $(this).attr('data-id');
		openItemInfo($(this).attr('href'));
	});

	/* close folding content */
	foldingPanel.on('click', '.cd-close', function(event){
		event.preventDefault();
		toggleContent('', false);
	});
	gallery.on('click', function(event){
		/* detect click on .cd-gallery::before when the .cd-folding-panel is open */
		if($(event.target).is('.cd-gallery') && $('.fold-is-open').length > 0 ) toggleContent('', false);
	})

	function openItemInfo(url) {
		var mq = viewportSize();
		if( gallery.offset().top > $(window).scrollTop() && mq != 'mobile') {
			/* if content is visible above the .cd-gallery - scroll before opening the folding panel */
			$('body,html').animate({
				'scrollTop': gallery.offset().top
			}, 100, function(){ 
	           	toggleContent(url, true);
	        }); 
	    } else if( gallery.offset().top + gallery.height() < $(window).scrollTop() + $(window).height()  && mq != 'mobile' ) {
			/* if content is visible below the .cd-gallery - scroll before opening the folding panel */
			$('body,html').animate({
				'scrollTop': gallery.offset().top + gallery.height() - $(window).height()
			}, 100, function(){ 
	           	toggleContent(url, true);
	        });
		} else {
			toggleContent(url, true);
		}
	}

	function toggleContent(url, bool) {
		if( bool ) {
			/* load and show new content */
			var foldingContent = foldingPanel.find('.cd-fold-content');
			foldingContent.load(url+' .cd-fold-content > *', function(event){
				var event = events[dept][id];
				$('.cd-fold-content').html('<h1 class="event-title">'+event.name+'</h1>'+
								'<img src="images/'+dept+'/'+id+'.jpg" alt="'+event.name+'" width="100%">'+
								'<p>'+event.description+'</p>'+
								'<p>'+event.rules+'</p>'+
								'<p>Number of Participants:<strong> '+event.nop+'</strong></p>'+
								'<p>Prizes worth <strong>'+event.prize+'</strong></p>'+
								'<p>Date of Event: <strong>'+event.date+'</strong></p>'+
								'<p>Contact: <strong>'+event.contact+'</strong></p>');
				setTimeout(function(){
					$('body').addClass('overflow-hidden');
					foldingPanel.addClass('is-open');
					mainContent.addClass('fold-is-open');
				}, 100);
				
			});
		} else {
			/* close the folding panel */
			var mq = viewportSize();
			foldingPanel.removeClass('is-open');
			mainContent.removeClass('fold-is-open');
			
			(mq == 'mobile' || $('.no-csstransitions').length > 0 ) 
				/* according to the mq, immediately remove the .overflow-hidden or wait for the end of the animation */
				? $('body').removeClass('overflow-hidden')
				
				: mainContent.find('.cd-item').eq(0).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					$('body').removeClass('overflow-hidden');
					mainContent.find('.cd-item').eq(0).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
				});
		}
		
	}

	function viewportSize() {
		/* retrieve the content value of .cd-main::before to check the actua mq */
		return window.getComputedStyle(document.querySelector('.cd-main'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
	}
});