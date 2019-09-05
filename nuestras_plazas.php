<?php

/*

Plugin Name:Plugin para avance de obra de espacios verdes

Plugin URI: https://github.com/ModernizacionMuniCBA/plugin-wordpress-nuestras_plazas

Description: Este plugin genera una plantilla para incluir en una p&aacute;gina un buscador de espacios verdes y poder visualizar el avance de obra.

Version: 1.5.3

Author: David Hemmerling & Ignacio Perlo 

Author URI: https://github.com/perloignacio/

*/

setlocale(LC_ALL,"es_ES");

date_default_timezone_set('America/Argentina/Cordoba');

add_action('plugins_loaded', array('nuestras_plazas', 'get_instancia'));


class nuestras_plazas

{

	private static $URL_API_GOB = 'https://gobiernoabierto.cordoba.gob.ar/api/v2/espacios-verdes/frentes-espacios-verdes/';
	public $nonce_plazas = '';
	public static $instancia = null;

	public static function get_instancia() {
		if (null == self::$instancia) {
			self::$instancia = new nuestras_plazas();
		} 
		return self::$instancia;
	}

	private function __construct()	
	{
		add_shortcode('nuestras_plazas', array($this, 'render_shortcode_nuestras_plazas'));
		add_action('wp_enqueue_scripts', array($this, 'cargar_assets'));
		add_action('wp_ajax_nuestras_plazas', array($this, 'nuestras_plazas')); 
		add_action('wp_ajax_nopriv_nuestras_plazas', array($this, 'nuestras_plazas'));
		//add_action('init', array($this, 'boton_shortcode_repecticiones'));
	}

	public function cargar_assets()

