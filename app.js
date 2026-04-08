/* ============================================================
   CBS Evaluador — app.js
   Logica principal de la aplicacion
   StorageService (services/storage.service.js) es la unica
   interfaz de almacenamiento remoto — nunca llamar Firebase aqui
   ============================================================ */

/* ========== DATOS DE ESFERAS ========== */
var SP=[
{id:'det',name:'Detritosfera',icon:'fa-leaf',color:'#8d7340',
def:'Masa de restos vegetales y animales en la capa superficial con alta actividad de hongos y meso/macro fauna. Principal fuente de materia organica del suelo.',
proc:['Coloca dos varas de 40 cm perpendiculares sobre el suelo.','Toma fotografia enmarcada en las varas.','Registra la profundidad de la capa de detritus.','Remueve restos superficiales con las manos.','Siente la humedad y percibe los olores (olor a tierra = hongos + hojas + suelo).'],
ayudas:'Observa cubrimiento, origen, estado de descomposicion y espesor. Los materiales pueden estar sueltos o cohesionados por hifas de hongos.',
checks:[
{t:'Cubrimiento del suelo >80%',w:3},{t:'Diversidad de materiales (hojas, rastrojos, restos de poda)',w:2},{t:'Materiales cohesionados por hifas de hongos',w:3},{t:'Capa de detritus >3 cm de espesor',w:2},{t:'Olor a tierra pronunciado y agradable',w:2},{t:'Cubrimiento parcial 30-60%',w:1,l:2},{t:'Restos sueltos sin cohesion',w:1,l:1},{t:'Suelo mineral expuesto sin cubierta',w:3,l:1},{t:'Sin olor a tierra perceptible',w:2,l:1}
],
lvls:{1:{n:'Pobre',c:'#c44b3f',d:'Suelo expuesto sin cubierta organica. Sin restos vegetales. Sin horizonte organico. Sin olor a tierra.'},2:{n:'Regular',c:'#d4a853',d:'Cubrimiento parcial (30-60%). Restos sueltos sin cohesion. Capa delgada (<1 cm). Olor debil.'},3:{n:'Buena',c:'#5a8a4a',d:'Cubrimiento completo (>80%). Materiales diversos cohesionados por hifas. Capa >3 cm. Olor pronunciado.'}}
},
{id:'agr',name:'Agregatosfera',icon:'fa-cubes',color:'#a68b5c',
def:'Espacios de la agrupacion jerarquica de componentes organicos y minerales que forman micro y macro agregados. Manifestacion fisica de la vida del suelo.',
proc:['Extrae un cubo de 20x20x20 cm con pala forestal.','Levanta a ~1 m y dejalo caer en la caja con tabla.','Bloques que no se rompan, sueltalos 1-2 veces mas.','En terrones con fracturas, aplica presion ligera.','Transfiere al saco ordenando de mayor a menor.','Toma foto con varas de 70 y 40 cm como referencia.'],
ayudas:'Observa proporcion, tamanos y formas de agregados (redondeados vs angulares). Siente la friabilidad (se desmenuza con ligera presion) vs firmeza (fuerte presion).',
checks:[
{t:'Predominio de agregados pequenos (<2 cm)',w:3},{t:'Agregados redondeados (migajon-granular)',w:3},{t:'Alta friabilidad: se desmenuzan con ligera presion',w:3},{t:'Buena proporcion de distintos tamanos',w:2},{t:'Mezcla de terrones medianos y pequenos',w:1,l:2},{t:'Friabilidad moderada (presion media)',w:1,l:2},{t:'Predominio de bloques >10 cm compactos',w:3,l:1},{t:'Agregados angulares/duros (fuerte presion)',w:3,l:1}
],
lvls:{1:{n:'Pobre',c:'#c44b3f',d:'Bloques grandes >10 cm compactos y angulares. Requieren fuerte presion. Sin friabilidad.'},2:{n:'Regular',c:'#d4a853',d:'Mezcla de terrones medianos y pequenos. Algo de friabilidad. Proporcion variable.'},3:{n:'Buena',c:'#5a8a4a',d:'Predominio de agregados <2 cm redondeados. Alta friabilidad. Estructura migajon-granular.'}}
},
{id:'dri',name:'Drilosfera',icon:'fa-worm',color:'#745d30',
def:'Volumen de suelo bajo influencia de lombrices: galerias, tractos intestinales y heces ricas en nutrientes. Principal componente de bioturbacion.',
proc:['Usa el volumen de suelo del saco de Agregatosfera.','Busqueda minuciosa manual de lombrices adultas y juveniles.','Coloca lombrices en la caja para conteo.','Registra numero total y caracteristicas.','Toma foto del conjunto con la mano como fondo.','Busca turriculos en superficie y tuneles en el perfil.'],
ayudas:'Busca turriculos (cumulos de estiercol oscuros y globulares) en superficie. Busca galerias/tuneles con paredes oscuras en el perfil. Observa tamano, pigmentacion, clitelo (anillo = adulto).',
checks:[
{t:'Mas de 8 lombrices en cubo 20 cm (>200/m2)',w:4},{t:'Lombrices adultas y juveniles de distintos tamanos',w:2},{t:'Tuneles abundantes visibles en el perfil',w:2},{t:'Turriculos (estiercol) abundantes en superficie',w:2},{t:'3-7 lombrices (50-100/m2)',w:2,l:2},{t:'Algunos tuneles dispersos',w:1,l:2},{t:'0-2 lombrices (<50/m2)',w:3,l:1},{t:'Sin tuneles ni turriculos visibles',w:3,l:1}
],
lvls:{1:{n:'Pobre',c:'#c44b3f',d:'0-2 lombrices (<50/m2). Sin tuneles ni turriculos. Sin bioturbacion perceptible.'},2:{n:'Regular',c:'#d4a853',d:'3-7 lombrices (50-100/m2). Algunos tuneles y turriculos. Bioturbacion incipiente.'},3:{n:'Buena',c:'#5a8a4a',d:'Mas de 8 lombrices (>200/m2). Abundantes tuneles y turriculos. Alta bioturbacion.'}}
},
{id:'riz',name:'Rizosfera',icon:'fa-seedling',color:'#5a8a4a',
def:'Zona de influencia en torno a las raices con exudados energeticos. Principal fuerza conductora para los procesos ecosistemicos bajo la superficie.',
proc:['Despeja una pared del perfil con la paleta.','Busca raices hasta 20 cm de profundidad.','Coloca vara de 20 cm a un lado.','Toma foto de la pared limpia con raices.','Observa distribucion, abundancia, diametro y entramado.'],
ayudas:'Observa distribucion: superficiales, horizontal homogenea, gradual vertical o heterogenea. Nota composicion (solo cultivo vs otras especies), abundancia, largo, diametro, color y olor.',
checks:[
{t:'Raices abundantes en todo el perfil hasta 20 cm',w:3},{t:'Entremado denso y diverso',w:3},{t:'Raices de multiples especies con distintos grosores',w:2},{t:'Buen diametro y color sano',w:1},{t:'Raices en parte del perfil (0-15 cm)',w:1,l:2},{t:'Algo de entramado visible',w:1,l:2},{t:'Raices escasas solo en superficie',w:3,l:1},{t:'Diametro fino, color palido, sin entramado',w:2,l:1}
],
lvls:{1:{n:'Pobre',c:'#c44b3f',d:'Escasas raices superficiales. Diametro fino, palido. Sin entramado. Poca diversidad.'},2:{n:'Regular',c:'#d4a853',d:'Raices en parte del perfil (0-15 cm). Diametro medio. Algo de entramado. Mas de una especie.'},3:{n:'Buena',c:'#5a8a4a',d:'Abundantes en todo el perfil hasta 20 cm. Entremado denso y diverso. Multiples especies.'}}
},
{id:'por',name:'Porosfera',icon:'fa-circle-nodes',color:'#4a7a3a',
def:'Espacios de tamanos variables por actividad de raices, lombrices, termitas y hormigas. Canales para flujo de aire, agua y organismos. Habitat aerobico ideal.',
proc:['Extrae muestra de 10x10x20 cm cerca del cubo anterior.','Rompe por la mitad.','Examina macroporos (>0.5 mm) en la cara expuesta.','Toma foto vertical sujetando con los dedos abajo.','Observa tamano, continuidad vertical y distribucion.'],
ayudas:'Identifica: bioporos (continuos, por animales o raices), fisuras planas (labranza), poros irregulares (entre agregados). Observa continuidad vertical y distribucion.',
checks:[
{t:'Abundantes bioporos continuos de distintos tamanos',w:3},{t:'Buena distribucion vertical en todo el perfil',w:3},{t:'Bioporos por raices y lombrices claramente visibles',w:2},{t:'Estructura esponjosa al tacto',w:1},{t:'Algunos macroporos discontinuos',w:1,l:2},{t:'Fisuras planas de labranza presentes',w:1,l:2},{t:'Sin macroporos visibles',w:4,l:1},{t:'Estructura compacta sin espacios',w:3,l:1}
],
lvls:{1:{n:'Pobre',c:'#c44b3f',d:'Sin macroporos. Estructura compacta. Sin bioporos. Sin canales para aire y agua.'},2:{n:'Regular',c:'#d4a853',d:'Algunos macroporos discontinuos. Fisuras de labranza. Pocos bioporos.'},3:{n:'Buena',c:'#5a8a4a',d:'Abundantes bioporos continuos. Buena distribucion vertical. Estructura esponjosa.'}}
}
];

