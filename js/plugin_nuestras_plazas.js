
var map;

(function(window, document, $) {
	const $html = $('html,body');
	const $plazas = $('#plazas');
	const $form = $plazas.find('form');
	let $resultados = $plazas.find('#resultados');
	let $gifCarga = $resultados.find('.cargando');
	let $map = $resultados.find('#map');

$form.submit(function(e) {
	console.log("click");
    e.preventDefault();
    //const datos = $form.serializeArray();
    //console.log(datos);
	 $gifCarga.show();
	 $map.hide();
    $.ajax({
      type: "POST",
      dataType: "JSON",
      url: nuestras_plazas.url,
      data: {
        action: 'nuestras_plazas',
        nonce: nuestras_plazas.nonce,
        zona: document.getElementById("zona").value
      },
      success: function(response) {
        if (response.data) {
	        $map.show();
	        $gifCarga.hide();
	        mapaPlazas();
	        marcaespacio(response.data.data);
        }
      }
    });
  });

})(window, document, jQuery);



function mapaPlazas()
{
	map = new google.maps.Map(document.getElementById('map'), {
		  center: { lat: -31.4228241, lng: -64.1688174 },
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      });

	
}

var slideIndex = 1;
//showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  x[slideIndex-1].style.display = "block";  
}

function mostrarfoto(position,lista){
	var	foto="";
	/*lista[position]['foto'].length-1*/
	var x=0;
	var fecha;
	var fechaformateada;
	var cant=lista[position]['foto'].length-1;
	for (var b=0; b<=lista[position]['foto'].length-1 ;b++){
		if(x==0){
			foto+="<div class='mySlides'>";
		}
		console.log(lista[position]['foto'][b].foto);
		if(lista[position]['foto'][b].fecha !== null){
			fecha = lista[position]['foto'][b].fecha.substring(0,10);
			fecha = fecha.split('-');
			fechaformateada = fecha[2]+'-'+fecha[1]+'-'+fecha[0];
		}else{
			fechaformateada='';
		}
		foto += "<div class='content_img'><img src='https://gobiernoabierto.cordoba.gob.ar/"+lista[position]['foto'][b].foto.thumbnail_500+"'><div class='fecha'>"+fechaformateada+"</div></div>";
		if(x==1 || b==cant){
			foto+="</div>";
			x=0;
		}else{
			x+=1;
		}
		
	}
	
	return "<div class='info'><div class='cabecera'><div class='icono'><img src='https://www.cordoba.gob.ar/wp-content/uploads/2019/07/arbol.png'></div><div class='titulo'>NUESTRAS PLAZAS Y PASEOS</div></div><hr><div class='nombre'>"+lista[position]['nombre']+"</div><div class='button-mover'><button class='mover izq' onclick='plusDivs(-1)'>&#10094;</button><button class='mover der' onclick='plusDivs(1)'>&#10095;</button></div><div class='foto' id='content_foto'>"+foto+"</div></div>";
}


function marcaespacio(lista)
{
	
	//console.log(lista);
	var arr = new Array();
	var poligono =[];
		var foto="";
	for (var i = lista.length - 1; i >= 0; i--) {
		/---------COLOR-----------/
		var a = Math.floor((Math.random() * 255) + 1);
		var b = Math.floor((Math.random() * 255) + 1);
		var c = Math.floor((Math.random() * 255) + 1);
		var color = 'rgb('+a+','+b+','+c+')';
		/-------FIN COLOR---------/
		
			//console.log(lista[i]['coordinates'].length);
		
		for (var a = lista[i]['coordinates'].length - 1; a >= 0; a--) {
			arr.push( new google.maps.LatLng(
	                    parseFloat(lista[i]['coordinates'][a].lat),
	                    parseFloat(lista[i]['coordinates'][a].lng)
	            ));
		}
		var bounds = new google.maps.LatLngBounds();

		poligono = new google.maps.Polygon({
            paths: arr,
            map: map,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.35
        });

		for (var pathidx = 0; pathidx < poligono.getPath().getLength(); pathidx++) {
		      bounds.extend(poligono.getPath().getAt(pathidx));
		    }
		poligono.center = bounds.getCenter();	

	    var popup = new google.maps.InfoWindow();
	/*    poligono.addListener('click', function (e) {
		    popup.setContent(plantilla);
		    popup.setPosition(e.latLng);
		    popup.open(map);
		});*/

		poligono.addListener('click', (function(position,lista) {
		  return function() {
		    // set the content
		    popup.setContent(mostrarfoto(position,lista));
		    // set the position
		    popup.setPosition(this.center);
		    // open it
		    popup.open(map);
		    
		  }
		})(i,lista));


		arr=[];
		poligono=[];
	}
		
}

	
function filtra(lista)
{
	//marcaespacio(lista);
}