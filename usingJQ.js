$(document).ready(function(){
   $('.faq').on('click', (e) => {
      if(!($('.faq').hasClass('active')))
         $('.faq').addClass('active');
      else 
         $('.faq').removeClass('active');
   });
});