/* ========== SVG REFERENCIAS ========== */
function refSVG(sp,lv){
var w=160,h=100,s='<svg viewBox="0 0 '+w+' '+h+'" style="width:100%;border-radius:6px;background:#1a1510">';
if(sp.id==='det'){
var bg=lv===1?'#8B7355':lv===2?'#6B5B3E':'#4A3D28';
s+='<rect x="0" y="55" width="'+w+'" height="45" fill="'+bg+'" rx="0"/>';
if(lv===3){s+='<rect x="5" y="42" width="30" height="16" fill="#5a5030" rx="3" opacity=".8"/><rect x="40" y="38" width="25" height="20" fill="#6a5a35" rx="3" opacity=".85"/><rect x="70" y="40" width="35" height="18" fill="#4a4525" rx="3" opacity=".8"/><rect x="110" y="36" width="28" height="22" fill="#5a5030" rx="3" opacity=".85"/><rect x="142" y="41" width="15" height="17" fill="#6a5a35" rx="3" opacity=".8"/>';
s+='<line x1="20" y1="50" x2="55" y2="45" stroke="#9a8a60" stroke-width=".7" opacity=".6"/><line x1="80" y1="48" x2="125" y2="42" stroke="#9a8a60" stroke-width=".7" opacity=".6"/>';
}else if(lv===2){s+='<rect x="20" y="48" width="40" height="10" fill="#5a5030" rx="2" opacity=".7"/><rect x="90" y="46" width="35" height="12" fill="#6a5a35" rx="2" opacity=".7"/>';
}else{s+='<text x="'+w/2+'" y="78" text-anchor="middle" fill="#a09080" font-size="8" font-family="Source Sans 3">Suelo expuesto</text>';}
if(lv===3)s+='<text x="'+(w-5)+'" y="35" text-anchor="end" fill="#bfa882" font-size="7">>3 cm</text>';
if(lv===2)s+='<text x="'+(w-5)+'" y="45" text-anchor="end" fill="#bfa882" font-size="7"><1 cm</text>';
}else if(sp.id==='agr'){
var colors=lv===1?['#8B6914','#9B7924','#8B6914']:lv===2?['#8B6914','#A08040','#B09850','#C0A860']:['#C0A860','#D0B870','#D8C080','#E0CC90','#D8C080','#C8B070'];
var sizes=lv===1?[50,45]:lv===2?[35,25,18,14]:[8,6,7,9,5,6,8,7,5,6];
var cy=55,x=8;
sizes.forEach(function(sz,i){s+='<ellipse cx="'+(x+sz/2)+'" cy="'+cy+'" rx="'+(sz/2)+'" ry="'+(sz/2*0.7)+'" fill="'+colors[i%colors.length]+'" stroke="'+(lv===1?'#6a5010':'#8a7a40')+'" stroke-width=".5"/>';x+=sz+3;});
if(lv===1)s+='<text x="'+w/2+'" y="90" text-anchor="middle" fill="#c44b3f" font-size="7" font-family="Source Sans 3">Bloques compactos</text>';
else if(lv===3)s+='<text x="'+w/2+'" y="90" text-anchor="middle" fill="#5a8a4a" font-size="7" font-family="Source Sans 3">Estructura migajon-granular</text>';
}else if(sp.id==='dri'){
s+='<rect x="10" y="10" width="'+(w-20)+'" height="80" fill="#5a4a30" rx="4"/>';
var n=lv===1?1:lv===2?4:8;
for(var i=0;i<n;i++){var wx=20+((w-40)/(n))*(i+0.5);var wy=20+Math.sin(i*2.3)*18+25;
s+='<path d="M'+(wx-8)+','+wy+' Q'+(wx-4)+','+(wy-4)+' '+wx+','+wy+' Q'+(wx+4)+','+(wy+4)+' '+(wx+8)+','+wy+'" fill="none" stroke="#d4917a" stroke-width="3" stroke-linecap="round" opacity=".9"/>';}
var nt=lv===1?0:lv===2?2:5;
for(var j=0;j<nt;j++){var tx=15+((w-30)/(nt+1))*(j+1);s+='<ellipse cx="'+tx+'" cy="'+(30+j*12)+'" rx="3" ry="2" fill="#3a2a18" stroke="#2a1a08" stroke-width=".5"/>';}
if(lv===1)s+='<text x="'+w/2+'" y="95" text-anchor="middle" fill="#c44b3f" font-size="7" font-family="Source Sans 3">Sin actividad</text>';
}else if(sp.id==='riz'){
s+='<rect x="15" y="8" width="'+(w-30)+'" height="82" fill="#5a4a30" rx="3"/>';
s+='<line x1="15" y1="20" x2="'+(w-15)+'" y2="20" stroke="#7a6a40" stroke-width="1.5"/>';
if(lv===1){s+='<path d="M'+w/2+',20 L'+(w/2+2)+',30 L'+(w/2-1)+',35" fill="none" stroke="#bfa870" stroke-width="1.2" stroke-linecap="round"/><path d="M'+(w/2+10)+',20 L'+(w/2+12)+',28" fill="none" stroke="#bfa870" stroke-width="1" stroke-linecap="round"/>';
}else if(lv===2){for(var k=0;k<4;k++){var rx=35+k*25;s+='<path d="M'+rx+',20 L'+(rx+2)+','+(35+k*3)+' L'+(rx+5)+','+(45+k*2)+'" fill="none" stroke="#bfa870" stroke-width="1.3" stroke-linecap="round"/>';}
}else{for(var m=0;m<8;m++){var rx2=22+m*14;var d1=30+Math.sin(m)*10;var d2=55+Math.cos(m*1.5)*15;
s+='<path d="M'+rx2+',20 Q'+(rx2+3)+','+d1+' '+(rx2+1)+','+d2+'" fill="none" stroke="#bfa870" stroke-width="'+(1+Math.sin(m)*0.4)+'" stroke-linecap="round"/>';
if(m%2===0)s+='<path d="M'+(rx2+1)+','+d1+' L'+(rx2+8)+','+(d1+8)+'" fill="none" stroke="#c0a860" stroke-width=".8" stroke-linecap="round"/>';}}
}else if(sp.id==='por'){
s+='<rect x="10" y="10" width="'+(w-20)+'" height="80" fill="#6a5a38" rx="4"/>';
var np=lv===1?0:lv===2?4:10;
for(var p=0;p<np;p++){var px=20+((w-40)/(np+1))*(p+1);var py=18+((64)/(np+1))*(p+1);var pr=lv===3?(2+((p%3)+1)):1.5;var isBio=lv===3&&p%3!==0;
s+='<ellipse cx="'+px+'" cy="'+py+'" rx="'+pr+'" ry="'+(pr*1.3)+'" fill="#2a1a0a" stroke="'+(isBio?'#4a3a1a':'#3a2a10')+'" stroke-width=".5"/>';
if(isBio)s+='<ellipse cx="'+px+'" cy="'+(py+pr*1.3)+'" rx="'+(pr*0.7)+'" ry="'+pr+'" fill="#2a1a0a" stroke="none"/>';}
if(lv===3)s+='<text x="'+w/2+'" y="95" text-anchor="middle" fill="#5a8a4a" font-size="7" font-family="Source Sans 3">Estructura esponjosa</text>';
if(lv===1)s+='<text x="'+w/2+'" y="55" text-anchor="middle" fill="#c44b3f" font-size="7" font-family="Source Sans 3">Compacta</text>';
}
s+='</svg>';return s;
}

/* ========== CALCULO LOMBRICES (MANUAL CERES PAG. 53) ========== */
function wormCalc(n){
  var pts=[{w:0,m2:0,kg:0,v:0},{w:2,m2:50,kg:500,v:1},{w:8,m2:100,kg:1000,v:2},{w:16,m2:200,kg:2000,v:3}];
  if(n<=0)return{m2:0,kg:0,v:0};
  if(n>=16){var slM=(pts[3].m2-pts[2].m2)/(pts[3].w-pts[2].w),slK=(pts[3].kg-pts[2].kg)/(pts[3].w-pts[2].w),slV=(pts[3].v-pts[2].v)/(pts[3].w-pts[2].w);
    return{m2:Math.round(pts[3].m2+(n-16)*slM),kg:Math.round(pts[3].kg+(n-16)*slK),v:parseFloat((pts[3].v+(n-16)*slV).toFixed(1))};}
  for(var i=0;i<pts.length-1;i++){if(n>=pts[i].w&&n<=pts[i+1].w){var t=(n-pts[i].w)/(pts[i+1].w-pts[i].w);
    return{m2:Math.round(pts[i].m2+t*(pts[i+1].m2-pts[i].m2)),kg:Math.round(pts[i].kg+t*(pts[i+1].kg-pts[i].kg)),v:parseFloat((pts[i].v+t*(pts[i+1].v-pts[i].v)).toFixed(1))};}}
  return{m2:0,kg:0,v:0};
}

/* ========== ESTADO ========== */
var St={step:0,site:{ev:'',ce:'',un:'',fe:'',ri:'',zo:'',pu:'',lat:null,lng:null,alt:null,acc:null},photos:{sh:[],sd:[]},ratings:{},notes:{},checks:{},wormCount:0,imgA:{},evals:[],cons:{}};
SP.forEach(function(sp){St.ratings[sp.id]=null;St.notes[sp.id]='';St.checks[sp.id]={};St.imgA[sp.id]=null;});
var SLBL=['Datos','Fotos','Detritosfera','Agregatosfera','Drilosfera','Rizosfera','Porosfera','Resumen'];

