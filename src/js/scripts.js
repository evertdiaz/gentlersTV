$(function() {
	// NOTA: AGREGAR UN BOTON MAS QUE SEA REGRESAR AL INICIO,
	// BORRANDO TODA LA BUSQUEDA Y VOLVIENDO A PINTAR LO DE INICIO

	/**
	* Submit Search-form
	*/
	var template = `<article class="tv-show">
            <div class="left img-container"><img src=":img:" alt=":img alt:"/></div>
            <div class="right info">
              <h1>:name:</h1>
              <p>:summary:</p>
              <button class="like"> Like </button>

            </div>
          </article>`
    var $showsContainer = $('#app-body').find('.tv-shows')

    function renderShows(shows){
    	$showsContainer.find('.loader').remove()
    	shows.forEach(function(show){
			var article = template
				.replace(':name:', show.name)
				.replace(':img:', show.image.medium)
				.replace(':img alt:', show.name+ " Logo")
				.replace(':summary:', show.summary)
			// Metemos el template string en una nueva variable, convirtiendola
			// en jQuery object con el $()
			var $article = $(article) 
			// Se ocultan para luego animarlos al mostrar
			$article.hide()

			$showsContainer
				.append($article.fadeIn('slow')) //slow,fast,etc o numeros en ms
		})
    }
	$('#app-body')
		.find('form')
		.submit(function(ev){
			ev.preventDefault()
			$('#app-body').find('.tv-show').remove()
			var $loader = $('<div class="loader">Cargando...</div>')
			$loader.appendTo($showsContainer)
			$showsContainer.find('.loader').show()
			var bus = $(this)
				.find('input[type="text"]')
				.val()
			$.ajax({
				url: 'http://api.tvmaze.com/search/shows?q=:query',
				data: { q: bus },
				success: function(res, textStatus, xhr){
					
					var shows = res.map(el =>{
						return el.show
					})
					renderShows(shows)
				}
			})
		})

	// PROMISES
	if(!localStorage.shows){
		$.ajax('http://api.tvmaze.com/shows')
			.then(shows => {
				$showsContainer.find('.loader').remove()
				// Pasar de JSON a String (stringify)
				localStorage.shows = JSON.stringify(shows)
				renderShows(shows)
			})
	} else {
		// Sacar del local y parsearlo a JSON para renderizar con funcion
		renderShows(JSON.parse(localStorage.shows))

	}
	// Se hace event bubbling, manda el evento a todos hasta qye uno lo atrape
	var cl = 0
	$showsContainer.on('click', 'button.like' , function(ev){
		// Manejo de click y click again usando condicionales
		// Probablemente haya una funcion ej jQuery para esto.
		if(cl==0){
			var $likedBtn = $(this)
			$likedBtn.animate({
				'fontSize': '40px'
			}, 'fast') //Parametros: efecto(estils) y tiempo.
		}
		else{
			var $likedBtn = $(this)
			$likedBtn.animate({
				'fontSize': '20px'
			}, 'fast') //Parametros: efecto(estils) y tiempo.	
		}

		if(cl==0) cl = 1 
			else
				cl = 0
		//Codigo para modificar estilo del div del show al hacer click
		//NO FUNCIONA -> AVERIGUAR, QUIZA INCOMPATIBILIDAD DE JQUERY
		//QUIZAS HAY UN PROBLEMA CON EL CSS
		// var $tvshow = $(this).closest('.tv-show')
		// $tvshow.toggleClass('liked')
		// console.log($tvshow)
	})
		

})