	{

		$urlCSSShortcode = $this->cargar_url_asset('/css/shortcode_nuestras_plazas.css');
		 wp_register_style('plugin_nuestras_plazas_css', $urlCSSShortcode);
		$urlJSNuestrasPlazas = $this->cargar_url_asset('/js/plugin_nuestras_plazas.js');
		 wp_register_script('carga-plugin-nuestras_plazas', $urlJSNuestrasPlazas,null,false,false);

		 $urlJScarrusel = $this->cargar_url_asset('/js/owl.carousel.min.js');
		 wp_register_script('carga-plugin-carrusel', $urlJScarrusel,null,false,false);
		
		global $post;
	    if( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'nuestras_plazas') ) {
			
			wp_enqueue_style('plugin_nuestras_plazas_css', $urlCSSShortcode);
			wp_enqueue_script('carga-plugin-nuestras_plazas',$urlJSNuestrasPlazas,array('jquery'),'1.0.0',true);
			wp_enqueue_script('carga-plugin-carrusel',$urlJScarrusel,array('jquery'),'1.0.0',true);
			//wp_enqueue_style('buscador_quinteros.css', $this->cargar_url_asset('/css/shortcodeQuinteros.css'));
			$nonce_plazas = wp_create_nonce("nuestras_plazas_nonce");
			wp_localize_script(
				'carga-plugin-nuestras_plazas', 
				'nuestras_plazas', 
				array(
					'url'   => admin_url('admin-ajax.php'),
					'nonce' => $nonce_plazas
				)
			);

		}

	}

	private function cargar_url_asset($ruta_archivo)

	{
		return plugins_url($ruta_archivo, __FILE__);
	}

	public function chequear_respuesta($api_response, $tipoObjeto, $nombre_transient)

	{

		/*if (is_null($api_response)) {
			return [ 'results' => [] ];
		} else if (is_wp_error($api_response)) {
			return [ 'results' => [], 'error' => 'Ocurri&oacute; un error al cargar '.$tipoObjeto.'.'.$mensaje];
		} else {
			$respuesta = json_decode(wp_remote_retrieve_body($api_response), true);
			return $respuesta;
		}*/
	}

	public function cargalistas($url,$lista_zonas,$lista_contratistas)
	{
		$data = file_get_contents($url);
		$resultado = json_decode($data);
		foreach ($resultado->results as $zona) {
			$objzona=['id' => $zona->id, 'nombre'=>$zona->nombre];
			array_push($lista_zonas,(array)$objzona );

			$objorg=array('CUIT' => $zona->CUIT, 'organizacion'=>$zona->organizacion);
			array_push($lista_contratistas, (array)$objorg);
		}
		$listas=["zonas"=>$lista_zonas,"contratistas"=>$lista_contratistas];
		if(!empty($resultado->next))
		{
			return $this->cargalistas($resultado->next,$lista_zonas,$lista_contratistas);
		}else{
			return $listas;
		}
	}

	public function cargamapa($url,$plazas)
	{
		$context = stream_context_create(array(
        'http' => array(
            'timeout' => 1000   // Timeout in seconds
        )
    	));
		$data = file_get_contents($url);
		$resultado = json_decode($data);
		$hoy = date("d-m-y");
		$arrfotos = array();
		$objfoto=['thumbnail_500'=>'/media/imagenes/eventos-publicos/actividades/amocba_7Pv3HG7.jpg'];
		$objadj=['foto'=>$objfoto, 'fecha'=>$hoy];
		array_push($arrfotos,(array)$objadj );
		foreach ($resultado->results->features as $zona) {
			if(!isset($zona->properties->nombre)){
				$foto = $zona->properties->adjuntos;
				
				$calendar=$this->getcalendar($zona->properties->fechas_de_trabajos);

				$objzona=['id'=> $zona->id, 'nombre' => $zona->properties->descripcion_frente, 'foto'=> $arrfotos,'calendarios'=>$calendar, 'coordinates'=> $zona->geometry->coordinates,'tipo'=>'plaza'];
			}else{
				if ($zona->geometry->coordinates[0]){
					$calendar=array();
					$objzona=['id'=> $zona->id, 'nombre' => $zona->properties->nombre, 'foto'=>$arrfotos,'calendarios'=>$calendar, 'coordinates'=> $this->formatcoordenadas($zona->geometry->coordinates[0]),'tipo'=>'cpc'];
				}
			}	
			array_push($plazas,(array)$objzona );
		}
		//$listas=["zonas"=>$lista_zonas,"contratistas"=>$lista_contratistas];
		if(!empty($resultado->next))
		{
			return $this->cargamapa($resultado->next,$plazas);
		}else{
			//var_dump($plazas);
			return $plazas;
		}
	}
	public function formatcoordenadas($cord){
		$listaobj =array();
		$vertices = array();
		for ($i=0;$i<=count($cord)-1;$i++) {
			$listadatos = new stdClass();
			$listadatos->lng=floatval(str_replace(',', '.', $cord[$i][0]));
			$listadatos->lat=floatval(str_replace(',', '.', $cord[$i][1]));
			array_push($vertices,$listadatos);
		}
		return $vertices; 
	}
