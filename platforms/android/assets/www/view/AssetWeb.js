	$(document).ready(function(){
		//subcategory show
		$("#category li").click(function() {
           $(this).find(".child").slideToggle();
		   if($(this).hasClass('selected')){
				   $(this).removeClass('selected');   
		   } else {
			   $(this).addClass('selected');
		   }
		});
		//category click
		$(".slide_menu li a").click(function() {
			$("#category").hide();
			$("#tag").hide();
			$(".slide_menu li").removeClass("active");
			var selectedTab = $(this).attr('href');
			$(this).parent().addClass("active");
			$(selectedTab).show();
			if (($(selectedTab).attr('id')) == 'categorys') {
				$('#tag').hide();
				$('#categorys').show();
			}
			return false;
		});
		
			//overlay hide and show
			$("ul.asset-list li .overlay").hide();
			
	        $("ul.asset-list li").click(function(e){
	            $("ul.asset-list li .overlay").show();
	        });
	        
	       // handle the mouseenter functionality
	       $("ul.asset-list li").mouseenter(function(){
	            $("ul.asset-list li .overlay").show();
	        }).mouseleave(function(){
	            $("ul.asset-list li .overlay").hide();
	        });
	        
	});