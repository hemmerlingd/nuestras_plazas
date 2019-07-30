(function(window, document, $) {
const $plazas = $('#plazas');
const $form = $plazas.find('form');
let $resultados = $plazas.find('.resultados');

$form.submit(function(e) {
    e.preventDefault();
    const datos = $form.serializeArray();
    //console.log(datos);
    $.ajax({
      type: "POST",
      dataType: "JSON",
      url: nuestras_plazas.url,
      data: {
        action: 'nuestras_plazas',
        nonce: nuestras_plazas.nonce,
        zona: datos[0].value
      },
      success: function(response) {
        if (response.data) {
        	//console.log(response.data);
          $resultados.html(response.data);
        }
      }
    });
  });

})(window, document, jQuery);

var map;


function mapaPlazas()
{
	map = new google.maps.Map(document.getElementById('map'), {
		  center: { lat: -31.4228241, lng: -64.1688174 },
          zoom: 12,

          mapTypeId: google.maps.MapTypeId.ROADMAP
      });

	
}
	


function marcaespacio(lista,nombre,contratista,color)
{
	
<<<<<<< Updated upstream
	//console.log(lista);
	var arr = new Array();
	var poligono =[];
	for (var i = lista.length - 1; i >= 0; i--) {
=======
	//var poligono = [];
	
	var poligono =[];
	console.log(lista);
	for (i=0;i<=lista.length-1;i++) {
>>>>>>> Stashed changes
		/*---------COLOR-----------*/
		var a = Math.floor((Math.random() * 255) + 1);
		var b = Math.floor((Math.random() * 255) + 1);
		var c = Math.floor((Math.random() * 255) + 1);
		var color = 'rgb('+a+','+b+','+c+')';
		/*-------FIN COLOR---------*/
		
<<<<<<< Updated upstream
		var plantilla="<div class='info'><div class='cabecera'><div class='icono'><img src='https://www.cordoba.gob.ar/wp-content/uploads/2019/07/arbol.png'></div><div class='titulo'>NUESTRAS PLAZAS Y PASESO</div></div><hr><div class='nombre'>PLAZA COLÓN</div><div class='foto'><img src='https://gobiernoabierto.cordoba.gob.ar/media/__sized__/imagenes/obras/IMG_7346-thumbnail-500x500-70.JPG'></div><div class='contratista'>JUAN PEREZ</div><a href=''><span>Ver más info</span></a></div>";
		
		
		for (var a = lista[i].obj.length - 1; a >= 0; a--) {
=======
		
		var plantilla="<div class='info'><div class='cabecera'><div class='icono'><img src='https://www.cordoba.gob.ar/wp-content/uploads/2019/07/arbol.png'></div><div class='titulo'>NUESTRAS PLAZAS Y PASESO</div></div><hr><div class='nombre'>PLAZA COLÓN</div><div class='foto'><img src='https://gobiernoabierto.cordoba.gob.ar/media/__sized__/imagenes/obras/IMG_7346-thumbnail-500x500-70.JPG'></div><div class='contratista'>JUAN PEREZ</div><a href=''><span>Ver más info</span></a></div>";
		var arr = new Array();
		//if(i==0){ar=0;}else{ar=lista[i-1].obj.length+1;}
		for (a=0;a<=lista[i].obj.length-1;a++) {
>>>>>>> Stashed changes
			arr.push( new google.maps.LatLng(
	                    parseFloat(lista[i].obj[a].lat),
	                    parseFloat(lista[i].obj[a].lng)
	            ));
		}
<<<<<<< Updated upstream
		poligono.push(new google.maps.Polygon({
            paths: arr,
=======
		arr.push(new google.maps.LatLng(
                    parseFloat(lista[i].obj[0].lat),
                    parseFloat(lista[i].obj[0].lng)
		));

		console.log(arr);

		poli=new google.maps.Polyline({
            path: arr,
>>>>>>> Stashed changes
            strokeColor: color,
            strokeOpacity: 0.8,
            fillColor:color,
            strokeWeight: 2,
            geodesic: true,
            fillOpacity: 0.35
<<<<<<< Updated upstream
        }));
		//console.log(lista[i].obj);
		poligono[poligono.length-1].setMap(map);

	    var popup = new google.maps.InfoWindow();
	   /* poligono.addListener('click', function (e) {
		    popup.setContent(plantilla);
		    popup.setPosition(e.latLng);
		    popup.open(map);
		});*/


		arr=[];
		poligono=[];
=======
   		})

		//poligono.push();
		poli.setMap(map);
		

		
	}
	
	//dibuja(poligono);
}

function dibuja(poligonos)
{
	for (var i = poligonos.length - 1; i >= 0; i--) {
		
>>>>>>> Stashed changes
	}
		
}	
function filtra(lista)
{
	marcaespacio(lista,"Plaza Colón","Juan Perez","rgb(0,0,0)");
}