/* ========== HISTORIAL PERSISTENTE ========== */
var Hist=[];
function loadHist(){try{var h=localStorage.getItem('cbs_history');if(h)Hist=JSON.parse(h);}catch(e){}}
function saveHist(){localStorage.setItem('cbs_history',JSON.stringify(Hist));}
function addToHist(ev){
  var slim=Object.assign({},ev);slim.photos={};slim.imgA={};
  Hist.unshift(slim);saveHist();
}

/* ========== NAVEGACION ========== */
function nav(n){
  if(St.step>=3&&St.step<=7){var sid=SP[St.step-3].id;var ta=document.getElementById('nt-'+sid);if(ta)St.notes[sid]=ta.value;}
  St.step=n;
  document.querySelectorAll('.scr').forEach(function(s){s.classList.remove('on');});
  var ids=['s0','s1','s2','s3','s3','s3','s3','s3','s4','s5','s6','s7'];
  document.getElementById(ids[n]||'s0').classList.add('on');
  var pb=document.getElementById('pbar');
  if(n>=1&&n<=8){pb.classList.remove('hidden');updProg(n);}else pb.classList.add('hidden');
  if(n===2){mkPhotoGallery('sh','ph-sh');mkPhotoGallery('sd','ph-sd');}
  if(n>=3&&n<=7)renderSphere(SP[n-3]);
  if(n===8)renderSummary();
  if(n===9)renderParticipants();
  if(n===10)renderConsensus();
  if(n===11)renderHistory();
  window.scrollTo(0,0);
}

function updProg(step){
  var pct=step<=1?0:step===8?100:((step-1)/7)*100;
  document.getElementById('pfill').style.width=pct+'%';
  var c=document.getElementById('pdots');c.innerHTML='';
  SLBL.forEach(function(l,i){
    var idx=i+1;var d=document.createElement('div');
    d.className='flex flex-col items-center gap-0.5 cursor-pointer flex-shrink-0';
    d.onclick=(function(i){return function(){
      if(i===8){var miss=SP.filter(function(s){return !St.ratings[s.id];});if(miss.length>0){toast('Primero evalúa: '+miss.map(function(s){return s.name;}).join(', '),'e');return;}}
      nav(i);
    };})(idx);
    var dot=document.createElement('div');
    dot.className='sd'+(idx===step?' on':'')+(idx<step?' ok':'');
    d.appendChild(dot);
    var t=document.createElement('span');
    t.className='text-e-600 whitespace-nowrap'+(idx===step?' text-amb':'');
    t.style.fontSize='9px';t.textContent=l;
    d.appendChild(t);c.appendChild(d);
  });
}

/* ========== GEOLOCALIZACIÓN ========== */
function captureGeo(){
  if(!navigator.geolocation){toast('GPS no disponible en este dispositivo','e');return;}
  var btn=document.getElementById('geo-btn');
  var disp=document.getElementById('geo-display');
  if(!btn||!disp)return;
  btn.disabled=true;
  btn.innerHTML='<i class="fas fa-spinner fa-spin mr-1"></i>Obteniendo GPS...';
  disp.innerHTML='<span class="text-e-600 text-xs"><i class="fas fa-info-circle mr-1"></i>Mantén el teléfono al aire libre para mejor precisión...</span>';
  navigator.geolocation.getCurrentPosition(
    function(pos){
      St.site.lat=pos.coords.latitude;
      St.site.lng=pos.coords.longitude;
      St.site.alt=pos.coords.altitude!=null?Math.round(pos.coords.altitude):null;
      St.site.acc=Math.round(pos.coords.accuracy);
      btn.disabled=false;
      btn.innerHTML='<i class="fas fa-location-dot mr-1"></i>Recapturar ubicacion';
      updGeoDisplay();
      if(St.site.acc>30)toast('Precisión baja (±'+St.site.acc+'m). Mejor al aire libre.','i');
      else toast('Ubicación capturada (±'+St.site.acc+'m)','s');
    },
    function(err){
      btn.disabled=false;
      btn.innerHTML='<i class="fas fa-location-dot mr-1"></i>Capturar ubicacion GPS';
      var msg=err.code===1?'Permiso denegado — actívalo en ajustes del teléfono':
              err.code===2?'No se pudo obtener la ubicación':
              'Tiempo agotado — intenta al aire libre';
      disp.innerHTML='<span class="text-e-700 text-xs">'+msg+'</span>';
      toast(msg,'e');
    },
    {enableHighAccuracy:true,timeout:20000,maximumAge:0}
  );
}

function updGeoDisplay(){
  var disp=document.getElementById('geo-display');
  if(!disp)return;
  if(!St.site.lat){disp.innerHTML='<span class="text-e-700 text-xs">No capturada — presiona el botón estando en el punto exacto</span>';return;}
  var acc=St.site.acc||0;
  var clr=acc<=10?'#5a8a4a':acc<=30?'#d4a853':'#c44b3f';
  var altHTML=St.site.alt!=null?' · '+St.site.alt+'m snm':'';
  disp.innerHTML=
    '<div style="display:flex;align-items:center;gap:.4rem;flex-wrap:wrap">'+
    '<i class="fas fa-location-dot" style="color:'+clr+'"></i>'+
    '<span class="text-e-200 text-xs">'+St.site.lat.toFixed(6)+', '+St.site.lng.toFixed(6)+altHTML+'</span>'+
    '<span style="background:'+clr+'1a;color:'+clr+';border:1px solid '+clr+'40;border-radius:10px;padding:1px 6px;font-size:10px">±'+acc+'m</span>'+
    '</div>';
}

/* ========== SITE DATA ========== */
function saveSite(){['ev','ce','un','fe','ri','zo','pu'].forEach(function(k){St.site[k]=document.getElementById('i-'+k).value;});}
function loadSite(){['ev','ce','un','fe','ri','zo','pu'].forEach(function(k){document.getElementById('i-'+k).value=St.site[k]||'';});if(!St.site.fe)document.getElementById('i-fe').value=new Date().toISOString().split('T')[0];updGeoDisplay();}

/* ========== FOTOS GALERIA MULTI (s2 — hasta 3 por vista) ========== */
function mkPhotoGallery(key,container,maxPhotos){
  maxPhotos=maxPhotos||3;
  var el=document.getElementById(container);if(!el)return;
  // Normalizar a array (compatibilidad con datos viejos en string)
  if(!Array.isArray(St.photos[key])){St.photos[key]=St.photos[key]?[St.photos[key]]:[];}
  var photos=St.photos[key];var count=photos.length;
  var html='<div class="photo-grid">';
  photos.forEach(function(dataUrl,i){
    html+='<div class="photo-thumb">'+
      '<img src="'+dataUrl+'" alt="Foto '+(i+1)+'">'+
      '<button class="photo-rm" onclick="removePhoto(\''+key+'\','+i+',\''+container+'\')" title="Eliminar"><i class="fas fa-times"></i></button>'+
      '</div>';
  });
  if(count<maxPhotos){
    html+='<label class="photo-add">'+
      '<i class="fas fa-camera" style="color:#8d7340;font-size:1.1rem"></i>'+
      '<span style="font-size:9px;color:#745d30">'+count+'/'+maxPhotos+'</span>'+
      '<input type="file" accept="image/*" capture="environment" class="hidden" '+
      'onchange="addPhoto(event,\''+key+'\',\''+container+'\','+maxPhotos+')">'+
      '</label>';
  }else{
    html+='<div style="aspect-ratio:1;border-radius:6px;display:flex;align-items:center;justify-content:center;background:rgba(90,138,74,.1);border:1px solid rgba(90,138,74,.3);font-size:9px;color:#5a8a4a;font-weight:700">'+maxPhotos+'/'+maxPhotos+'</div>';
  }
  html+='</div>';
  el.innerHTML=html;
}

function addPhoto(e,key,container,maxPhotos){
  maxPhotos=maxPhotos||3;
  var f=e.target.files[0];if(!f)return;
  if(!Array.isArray(St.photos[key]))St.photos[key]=[];
  if(St.photos[key].length>=maxPhotos)return;
  var r=new FileReader();
  r.onload=function(ev){St.photos[key].push(ev.target.result);mkPhotoGallery(key,container,maxPhotos);toast('Foto capturada','s');};
  r.readAsDataURL(f);
}

function removePhoto(key,idx,container){
  if(!Array.isArray(St.photos[key]))return;
  St.photos[key].splice(idx,1);
  mkPhotoGallery(key,container,3);
}

/* ========== FOTOS ESFERA (1 por esfera) ========== */
function mkPhoto(key,container){
  var el=document.getElementById(container);
  if(St.photos[key]&&typeof St.photos[key]==='string'){
    el.innerHTML='<div class="relative"><img src="'+St.photos[key]+'" style="width:100%;border-radius:6px;max-height:140px;object-fit:cover"><button onclick="retake(\''+key+'\',\''+container+'\')" class="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/80"><i class="fas fa-redo"></i></button></div>';
  }else{
    el.innerHTML='<label class="cb"><i class="fas fa-camera text-xl text-e-500"></i><span class="text-e-500 text-xs">Tomar foto</span><input type="file" accept="image/*" capture="environment" class="hidden" onchange="takePhoto(event,\''+key+'\',\''+container+'\')"></label>';
  }
}
function takePhoto(e,key,container){
  var f=e.target.files[0];if(!f)return;
  var r=new FileReader();
  r.onload=function(ev){St.photos[key]=ev.target.result;mkPhoto(key,container);toast('Foto capturada','s');};
  r.readAsDataURL(f);
}
function retake(key,container){delete St.photos[key];mkPhoto(key,container);}