/*	public function coordenadas($dibuja){
		$listaobj =array();
		for ($i=0; $i <= count($dibuja)-1; $i++) { 
		$vertices = array();
			foreach ($dibuja[$i]['coordinates'] as $coord) {
				$listadatos = new stdClass();
				$listadatos->lng= floatval(str_replace(',', '.', $coord[0]));
				$listadatos->lat= floatval(str_replace(',', '.', $coord[1]));
				array_push($vertices,$listadatos);
			}
			$obj = new stdClass();
			$obj->obj=$vertices;
			array_push($listaobj,$obj);
			
		}
		return $dibuja;
	}*/

	public function render_shortcode_nuestras_plazas($atributos = [], $content = null, $tag = '')
	{
		
		$atributos = array_change_key_case((array)$atributos, CASE_LOWER);
	    $atr=shortcode_atts([],$atributos, $tag);
	    $lista_zonas=array();
		$lista_contratistas=array();
		$plazas=array();
		$datos=$this->cargalistas("https://gobiernoabierto.cordoba.gob.ar/api/v2/espacios-verdes/espacios-verdes/",$lista_zonas,$lista_contratistas);
		
		$sc="";

		$sc.='
		<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdhknpOExGWhcYbEXKLfnPHqND4ejjqpE" type="text/javascript"></script>
		<script src="'. plugin_dir_url( __FILE__ ). 'js/plugin_nuestras_plazas.js"></script>
		<div id="plazas">
		<div id="buscador">
			<form>
				<div class="campo">
					<select id="zona" name="zona" onchange="">
						<option value="">Seleccione su zona</option>';
						foreach($datos['zonas'] as $zona)
						{
							$sc.="<option value='".$zona['id']."'>".$zona['nombre']."</option>";
						}
			  $sc.='</select>
				</div>
				
			<div class="campo">
				<button id="filtros__buscar" type="submit">Buscar</button>
				</div>	</form>
			</div>';

				$dibuja =$this->cargamapa("https://gobiernoabierto.cordoba.gob.ar/api/v2/cpc/cpc-geo",$plazas);
				/*//var_dump($dibuja);
				foreach($datos['zonas'] as $zona){
					
				$points=$this->cargamapa("https://gobiernoabierto.cordoba.gob.ar/api/v2/espacios-verdes/frentes-espacios-verdes/?id_zona=".$zona['id'],$plazas);
				foreach($points as $pl)
				{
					array_push($dibuja, $pl);
				}

				//$coordenadas=$this->coordenadas($dibuja);
				}*/
			$sc .= $this->renderizar_resultados($dibuja);
			return $sc;
	}
	
	public function actualizar($url)
	{
		$plazas=array();
		$dibuja =$this->cargamapa($url,$plazas);
		return $dibuja;
	}
	
	public function renderizar_resultados($datos){
			$html.='
			<div id="resultados">
				<div class="cargando" style="display:none;">
					<img alt="Cargando..." src="'.plugins_url('images/loading.gif', __FILE__).'">
				</div>
				<div id="map"></div>
			</div>
			';
			$html.='
			<script>
			var lista = '.json_encode($datos).';
			var plugindir="'.plugin_dir_url( __FILE__ ).'";
			mapaPlazas();
			marcaespacio(lista);

		
			</script></div>';
			return $html;

	}
