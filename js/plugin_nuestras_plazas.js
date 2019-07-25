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
	
	//var poligono = [];
	var arr = new Array();
	var poligono =[];

	for (var i = lista.length - 1; i >= 0; i--) {
		/*---------COLOR-----------*/
		var a = Math.floor((Math.random() * 255) + 1);
		var b = Math.floor((Math.random() * 255) + 1);
		var c = Math.floor((Math.random() * 255) + 1);
		var color = 'rgb('+a+','+b+','+c+')';
		/*-------FIN COLOR---------*/
		
		arr=[];
		poligono=[];
		var plantilla="<div class='info'><div class='cabecera'><div class='icono'><img src='https://www.cordoba.gob.ar/wp-content/uploads/2019/07/arbol.png'></div><div class='titulo'>NUESTRAS PLAZAS Y PASESO</div></div><hr><div class='nombre'>PLAZA COLÓN</div><div class='foto'><img src='https://gobiernoabierto.cordoba.gob.ar/media/__sized__/imagenes/obras/IMG_7346-thumbnail-500x500-70.JPG'></div><div class='contratista'>JUAN PEREZ</div><a href=''><span>Ver más info</span></a></div>";
		
		for (var a = lista[i].obj.length - 1; a >= 0; a--) {
			arr.push( new google.maps.LatLng(
	                    parseFloat(lista[i].obj[a].lat),
	                    parseFloat(lista[i].obj[a].lng)
	            ));
		}

		console.log(arr);

		poligono.push(new google.maps.Polygon({
            paths: arr,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.35
        }));

		poligono[poligono.length-1].setMap(map);
		//console.log(poligono);
	   // var popup = new google.maps.InfoWindow();

	   /* poligono.addListener('click', function (e) {
		    popup.setContent(plantilla);
		    popup.setPosition(e.latLng);
		    popup.open(map);
		});*/
	}
}	
function filtra()
{
	//marcaespacio(verticesPoligono,"Plaza Colón","Juan Perez","rgb(0,0,0)");
}