/* ========== OPTIMIZACION DE IMAGEN (redimensiona antes de subir) ========== */
function resizeImage(dataUrl,maxPx,quality){
  maxPx=maxPx||1200;quality=quality||0.8;
  return new Promise(function(resolve,reject){
    var img=new Image();
    img.onload=function(){
      var w=img.width,h=img.height;
      var ratio=Math.min(maxPx/w,maxPx/h,1);// ratio<=1: no ampliar
      var nw=Math.round(w*ratio),nh=Math.round(h*ratio);
      var cv=document.createElement('canvas');cv.width=nw;cv.height=nh;
      cv.getContext('2d').drawImage(img,0,0,nw,nh);
      cv.toBlob(function(blob){resolve(blob);},'image/jpeg',quality);
    };
    img.onerror=reject;img.src=dataUrl;
  });
}

/* ========== ANALISIS HEURISTICO ========== */
function analyzeImage(spId){
  var dataUrl=St.photos[spId];
  if(!dataUrl||typeof dataUrl!=='string')return Promise.resolve(null);
  return new Promise(function(resolve){
    var img=new Image();
    img.onload=function(){
      var cv=document.createElement('canvas');var sz=80;cv.width=sz;cv.height=sz;
      var ctx=cv.getContext('2d');ctx.drawImage(img,0,0,sz,sz);
      var px=ctx.getImageData(0,0,sz,sz).data;
      var darkPx=0,rSum=0,gSum=0,bSum=0,total=sz*sz;var varH=0;
      for(var i=0;i<px.length;i+=4){var r=px[i],g=px[i+1],b=px[i+2];var bright=(r+g+b)/3;rSum+=r;gSum+=g;bSum+=b;if(bright<80)darkPx++;}
      var avgR=rSum/total,avgG=gSum/total,avgB=bSum/total;var darkRatio=darkPx/total;
      for(var y=0;y<sz;y++){for(var x=0;x<sz-1;x++){var i1=(y*sz+x)*4,i2=(y*sz+x+1)*4;var d=Math.abs(px[i1]-px[i2])+Math.abs(px[i1+1]-px[i2+1])+Math.abs(px[i1+2]-px[i2+2]);varH+=d;}}
      varH/=(total-sz)*3;
      var score=2;var conf=25;var reasons=[];
      if(spId==='det'){if(darkRatio>0.4){score=2.5;conf+=15;reasons.push('Alta proporcion de tonos oscuros (materia organica)');}if(darkRatio>0.6){score=2.8;conf+=10;reasons.push('Tonalidad muy oscura en superficie');}if(darkRatio<0.2){score=1.3;conf+=10;reasons.push('Predominan tonos claros (suelo expuesto)');}if(avgG>avgR+10){conf+=8;reasons.push('Tono verdoso (posible presencia de hongos)');}conf=Math.min(conf,55);
      }else if(spId==='agr'){if(varH>40){score=2.6;conf+=15;reasons.push('Alta variabilidad textural (agregados diversos)');}if(varH<15){score=1.4;conf+=12;reasons.push('Baja variabilidad (superficie homogenea compacta)');}if(darkRatio>0.35){conf+=5;reasons.push('Tonos oscuros (agregados con materia organica)');}conf=Math.min(conf,50);
      }else if(spId==='dri'){var warmPx=((avgR-avgB)>15)?darkRatio*0.5:0;if(warmPx>0.1){score+=0.5;conf+=10;reasons.push('Tonalidad calida detectada (posible presencia de lombrices)');}if(varH>30){conf+=5;reasons.push('Textura irregular (posibles tuneles/estiercol)');}conf=Math.min(conf,40);
      }else if(spId==='riz'){var edgeV=0;for(var xv=0;xv<sz;xv++){for(var yv=0;yv<sz-1;yv++){var ii1=(yv*sz+xv)*4,ii2=((yv+1)*sz+xv)*4;edgeV+=Math.abs(px[ii1]-px[ii2])+Math.abs(px[ii1+1]-px[ii2+1])+Math.abs(px[ii1+2]-px[ii2+2]);}}edgeV/=(total-sz)*3;var lightPx=0;for(var li=0;li<px.length;li+=4){if((px[li]+px[li+1]+px[li+2])/3>160)lightPx++;}lightPx/=total;if(lightPx>0.15&&edgeV>25){score=2.5;conf+=15;reasons.push('Lineas claras verticales (posibles raices)');}if(edgeV>35){score+=0.3;conf+=8;reasons.push('Alta variabilidad vertical (distribucion de raices)');}if(lightPx<0.05){score=1.3;conf+=8;reasons.push('Pocas zonas claras (escasas raices visibles)');}conf=Math.min(conf,50);
      }else if(spId==='por'){if(varH>35){score=2.4;conf+=12;reasons.push('Alta irregularidad (posibles macroporos)');}if(darkRatio>0.3&&varH>20){score+=0.3;conf+=8;reasons.push('Zonas oscuras irregulares (bioporos)');}if(varH<12){score=1.3;conf+=12;reasons.push('Superficie muy uniforme (posible compactacion)');}conf=Math.min(conf,48);}
      score=Math.max(1,Math.min(3,score));conf=Math.max(15,Math.min(55,conf));
      resolve({score:Math.round(score*10)/10,conf:conf,reasons:reasons});
    };
    img.onerror=function(){resolve(null);};img.src=dataUrl;
  });
}

/* ========== CHECKLIST ========== */
function calcCheckSug(spId){
  var sp=SP.find(function(s){return s.id===spId;});
  var ck=St.checks[spId]||{};var wP=0,wF=0,wG=0;
  sp.checks.forEach(function(c,i){if(ck[i]){var tgt=c.l||3;if(tgt===1)wP+=c.w;else if(tgt===2)wF+=c.w;else wG+=c.w;}});
  var total=wP+wF+wG;if(total===0)return null;
  var scores={1:wP,2:wF,3:wG};
  var best=Object.entries(scores).sort(function(a,b){return b[1]-a[1];})[0];
  return{level:parseInt(best[0]),total:total,maxScore:Math.max(wP,wF,wG),conf:Math.min(70,Math.round((best[1]/total)*70))};
}

/* ========== SUGERENCIA COMBINADA ========== */
function combinedSug(spId){
  var img=St.imgA[spId];var chk=calcCheckSug(spId);
  var reasons=[];var conf=0;var score=0;var sources=[];
  if(chk){score+=chk.level*0.6;conf+=chk.conf*0.6;sources.push('Checklist');}
  if(img){score+=img.score*0.4;conf+=img.conf*0.4;sources.push('Analisis de imagen');reasons.push.apply(reasons,img.reasons.map(function(r){return '[Foto] '+r;}));}
  if(sources.length===0)return null;
  if(sources.length===1){score=sources[0]==='Checklist'?chk.level:img.score;conf=sources[0]==='Checklist'?chk.conf:img.conf;}
  var level=score<1.8?1:score<2.5?2:3;level=Math.max(1,Math.min(3,level));conf=Math.round(conf);
  return{level:level,conf:conf,sources:sources,reasons:reasons};
}

/* ========== CONTADOR LOMBRICES ========== */
function renderWormCounter(){
  var wc=wormCalc(St.wormCount);
  var clr=St.wormCount>=8?'#5a8a4a':St.wormCount>=3?'#d4a853':'#c44b3f';
  var vacasTexto=wc.v+' vaca';if(wc.v!==1)vacasTexto+='s';vacasTexto+='/ha';
  return '<div class="cd p-4 mb-3">'+
    '<p class="text-e-200 text-xs font-semibold mb-2"><i class="fas fa-calculator text-amb mr-1"></i>Contador de lombrices</p>'+
    '<div class="flex items-center gap-3 mb-3">'+
      '<button class="worm-btn" onclick="adjWorm(-1)">-</button>'+
      '<div class="text-center flex-1">'+
        '<div class="font-d text-3xl font-black" style="color:'+clr+'">'+St.wormCount+'</div>'+
        '<p class="text-e-500 text-xs">lombrices en cubo 20 cm</p>'+
      '</div>'+
      '<button class="worm-btn" onclick="adjWorm(1)">+</button>'+
    '</div>'+
    '<div class="text-xs text-e-400 space-y-1.5" style="background:#1a1510;border-radius:6px;padding:.6rem">'+
      '<div class="flex justify-between"><span>Equivalencia:</span><span class="font-bold" style="color:'+clr+'">'+wc.m2+' lombrices/m\u00B2</span></div>'+
      '<div class="flex justify-between"><span>Biomasa estimada:</span><span class="font-bold" style="color:'+clr+'">'+wc.kg.toLocaleString('es-CL')+' kg/ha</span></div>'+
      '<div class="flex justify-between"><span>Equivalente a:</span><span class="font-bold" style="color:'+clr+'">'+vacasTexto+'</span></div>'+
      '<div style="border-top:1px solid #3d3428;margin-top:.4rem;padding-top:.4rem" class="text-e-600 italic">'+
        '<p>Ref. manual CERES (Selles et al. 2006):</p>'+
        '<p>2 lombrices \u2192 50/m\u00B2 \u2192 500 kg/ha \u2192 1 vaca</p>'+
        '<p>8 lombrices \u2192 100/m\u00B2 \u2192 1.000 kg/ha \u2192 2 vacas</p>'+
        '<p>16 lombrices \u2192 200/m\u00B2 \u2192 2.000 kg/ha \u2192 3 vacas</p>'+
      '</div>'+
    '</div>'+
  '</div>';
}

function adjWorm(d){
  St.wormCount=Math.max(0,St.wormCount+d);
  renderSphere(SP.find(function(s){return s.id==='dri';}));
}