//Gob. Abierto Key
//AIzaSyAYw1rqa9mL1-__v8h2CVgsRJmpmP2mP1s

	
	public function nuestras_plazas()
	{
		$zona='';
		if($_REQUEST['zona']){
			$zona.= $_REQUEST['zona'];
		}
		check_ajax_referer('nuestras_plazas_nonce', 'nonce');

		if(true) {
			//$api_response = wp_remote_get(self::$URL_API_GOB.'?id_zona='.$zona, [ 'timeout' => 1000 ]);
			//$api_data = json_decode(wp_remote_retrieve_body($api_response), true);
			//var_dump($api_data);
			$datos=$this->actualizar(self::$URL_API_GOB.'?id_zona='.$zona);

			$response = array( 'success' => true, 'data' => $datos ); // if $data passed
			wp_send_json_success($response);
		} else {
			wp_send_json_error($api_data);
		}
		die();
	}

	/*public function boton_shortcode_repecticiones() {
		if (!current_user_can('edit_posts') && !current_user_can('edit_pages') && get_user_option('rich_editing') == 'true')
			return;
		add_filter("mce_external_plugins", array($this, "registrar_tinymce_plugin")); 
		add_filter('mce_buttons', array($this, 'agregar_boton_tinymce_shortcode_repeticiones'));
	}

	public function registrar_tinymce_plugin($plugin_array) {
		$plugin_array['repeticiones_button'] = $this->cargar_url_asset('/js/shortcode_repeticiones.js');
	    return $plugin_array;
	}

	public function agregar_boton_tinymce_shortcode_repeticiones($buttons) {
	    $buttons[] = "repeticiones_button";
	    return $buttons;
	}
	*/
	


	public function marcadia($lista_fechas,$dia,$mes)
	{
		for($x=0;$x<=count($lista_fechas)-1;$x++)
			{

				
				
			}

	}

	public function draw_calendar($month,$year,$fechas){

	/* draw table */
	$calendar = '<table cellpadding="0" cellspacing="0" class="calendar">';

	/* table headings */
	$headings = array('D','L','M','M','J','V','S');
	$calendar.= '<tr class="calendar-row"><td class="calendar-day-head">'.implode('</td><td class="calendar-day-head">',$headings).'</td></tr>';

	/* days and weeks vars now ... */
	$running_day = date('w',mktime(0,0,0,$month,1,$year));
	$days_in_month = date('t',mktime(0,0,0,$month,1,$year));
	$days_in_this_week = 1;
	$day_counter = 0;
	$dates_array = array();

	/* row for week one */
	$calendar.= '<tr class="calendar-row">';

	/* print "blank" days until the first of the current week */
	for($x = 0; $x < $running_day; $x++):
		$calendar.= '<td class="calendar-day-np"> </td>';
		$days_in_this_week++;
	endfor;

	/* keep going with days.... */
	for($list_day = 1; $list_day <= $days_in_month; $list_day++):
		$calendar.= '<td class="calendar-day">';
			/* add in the day number */
			//$band=existe($fechas,$list_day,$month);
			//var_dump($band);
			
			
			/*if(is_array($band)){
				//echo "entro";
				$link="javascript:abrir('".$band["idcurso"]."','".$band["color"]."')";
				$calendar.= '<div class="day-number"><a href="'.$link.'" class="color_'.$band["color"].'"><span>'.$list_day.'</span></a></div>';	
			}else{
				$calendar.= '<div class="day-number">'.$list_day.'</div>';
			}
			*/
			$calendar.= '<div class="day-number">'.$list_day.'</div>';

			/** QUERY THE DATABASE FOR AN ENTRY FOR THIS DAY !!  IF MATCHES FOUND, PRINT THEM !! **/
			$calendar.= str_repeat('<p> </p>',2);
			
		$calendar.= '</td>';
		if($running_day == 6):
			$calendar.= '</tr>';
			if(($day_counter+1) != $days_in_month):
				$calendar.= '<tr class="calendar-row">';
			endif;
			$running_day = -1;
			$days_in_this_week = 0;
		endif;
		$days_in_this_week++; $running_day++; $day_counter++;
	endfor;

	/* finish the rest of the days in the week */
	if($days_in_this_week < 8):
		for($x = 1; $x <= (8 - $days_in_this_week); $x++):
			$calendar.= '<td class="calendar-day-np"> </td>';
		endfor;
	endif;

	/* final row */
	$calendar.= '</tr>';

	/* end the table */
	$calendar.= '</table>';
	
	/* all done, return result */
	return $calendar;
}

public function getcalendar($fechas)
{
	
	$objmeses=array();
	for ($i=0; $i<=count($fechas)-1 ; $i++) { 
		$fec=explode("-",$fechas[$i]->fecha);
		$anio=$fec[0];
		$mes=$fec[1];
		$aux=array($anio,$mes);
		if(!in_array($aux,$objmeses))
		{
			array_push($objmeses, $aux);
		}
	}
	//echo var_dump($objmeses);
	$calendar=array();
	for ($i=0; $i<=count($objmeses)-1 ; $i++) { 
		$html= array("anio"=> $objmeses[$i][0], "mes"=> $objmeses[$i][1], "calendar"=> $this->draw_calendar($objmeses[$i][1],$objmeses[$i][0],$fechas));
		array_push($calendar,$html);
	}
	return $calendar;
}


	

	

	

}