/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function($) {
$(function() {

	$('ul.tabs').each(function() {
		$(this).find('li').each(function(i) {
			$(this).click(function(){
				$(this).addClass('current').siblings().removeClass('current')
					.parents('div.section').find('div.box').eq($(this).index()).fadeIn(150).siblings('div.box').hide();
			});
		});
	});

})
})(jQuery)