/* ========== RENDER ESFERA ========== */
function renderSphere(sp){
  var idx=SP.indexOf(sp);var rating=St.ratings[sp.id];var note=St.notes[sp.id]||'';
  var hasPhoto=!!St.photos[sp.id]&&typeof St.photos[sp.id]==='string';var sug=combinedSug(sp.id);
  var c=document.getElementById('sc');
  var wormHTML='';if(sp.id==='dri')wormHTML=renderWormCounter();

  c.innerHTML=
    '<div class="flex items-center gap-2 mb-1">'+
      '<div style="width:42px;height:42px;border-radius:10px;background:'+sp.color+'18;border:1px solid '+sp.color+'33;display:flex;align-items:center;justify-content:center">'+
        '<i class="fas '+sp.icon+' text-lg" style="color:'+sp.color+'"></i></div>'+
      '<div><h2 class="font-d text-xl font-bold">'+sp.name+'</h2><p class="text-e-600 text-xs">Esfera '+(idx+1)+' de 5</p></div></div>'+
    '<div class="cd p-3 mb-3" style="border-left:3px solid '+sp.color+'"><p class="text-e-200 text-xs leading-relaxed italic">'+sp.def+'</p></div>'+
    /* DIAGRAMAS */
    '<div class="cd mb-3 overflow-hidden">'+
      '<button onclick="togAcc(\'ref-'+sp.id+'\')" class="w-full flex items-center justify-between p-3 text-left hover:bg-e-900/40 transition">'+
        '<span class="text-amb font-semibold text-xs"><i class="fas fa-diagram-project mr-1"></i>Diagramas de referencia por condicion</span>'+
        '<i id="chev-ref-'+sp.id+'" class="fas fa-chevron-down text-e-600 text-xs transition-transform"></i></button>'+
      '<div id="acc-ref-'+sp.id+'" class="acc"><div class="px-3 pb-3"><div class="ref-grid">'+
        [1,2,3].map(function(lv){var l=sp.lvls[lv];return '<div class="ref-card '+(rating===lv?'sel':'')+'" style="border-color:'+(rating===lv?l.c:'#3d3428')+'" onclick="setR(\''+sp.id+'\','+lv+')">'+refSVG(sp,lv)+
          '<div style="padding:.4rem"><p class="text-xs font-bold" style="color:'+l.c+'">'+l.n+'</p><p class="text-e-500 text-xs leading-snug" style="font-size:10px">'+l.d+'</p></div></div>';}).join('')+
      '</div></div></div></div>'+
    /* PROCEDIMIENTO */
    '<div class="cd mb-3 overflow-hidden">'+
      '<button onclick="togAcc(\'proc-'+sp.id+'\')" class="w-full flex items-center justify-between p-3 text-left hover:bg-e-900/40 transition">'+
        '<span class="text-amb font-semibold text-xs"><i class="fas fa-book-open mr-1"></i>Procedimiento y ayudas</span>'+
        '<i id="chev-proc-'+sp.id+'" class="fas fa-chevron-down text-e-600 text-xs transition-transform"></i></button>'+
      '<div id="acc-proc-'+sp.id+'" class="acc"><div class="px-3 pb-3">'+
        '<ol class="text-e-300 text-xs mb-3 space-y-1.5">'+sp.proc.map(function(p,i){return '<li class="flex gap-1.5"><span class="text-amb font-bold flex-shrink-0">'+(i+1)+'.</span><span>'+p+'</span></li>';}).join('')+'</ol>'+
        '<div style="background:#1a1510;border-radius:6px;padding:.6rem;border:1px solid #3d3428">'+
          '<p class="text-e-200 text-xs font-semibold mb-1"><i class="fas fa-eye text-amb mr-1"></i>Ayudas para observar</p>'+
          '<p class="text-e-400 text-xs leading-relaxed">'+sp.ayudas+'</p></div></div></div></div>'+
    /* FOTO */
    '<div class="cd p-3 mb-3">'+
      '<p class="text-e-200 text-xs font-semibold mb-2"><i class="fas fa-camera text-amb mr-1"></i>Registro fotografico</p>'+
      '<div id="ph-'+sp.id+'">'+
        (hasPhoto?'<div class="relative"><img src="'+St.photos[sp.id]+'" style="width:100%;border-radius:6px;max-height:180px;object-fit:cover"><button onclick="retake(\''+sp.id+'\',\'ph-'+sp.id+'\')" class="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"><i class="fas fa-redo"></i></button></div>'
        :'<label class="cb"><i class="fas fa-camera text-xl text-e-500"></i><span class="text-e-500 text-xs">Tomar foto de la '+sp.name+'</span><input type="file" accept="image/*" capture="environment" class="hidden" onchange="photoTaken(event,\''+sp.id+'\')"></label>')+
      '</div>'+
      (hasPhoto&&!St.imgA[sp.id]?'<button class="bp w-full mt-2 text-xs py-1.5" onclick="runAnalysis(\''+sp.id+'\')"><i class="fas fa-wand-magic-sparkles mr-1"></i>Analizar imagen</button>':'')+
      (St.imgA[sp.id]?renderImgResult(sp.id):'')+
    '</div>'+
    wormHTML+
    /* CHECKLIST */
    '<div class="cd p-3 mb-3">'+
      '<p class="text-e-200 text-xs font-semibold mb-2"><i class="fas fa-list-check text-amb mr-1"></i>Criterios de observacion</p>'+
      '<div class="flex flex-col gap-0.5">'+
        sp.checks.map(function(ck,i){var on=!!(St.checks[sp.id]&&St.checks[sp.id][i]);var tgtLvl=ck.l||3;var clr2=tgtLvl===1?'#c44b3f':tgtLvl===2?'#d4a853':'#5a8a4a';
          return '<div class="cli '+(on?'on':'')+'" onclick="togCheck(\''+sp.id+'\','+i+')" style="'+(on?'color:'+clr2:'')+'">'+
            '<div class="cdot">'+(on?'<i class="fas fa-check"></i>':'')+'</div>'+
            '<span class="flex-1">'+ck.t+'</span>'+
            '<span class="text-e-700" style="font-size:9px">'+(tgtLvl===1?'\u2192Pobre':tgtLvl===2?'\u2192Regular':'\u2192Buena')+'</span></div>';}).join('')+
      '</div></div>'+
    /* SUGERENCIA */
    (sug?'<div class="sugb mb-3">'+
      '<div class="flex items-center justify-between mb-2">'+
        '<p class="text-amb text-xs font-semibold"><i class="fas fa-lightbulb mr-1"></i>Sugerencia combinada</p>'+
        '<span class="text-xs font-bold" style="color:'+sp.lvls[sug.level].c+'">'+sp.lvls[sug.level].n+' condicion</span></div>'+
      '<div class="cfb mb-2"><div class="cff" style="width:'+sug.conf+'%;background:'+(sug.conf>50?'#5a8a4a':sug.conf>30?'#d4a853':'#c44b3f')+'"></div></div>'+
      '<p class="text-e-500 text-xs">Confianza: '+sug.conf+'% \u2014 Basada en: '+sug.sources.join(' + ')+'</p>'+
      (sug.reasons.length?'<div class="mt-2 space-y-0.5">'+sug.reasons.map(function(r){return '<p class="text-e-400" style="font-size:10px">\u2022 '+r+'</p>';}).join('')+'</div>':'')+
      '<p class="text-e-600 text-xs mt-2 italic">Sugerencia orientativa. Confirme con su observacion directa.</p></div>':'')+
    /* NOTAS */
    '<div class="cd p-3 mb-3">'+
      '<p class="text-e-200 text-xs font-semibold mb-1"><i class="fas fa-pen text-amb mr-1"></i>Observaciones</p>'+
      '<textarea id="nt-'+sp.id+'" class="finp" rows="2" placeholder="Registra lo que observes...">'+note+'</textarea></div>'+
    /* VALORACION */
    '<div class="cd p-3 mb-5">'+
      '<p class="text-e-200 text-xs font-semibold mb-2"><i class="fas fa-star text-amb mr-1"></i>Tu valoracion final</p>'+
      '<div class="grid grid-cols-3 gap-2">'+
        [1,2,3].map(function(lv){var l=sp.lvls[lv];var sel=rating===lv;var sc2=lv===1?'sp':lv===2?'sf':'sg';
          return '<div class="rc '+(sel?sc2:'')+'" onclick="setR(\''+sp.id+'\','+lv+')">'+
            '<div style="width:10px;height:10px;border-radius:50%;background:'+l.c+';margin:0 auto .3rem"></div>'+
            '<p class="font-bold text-xs" style="color:'+(sel?l.c:'#bfa882')+'">'+l.n+'</p></div>';}).join('')+
      '</div></div>'+
    '<div class="flex gap-2">'+
      '<button class="bs flex-1" onclick="nav('+(2+idx)+')"><i class="fas fa-arrow-left mr-1"></i>Atras</button>'+
      (idx<4?'<button class="bp flex-1" onclick="nav('+(4+idx)+')">Siguiente<i class="fas fa-arrow-right ml-1"></i></button>'
      :'<button class="bp flex-1" onclick="finishEval()">Ver resumen<i class="fas fa-chart-pie ml-1"></i></button>')+
    '</div>';
}

