document.addEventListener('init', function(event) {

	var loginPage = document.getElementById("login");

	loginPage.addEventListener('init', function(event) {

  		this.querySelector('#cadastro-button').onclick = function() {
    	document.querySelector('#loginNav').pushPage('cadastro.html');
  		};

	});

});