/**
 * 画像をクリックしたときに拡大表示する機能
 */
window.onload = function(){
	
	var modalWrapper = document.getElementById('modal-wrapper');
	var modalImage = document.getElementById('modal-image');
	var images = document.querySelectorAll('.zoom-image');
	
	images.forEach(function(image) {
	     image.onclick = function() {
	          modalWrapper.classList.add('show');
	          modalImage.classList.add('show');
	
	          var imageSrc = image.getAttribute('src');
	          modalImage.src = imageSrc;
	     };
	});
	
	modalWrapper.onclick = function() {
	     if (this.classList.contains('show')) {
	          this.classList.remove('show');
	          modalImage.classList.remove('show');
	     }
	};	

}