function renderImgResult(spId){
  var a=St.imgA[spId];var sp=SP.find(function(s){return s.id===spId;});
  var lvl=a.score<1.8?1:a.score<2.5?2:3;
  return '<div style="background:#1a1510;border-radius:6px;padding:.6rem;margin-top:.5rem;border:1px solid #3d3428">'+
    '<p class="text-e-300 text-xs font-semibold mb-1"><i class="fas fa-robot text-amb mr-1"></i>Analisis heuristico de imagen</p>'+
    '<div class="cfb mb-1"><div class="cff" style="width:'+a.conf+'%;background:'+(a.conf>40?'#5a8a4a':'#d4a853')+'"></div></div>'+
    '<p class="text-e-500" style="font-size:10px">Confianza: '+a.conf+'% \u2014 Puntaje: '+a.score+'/3 \u2192 <span style="color:'+sp.lvls[lvl].c+';font-weight:700">'+sp.lvls[lvl].n+'</span></p>'+
    (a.reasons.length?'<div class="mt-1 space-y-0.5">'+a.reasons.map(function(r){return '<p class="text-e-400" style="font-size:9px">\u2022 '+r+'</p>';}).join('')+'</div>':'')+
    '<p class="text-e-700 mt-1" style="font-size:9px"><i class="fas fa-info-circle mr-0.5"></i>Analisis basado en color/textura. No reemplaza su juicio.</p></div>';
}

function runAnalysis(spId){
  toast('Analizando imagen...','i');
  analyzeImage(spId).then(function(result){
    if(result){St.imgA[spId]=result;renderSphere(SP.find(function(s){return s.id===spId;}));toast('Analisis completado','s');}
    else toast('No se pudo analizar la imagen','e');
  });
}

function photoTaken(e,spId){
  var f=e.target.files[0];if(!f)return;
  var r=new FileReader();
  r.onload=function(ev){St.photos[spId]=ev.target.result;St.imgA[spId]=null;renderSphere(SP.find(function(s){return s.id===spId;}));toast('Foto capturada','s');};
  r.readAsDataURL(f);
}

function togCheck(spId,idx){
  if(!St.checks[spId])St.checks[spId]={};
  St.checks[spId][idx]=!St.checks[spId][idx];
  renderSphere(SP.find(function(s){return s.id===spId;}));
}

function setR(spId,lv){
  St.ratings[spId]=lv;
  renderSphere(SP.find(function(s){return s.id===spId;}));
  toast(SP.find(function(s){return s.id===spId;}).name+': '+SP.find(function(s){return s.id===spId;}).lvls[lv].n,'i');
}

function togAcc(id){
  var el=document.getElementById('acc-'+id);var ch=document.getElementById('chev-'+id);
  if(!el)return;el.classList.toggle('open');
  if(ch)ch.style.transform=el.classList.contains('open')?'rotate(180deg)':'';
}

/* ========== FINALIZAR EVALUACION ========== */
function finishEval(){
  var missing=SP.filter(function(s){return !St.ratings[s.id];});
  if(missing.length>0){toast('Falta valorar: '+missing.map(function(s){return s.name;}).join(', '),'e');return;}

  var evalId='eval_'+Date.now();
  var ev={
    id:evalId,
    site:{ev:St.site.ev,ce:St.site.ce,un:St.site.un,fe:St.site.fe,ri:St.site.ri,zo:St.site.zo,pu:St.site.pu,lat:St.site.lat,lng:St.site.lng,alt:St.site.alt,acc:St.site.acc},
    photos:{},photoRefs:{},ratings:{},notes:{},checks:{},
    wormCount:St.wormCount,ts:new Date().toISOString(),synced:false
  };
  // Copiar datos sin referencia
  Object.keys(St.photos).forEach(function(k){
    var val=St.photos[k];
    ev.photos[k]=Array.isArray(val)?val.slice():val;
  });
  Object.keys(St.ratings).forEach(function(k){ev.ratings[k]=St.ratings[k];});
  Object.keys(St.notes).forEach(function(k){ev.notes[k]=St.notes[k];});
  Object.keys(St.checks).forEach(function(k){ev.checks[k]=JSON.parse(JSON.stringify(St.checks[k]));});

  St.evals.push(ev);
  addToHist(ev);
  saveLS();
  toast('Evaluacion guardada','s');
  nav(8);

  // Subida en segundo plano a Firebase (si esta configurado)
  if(typeof StorageService!=='undefined' && navigator.onLine){
    uploadEvalToFirebase(ev,evalId);
  }
}

/* ========== UPLOAD FIREBASE EN SEGUNDO PLANO ========== */
function uploadEvalToFirebase(ev,evalId){
  var uploads=[];
  var photoRefs={};

  Object.keys(ev.photos).forEach(function(key){
    var val=ev.photos[key];
    var urls=Array.isArray(val)?val:(val?[val]:[]);
    if(!urls.length)return;
    photoRefs[key]=[];
    urls.forEach(function(dataUrl,i){
      var folder=key==='sh'||key==='sd'?'site':'spheres';
      var relPath='evals/'+evalId+'/'+folder+'/'+key+(urls.length>1?'_'+i:'');
      photoRefs[key].push(relPath);
      var p=resizeImage(dataUrl,1200,0.8).then(function(blob){
        return StorageService.upload(relPath,blob);
      });
      uploads.push(p);
    });
  });

  Promise.all(uploads).then(function(){
    var firestoreDoc={
      id:evalId,site:ev.site,
      photoRefs:photoRefs,// solo rutas relativas — sin dataUrls
      ratings:ev.ratings,notes:ev.notes,checks:ev.checks,
      wormCount:ev.wormCount,ts:ev.ts
    };
    return StorageService.saveEval(firestoreDoc);
  }).then(function(docId){
    var localEv=St.evals.find(function(e){return e.id===evalId;});
    if(localEv){localEv.photoRefs=photoRefs;localEv.firestoreId=docId;localEv.synced=true;}
    saveLS();
    toast('Sincronizado \u2601','s');
  }).catch(function(err){
    console.warn('[Firebase] Error al subir evaluacion:',err);
  });
}

/* ========== RESUMEN ========== */
function renderSummary(evParam){
  var ev=evParam||St.evals[St.evals.length-1];if(!ev)return;
  var fromHist=!!evParam;
  var data=SP.map(function(s){return ev.ratings[s.id];});
  var c=document.getElementById('sm');

  var wormHTML='';
  if(ev.wormCount){var wc=wormCalc(ev.wormCount);var vt=wc.v+' vaca';if(wc.v!==1)vt+='s';vt+='/ha';
    wormHTML='<div class="cd p-3 mb-3"><p class="text-e-200 text-xs font-semibold mb-1"><i class="fas fa-worm text-amb mr-1"></i>Lombrices contadas</p>'+
      '<p class="text-e-300 text-sm">'+ev.wormCount+' lombrices = '+wc.m2+'/m\u00B2 = '+wc.kg.toLocaleString('es-CL')+' kg/ha = '+vt+'</p></div>';}

  // Recopilar todas las fotos (maneja strings y arrays)
  var allPhotos=[];
  Object.keys(ev.photos||{}).forEach(function(k){
    var val=ev.photos[k];
    if(Array.isArray(val)){val.forEach(function(url){if(url)allPhotos.push({key:k,url:url});});}
    else if(val){allPhotos.push({key:k,url:val});}
  });
  var photosHTML='';
  if(allPhotos.length){
    var labels={'sh':'Cenital','sd':'Lateral'};
    photosHTML='<div class="cd p-3 mb-3">'+
      '<p class="text-e-200 text-xs font-semibold mb-2"><i class="fas fa-images text-amb mr-1"></i>Registro fotografico ('+allPhotos.length+')</p>'+
      '<div class="grid grid-cols-3 gap-1.5">'+
      allPhotos.map(function(p){
        var _sp=SP.find(function(s){return s.id===p.key;});var lbl=labels[p.key]||(_sp?_sp.name:'');
        return '<div style="position:relative"><img src="'+p.url+'" style="width:100%;border-radius:4px;aspect-ratio:1;object-fit:cover">'+
          (lbl?'<div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.6);font-size:8px;color:#f5efe6;text-align:center;padding:2px;border-radius:0 0 4px 4px">'+lbl+'</div>':'')+
          '</div>';}).join('')+'</div></div>';
  }

  // Estado de sync
  var syncHTML='';
  if(ev.synced){syncHTML='<div style="display:inline-flex;align-items:center;gap:.3rem;background:rgba(90,138,74,.1);border:1px solid rgba(90,138,74,.25);border-radius:20px;padding:.2rem .6rem;font-size:10px;color:#5a8a4a"><i class="fas fa-cloud-arrow-up"></i>Sincronizado</div>';}
  else if(typeof FIREBASE_ENABLED!=='undefined'&&FIREBASE_ENABLED){syncHTML='<div style="display:inline-flex;align-items:center;gap:.3rem;background:rgba(212,168,83,.1);border:1px solid rgba(212,168,83,.25);border-radius:20px;padding:.2rem .6rem;font-size:10px;color:#d4a853"><i class="fas fa-clock"></i>Pendiente de sync</div>';}

  c.innerHTML=
    '<h2 class="font-d text-xl font-bold mb-0.5"><i class="fas fa-chart-pie text-amb mr-2"></i>Resumen</h2>'+
    '<div class="flex items-center justify-between mb-3">'+
      '<p class="text-e-500 text-xs">'+(ev.site.ev||'Evaluador')+' \u2014 '+(ev.site.ce||'')+'</p>'+
      syncHTML+'</div>'+
    '<div class="cd p-3 mb-3"><p class="text-e-200 text-xs font-semibold mb-2 text-center">Grafico de Brechas</p>'+
      '<div class="flex justify-center"><canvas id="rdr1" style="width:300px;height:300px;max-width:100%"></canvas></div></div>'+
    '<div class="cd p-3 mb-3"><p class="text-e-200 text-xs font-semibold mb-2">Valoraciones</p>'+
      '<div class="flex flex-col gap-1.5">'+SP.map(function(s){var l=s.lvls[ev.ratings[s.id]];return '<div class="flex items-center gap-2" style="padding:.4rem .6rem;background:'+l.c+'0a;border-radius:6px;border-left:3px solid '+l.c+'">'+
        '<i class="fas '+s.icon+' w-4 text-center" style="color:'+s.color+'"></i>'+
        '<span class="text-e-200 text-xs flex-1">'+s.name+'</span>'+
        '<span class="font-bold text-xs" style="color:'+l.c+'">'+l.n+'</span></div>';}).join('')+'</div></div>'+
    wormHTML+photosHTML+
    '<div class="flex flex-col gap-2">'+
      (fromHist
        ? '<button class="bs" onclick="nav(11)"><i class="fas fa-arrow-left mr-1"></i>Volver al historial</button>'
        : '<button class="bp" onclick="newPart()"><i class="fas fa-user-plus mr-1"></i>Agregar participante</button>'+
          (St.evals.length>=2?'<button class="bp" style="background:linear-gradient(135deg,#5a8a4a,#3a6a2a)" onclick="nav(10)"><i class="fas fa-users mr-1"></i>Consenso grupal</button>':'')+
          '<button class="bs" onclick="resetAll()"><i class="fas fa-redo mr-1"></i>Nueva evaluacion</button>'
      )+'</div>';
  setTimeout(function(){drawRadar('rdr1',data);},80);
}

/* ========== RADAR ========== */
function drawRadar(id,data,avg){
  var cv=document.getElementById(id);if(!cv)return;
  var dpr=window.devicePixelRatio||1;var r=cv.getBoundingClientRect();
  cv.width=r.width*dpr;cv.height=r.height*dpr;
  var ctx=cv.getContext('2d');ctx.scale(dpr,dpr);
  var w=r.width,h=r.height,cx=w/2,cy=h/2,mR=Math.min(cx,cy)-48;
  var n=5,step=(2*Math.PI)/n,sa=-Math.PI/2;
  [[1,'rgba(196,75,63,0.06)','rgba(196,75,63,0.22)','Pobre'],[2,'rgba(212,168,83,0.06)','rgba(212,168,83,0.22)','Regular'],[3,'rgba(90,138,74,0.06)','rgba(90,138,74,0.22)','Buena']].forEach(function(lv){
    var rd=mR*lv[0]/3;ctx.beginPath();
    for(var i=0;i<=n;i++){var a=sa+(i%n)*step;var x=cx+rd*Math.cos(a),y=cy+rd*Math.sin(a);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.closePath();ctx.fillStyle=lv[1];ctx.fill();ctx.strokeStyle=lv[2];ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle='rgba(160,149,133,0.4)';ctx.font='8px Source Sans 3';ctx.textAlign='left';ctx.fillText(lv[3],cx+3,cy-rd+10);
  });
  for(var i=0;i<n;i++){var a=sa+i*step;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+mR*Math.cos(a),cy+mR*Math.sin(a));ctx.strokeStyle='rgba(61,52,40,0.5)';ctx.lineWidth=1;ctx.stroke();}
  var lr=mR+26;
  SP.forEach(function(s,i){var a=sa+i*step;ctx.fillStyle=s.color;ctx.font='bold 10px Source Sans 3';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s.name,cx+lr*Math.cos(a),cy+lr*Math.sin(a));});
  if(avg)drawPoly(ctx,cx,cy,mR,sa,step,n,avg,'rgba(212,168,83,0.12)','rgba(212,168,83,0.55)',1.5,true);
  if(data)drawPoly(ctx,cx,cy,mR,sa,step,n,data,'rgba(90,138,74,0.2)','rgba(90,138,74,0.85)',2,false);
}
function drawPoly(ctx,cx,cy,mR,sa,step,n,d,fc,sc,lw,dash){
  ctx.beginPath();
  for(var i=0;i<=n;i++){var a=sa+(i%n)*step;var r=mR*d[i%n]/3;var x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
  ctx.closePath();ctx.fillStyle=fc;ctx.fill();
  if(dash)ctx.setLineDash([5,3]);ctx.strokeStyle=sc;ctx.lineWidth=lw;ctx.stroke();ctx.setLineDash([]);
  for(var j=0;j<n;j++){var a2=sa+j*step;var r2=mR*d[j]/3;ctx.beginPath();ctx.arc(cx+r2*Math.cos(a2),cy+r2*Math.sin(a2),dash?2.5:3,0,2*Math.PI);ctx.fillStyle=sc;ctx.fill();}
}

/* ========== HISTORIAL ========== */
function renderHistory(){
  var c=document.getElementById('s7');
  if(!Hist.length){
    c.innerHTML='<div class="max-w-lg mx-auto pt-6 px-4 text-center">'+
      '<p class="text-e-600 mb-4">No hay evaluaciones guardadas aún.</p>'+
      '<button class="bp px-6 py-2" onclick="nav(0)"><i class="fas fa-arrow-left mr-1"></i>Inicio</button></div>';
    return;
  }
  var html='<div class="max-w-lg mx-auto pt-3 px-3 pb-8">'+
    '<div class="flex items-center justify-between mb-3">'+
      '<h2 class="font-d text-lg font-bold"><i class="fas fa-history text-amb mr-2"></i>Historial</h2>'+
      '<span class="text-e-600 text-xs">'+Hist.length+' evaluación'+(Hist.length!==1?'es':'')+'</span>'+
    '</div>'+
    '<button class="bs text-xs px-3 py-1.5 mb-3" onclick="nav(0)"><i class="fas fa-arrow-left mr-1"></i>Inicio</button>'+
    '<div class="flex flex-col gap-2">';
  Hist.forEach(function(ev,i){
    var fecha=ev.site&&ev.site.fe?ev.site.fe:(ev.ts?ev.ts.slice(0,10):'—');
    var eval_name=ev.site&&ev.site.ev?ev.site.ev:'Sin nombre';
    var centro=ev.site&&ev.site.ce?ev.site.ce:'Sin centro';
    var dots=SP.map(function(s){
      var r=ev.ratings[s.id];
      var clr=r===1?'#c44b3f':r===2?'#d4a853':'#5a8a4a';
      return '<div style="width:11px;height:11px;border-radius:50%;background:'+(r?clr:'#3d3428')+';border:1px solid rgba(255,255,255,.1)"></div>';
    }).join('');
    html+='<div class="sugb flex items-center gap-3 cursor-pointer" onclick="viewHistEval('+i+')">'+
      '<div class="flex-1 min-w-0">'+
        '<div class="font-bold text-sm text-e-200 truncate">'+eval_name+'</div>'+
        '<div class="text-e-600 text-xs truncate">'+fecha+' · '+centro+'</div>'+
      '</div>'+
      '<div class="flex gap-1 flex-shrink-0">'+dots+'</div>'+
      '<button class="text-e-500 text-xs border border-e-700 px-2 py-1 rounded flex-shrink-0" '+
        'onclick="event.stopPropagation();exportEval('+i+')" title="Descargar JSON">'+
        '<i class="fas fa-download"></i></button>'+
    '</div>';
  });
  html+='</div></div>';
  c.innerHTML=html;
}

function viewHistEval(i){
  var ev=Hist[i];
  document.querySelectorAll('.scr').forEach(function(s){s.classList.remove('on');});
  document.getElementById('s4').classList.add('on');
  document.getElementById('pbar').classList.add('hidden');
  renderSummary(ev);
  window.scrollTo(0,0);
}

function exportEval(i){
  var ev=Hist[i];
  var fe=ev.site&&ev.site.fe?ev.site.fe:(ev.ts?ev.ts.slice(0,10):'sin-fecha');
  var evl=(ev.site&&ev.site.ev?ev.site.ev:'evaluador').replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_\-]/g,'');
  var ce=(ev.site&&ev.site.ce?ev.site.ce:'sitio').replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_\-]/g,'');
  var nombre=['CBS',fe,evl,ce].join('_')+'.json';
  var blob=new Blob([JSON.stringify(ev,null,2)],{type:'application/json'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');a.href=url;a.download=nombre;a.click();
  URL.revokeObjectURL(url);
  toast('Descargando '+nombre,'i');
}

/* ========== PARTICIPANTES ========== */
function renderParticipants(){
  var c=document.getElementById('sp');
  if(!St.evals.length){c.innerHTML='<h2 class="font-d text-xl font-bold mb-3">Participantes</h2><p class="text-e-500 text-sm">Sin evaluaciones.</p><button class="bp mt-3" onclick="nav(0)">Comenzar</button>';return;}
  var tblHTML='';
  if(St.evals.length>=2){
    tblHTML='<div class="cd p-3 mb-3 overflow-x-auto"><table class="w-full text-xs"><thead><tr class="text-e-500"><th class="text-left pb-1.5 pr-1">Esfera</th>'+
      St.evals.map(function(ev,i){return '<th class="text-center pb-1.5 px-1">'+(ev.site.ev||'P'+(i+1))+'</th>';}).join('')+
      '</tr></thead><tbody>'+
      SP.map(function(s){return '<tr class="border-t border-e-800"><td class="py-1.5 pr-1 text-e-300"><i class="fas '+s.icon+' mr-1" style="color:'+s.color+'"></i>'+s.name+'</td>'+
        St.evals.map(function(ev){var l=s.lvls[ev.ratings[s.id]];return '<td class="text-center py-1.5 px-1"><span style="background:'+l.c+'1a;color:'+l.c+';padding:1px 6px;border-radius:10px;font-weight:700;font-size:10px">'+l.n+'</span></td>';}).join('')+
        '</tr>';}).join('')+
      '</tbody></table></div>'+
      '<button class="bp w-full" style="background:linear-gradient(135deg,#5a8a4a,#3a6a2a)" onclick="nav(10)"><i class="fas fa-handshake mr-1"></i>Consenso grupal</button>';
  }else{
    tblHTML='<div class="cd p-3 text-center"><p class="text-e-500 text-xs mb-2">Se necesitan al menos 2 evaluaciones</p><button class="bp" onclick="newPart()"><i class="fas fa-user-plus mr-1"></i>Agregar participante</button></div>';
  }
  c.innerHTML=
    '<h2 class="font-d text-xl font-bold mb-0.5"><i class="fas fa-users text-amb mr-2"></i>Participantes</h2>'+
    '<p class="text-e-500 text-xs mb-3">'+St.evals.length+' evaluacion(es)</p>'+
    '<div class="cd p-3 mb-3"><div class="flex flex-col gap-1.5">'+
      St.evals.map(function(ev,i){return '<div style="background:#1a1510;padding:.35rem .6rem;border-radius:16px;display:inline-flex;align-items:center;gap:.4rem">'+
        '<i class="fas fa-user text-amb text-xs"></i><span class="text-e-200 text-xs">'+(ev.site.ev||'P'+(i+1))+'</span>'+
        '<span class="text-e-600 text-xs">\u2014 '+(ev.site.ce||'')+'</span></div>';}).join('')+
    '</div></div>'+tblHTML+
    '<button class="bs w-full mt-2" onclick="nav(0)"><i class="fas fa-home mr-1"></i>Inicio</button>';
}

/* ========== CONSENSO ========== */
function renderConsensus(){
  var c=document.getElementById('sx');
  if(St.evals.length<2){c.innerHTML='<p class="text-e-500">Minimo 2 evaluaciones</p><button class="bp mt-3" onclick="nav(9)">Volver</button>';return;}
  if(!Object.keys(St.cons).length){
    SP.forEach(function(s){var d={1:0,2:0,3:0};St.evals.forEach(function(ev){d[ev.ratings[s.id]]++;});St.cons[s.id]=+Object.entries(d).sort(function(a,b){return b[1]-a[1]||b[0]-a[0];})[0][0];});
  }
  var avgData=SP.map(function(s){var sum=St.evals.reduce(function(a,ev){return a+ev.ratings[s.id];},0);return +(sum/St.evals.length).toFixed(2);});
  var consData=SP.map(function(s){return St.cons[s.id];});
  c.innerHTML=
    '<h2 class="font-d text-xl font-bold mb-0.5"><i class="fas fa-handshake text-amb mr-2"></i>Consenso Grupal</h2>'+
    '<p class="text-e-500 text-xs mb-4">'+St.evals.length+' participantes \u2014 Discutan y determinen la valoracion consensuada</p>'+
    '<div class="cd p-3 mb-3"><p class="text-e-200 text-xs font-semibold mb-2 text-center">Grafico de Brechas</p>'+
      '<div class="flex justify-center"><canvas id="rdr-c" style="width:320px;height:320px;max-width:100%"></canvas></div>'+
      '<div class="flex justify-center gap-4 mt-2 text-xs">'+
        '<span class="flex items-center gap-1"><span style="width:14px;height:2px;background:rgba(90,138,74,.85);display:inline-block;border-radius:1px"></span><span class="text-e-500">Consenso</span></span>'+
        '<span class="flex items-center gap-1"><span style="width:14px;height:0;border-top:2px dashed rgba(212,168,83,.6);display:inline-block"></span><span class="text-e-500">Promedio</span></span></div></div>'+
    '<div class="flex flex-col gap-3 mb-5">'+SP.map(function(s){
      var d={1:0,2:0,3:0};St.evals.forEach(function(ev){d[ev.ratings[s.id]]++;});
      var tot=St.evals.length;var cv=St.cons[s.id];
      return '<div class="cd p-3"><div class="flex items-center gap-2 mb-2"><i class="fas '+s.icon+'" style="color:'+s.color+'"></i><span class="font-bold text-e-100 text-sm">'+s.name+'</span></div>'+
        '<div class="flex flex-col gap-1 mb-2">'+[1,2,3].map(function(lv){var l=s.lvls[lv];var pct=tot?(d[lv]/tot*100):0;
          return '<div class="flex items-center gap-1.5"><span class="text-xs w-12 text-right" style="color:'+l.c+'">'+l.n+'</span>'+
            '<div class="flex-1 bg-e-950 rounded-full overflow-hidden" style="height:20px"><div style="width:'+Math.max(pct,3)+'%;height:100%;background:'+l.c+';border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#1a1510;transition:width .5s">'+(d[lv]||'')+'</div></div>'+
            '<span class="text-e-600 text-xs w-8">'+pct.toFixed(0)+'%</span></div>';}).join('')+'</div>'+
        '<p class="text-e-600 text-xs mb-1.5">Consenso:</p>'+
        '<div class="grid grid-cols-3 gap-1.5">'+[1,2,3].map(function(lv){var l=s.lvls[lv];var sel=cv===lv;var sc2=lv===1?'sp':lv===2?'sf':'sg';
          return '<div class="rc '+(sel?sc2:'')+'" onclick="setCons(\''+s.id+'\','+lv+')" style="padding:.4rem"><p class="font-bold text-xs" style="color:'+(sel?l.c:'#bfa882')+'">'+l.n+'</p></div>';}).join('')+'</div></div>';
    }).join('')+'</div>'+
    '<div class="flex flex-col gap-2">'+
      '<button class="bp" onclick="saveCons()"><i class="fas fa-check-double mr-1"></i>Guardar consenso</button>'+
      '<button class="bs" onclick="nav(9)"><i class="fas fa-arrow-left mr-1"></i>Volver</button></div>';
  setTimeout(function(){drawRadar('rdr-c',consData,avgData);},80);
}
function setCons(sid,lv){St.cons[sid]=lv;renderConsensus();}
function saveCons(){
  try{localStorage.setItem('cbs_cons',JSON.stringify(St.cons));}catch(e){}
  saveLS();
  if(typeof StorageService!=='undefined'&&navigator.onLine){
    StorageService.saveCons({cons:St.cons,ts:new Date().toISOString()}).catch(function(){});
  }
  toast('Consenso guardado','s');
}

/* ========== ACCIONES GLOBALES ========== */
function newPart(){
  SP.forEach(function(s){St.ratings[s.id]=null;St.notes[s.id]='';St.checks[s.id]={};St.imgA[s.id]=null;});
  St.photos={sh:[],sd:[]};St.wormCount=0;St.site.ev='';loadSite();nav(1);toast('Datos del nuevo participante','i');
}
function resetAll(){
  SP.forEach(function(s){St.ratings[s.id]=null;St.notes[s.id]='';St.checks[s.id]={};St.imgA[s.id]=null;});
  St.photos={sh:[],sd:[]};St.wormCount=0;St.site={ev:'',ce:'',un:'',fe:'',ri:'',zo:'',pu:'',lat:null,lng:null,alt:null,acc:null};
  St.evals=[];St.cons={};
  try{localStorage.removeItem('cbs_ev');localStorage.removeItem('cbs_cons');}catch(e){}
  nav(0);
}

/* ========== STORAGE LOCAL ========== */
function saveLS(){
  try{localStorage.setItem('cbs_ev',JSON.stringify(St.evals));}catch(e){}
}
function loadLS(){
  try{
    var e=localStorage.getItem('cbs_ev');if(e)St.evals=JSON.parse(e);
    var c2=localStorage.getItem('cbs_cons');if(c2)St.cons=JSON.parse(c2);
  }catch(e){}
}

/* ========== TOAST ========== */
function toast(msg,type){
  type=type||'i';var c=document.getElementById('tc');var t=document.createElement('div');
  var cls={i:'toast-i',s:'toast-s',e:'toast-e'};var ico={i:'fa-circle-info',s:'fa-circle-check',e:'fa-circle-exclamation'};
  t.className='toast '+(cls[type]||'toast-i');
  t.innerHTML='<i class="fas '+(ico[type]||ico.i)+' mr-1"></i>'+msg;
  c.appendChild(t);setTimeout(function(){t.classList.add('tout');setTimeout(function(){t.remove();},200);},2500);
}

/* ========== ESTADO ONLINE/OFFLINE ========== */
function updateOnlineStatus(){
  var badge=document.getElementById('online-badge');if(!badge)return;
  if(navigator.onLine){
    badge.innerHTML='<i class="fas fa-wifi"></i><span>En linea</span>';
    badge.style.color='#5a8a4a';
  }else{
    badge.innerHTML='<i class="fas fa-wifi-slash"></i><span>Sin conexion</span>';
    badge.style.color='#8d7340';
  }
}
window.addEventListener('online',updateOnlineStatus);
window.addEventListener('offline',updateOnlineStatus);

/* ========== INIT ========== */
function init(){
  loadLS();loadHist();loadSite();
  // Normalizar fotos del sitio en localStorage (compatibilidad)
  if(!Array.isArray(St.photos.sh))St.photos.sh=St.photos.sh?[St.photos.sh]:[];
  if(!Array.isArray(St.photos.sd))St.photos.sd=St.photos.sd?[St.photos.sd]:[];

  updateOnlineStatus();

  if(St.evals.length>0){
    document.getElementById('resume-btn').innerHTML=
      '<button class="bs mt-3 text-sm" onclick="nav('+(St.evals.length>=2?9:8)+')">'+
      '<i class="fas fa-folder-open mr-1"></i>Continuar ('+St.evals.length+' evaluacion'+(St.evals.length>1?'es':'')+')</button>';
  }
}
init();
