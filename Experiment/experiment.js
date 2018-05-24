/*****
Topic: Visible or invisible objects/images
Author: Sreekanth T M, NIT Agartala
*******/

//TODO 1) Clean the code. 2) Hide lines when going to try it out etc.


//Global variables
var eye,object;

var LearningCheck=0,TryItCheck=1;

var visButton;
var invisButton;

var ranObjX,ranObjY,ranEyeX,ranObjY;


var infoContent;
function initialiseInfo() {
    infoContent =  "";
    infoContent = infoContent + "<h2>Visible or invisible objects/images concepts</h2>";
    infoContent = infoContent + "<h3>About the experiment</h3>";
    infoContent = infoContent + "<p>The experiment shows a plane mirror with an object and an observer(eye) on the side of the smooth surface of the mirror. The aim of the experiment is to learn when and how an objects image becomes visible in a plane mirror.</p>";
    infoContent = infoContent + "<h3>The theory</h3>";
    infoContent = infoContent + "<p>The main concepts are the laws of reflections which are: <ul><li>The angle of reflection equals the angle of incidence.</li><li>The incident ray, reflected ray and the image all lie in the same plane. </li></ul> Hence by drawing ray diagram from the object to the observer(eye) following the two laws of reflection we can find the point of reflection on the mirror. If object to mirror ray and mirror to eye ray converge at a point not within the mirror, then the image will not be visible in the mirror.</p>";
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";
    PIEupdateInfo(infoContent);
}


var helpContent;
function initialiseHelp() {
    helpContent="";
    helpContent = helpContent + "<h2>Visible or invisible objects/images help</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>The experiment shows a plane mirror with an object and an observer(eye) on the side of the smooth surface of the mirror. The aim of the experiment is to learn when and how an objects image becomes visible in a plane mirror.</p>";
    helpContent = helpContent + "<h3>Controls</h3>";
    helpContent = helpContent + "<p>The experiment can be controlled by the provided control panel. When in the TRY IT OUT mode, user can choose the location of the object and the eye. START button begins the ray diagram drawing and states whether the image is visible or invisible.</p>";
    helpContent = helpContent + "<h3>Modes</h3>";
    helpContent = helpContent + "<p>There are two modes: <ul><li>Learning Mode</li><li>Try It Out Mode</li></ul></p><p> </p>";
    helpContent = helpContent + "<h3>Learning Mode</h3><p>The learning mode is for understanding purposes and shows the object and the eye at random locations. The user can click SHOW RAYS to see ray diagram and then click either VISIBLE or INVISIBLE buttons to register their answer upon which the answer will be verified. </p>"
    helpContent = helpContent + "<h3>Try It Out Mode</h3><p>The Try It Out Mode allows the user to choose all four experiment variables (locations of object and the eye) and check whether object is visible/invisible .</p>";
    helpContent = helpContent + "<h3>Note: A red ray diagram indicates that the incident and reflected ray converge outside the mirror and the object is INVISIBLE.</h3>";
    helpContent = helpContent + "<h2>Happy Experimenting</h2>";
    PIEupdateHelp(helpContent);
}


function loadExperimentElements(){
  PIEsetExperimentTitle("Visible or invisible objects/images");
  PIEsetDeveloperName("Sreekanth T M");
  if(window.innerWidth<=400){
    PIEsetAreaOfInterest(-30,22,30,-22);
  }
  else if(window.innerWidth>=400&&window.innerWidth<=900){
    PIEsetAreaOfInterest(-20,16,20,-16);
  }
  else{
    PIEsetAreaOfInterest(-16,9,16,-9);
  }

  initialiseInfo();
  initialiseHelp();

  //Adding CheckBoxes for the two modes
  PIEaddInputCheckbox("Learning", true, loadLearning);
  PIEaddInputCheckbox("Try It Yourself", false, loadTryIt);

  //Adding Input Sliders to control location of eye and object
  /*var FizzyText = function(){
    this.Object_X=-6;
    this.Object_Y=2;
    this.Eye_X=-6;
    this.Eye_Y=-2;
  }
  text=new FizzyText();
  f1 = PIEinputGUI.addFolder("Try It Yourself Controls");
  f1.add(text,'Object_X',-8,-1).step(1).onFinishChange(handleObjectX);
  f1.add(text,'Object_Y',-6,6).step(1).onFinishChange(handleObjectY);
  f1.add(text,'Eye_X',-8,-1).step(1).onFinishChange(handleEyeX);
  f1.add(text,'Eye_Y',-6,6).step(1).onFinishChange(handleEyeY);*/


  //Loads the background colour on a mesh
  var background = new THREE.Mesh(new THREE.BoxGeometry(200,200,0),new THREE.MeshBasicMaterial({color:"#3498DF"}));
  PIEaddElement(background);
  background.position.set(0,0,-5);

  notice=new THREE.Mesh();
  var loader=new THREE.TextureLoader();
  loader.load('dragnotice.png',function(texture){
    notice=new THREE.Mesh(new THREE.BoxGeometry(14,1.28,0),new THREE.MeshBasicMaterial({map:texture,transparent:true}));
    PIEaddElement(notice);
    notice.position.set(0,7.5,0);
    PIErender();
  });

  //Initialising Object and Eye
  object = new THREE.Mesh();
  eye = new THREE.Mesh();

  visButton=new THREE.Mesh();
  invisButton=new THREE.Mesh();

  //loading object & eye
  loadObject(-8,6,0);
  loadEye(-8,-6,0.01);
  ranObjX=-8;
  ranObjY=6;
  ranEyeX=-8;
  ranEyeY=-6;
  normalY = ((ranObjX*ranEyeY)+(ranEyeX*ranObjY))/(ranObjX+ranEyeX);

  //loading mirror
  loadMirror();

  showrayButton=new THREE.Mesh();
  visButton=new THREE.Mesh();
  invisButton=new THREE.Mesh();
  nextButton=new THREE.Mesh();
  hintButton=new THREE.Mesh();
  loadButtons();


  //Adding event listener to start Button
  document.getElementById('start').addEventListener('click',AnimationStart);
  document.getElementById('stop').addEventListener('click',AnimationStop);

  //loadRay(ranObjX,ranObjY);
  ranEyeX+=0.6;
  ranEyeY+=0.3;
  generateRayDiagram(0);
  loadTryIt();
}

//Loads the menu interface with buttons
function loadButtons(){
  var loader=new THREE.TextureLoader();
  visButton.visible=false;
  invisButton.visible=false;
  loader.load('visible.png',function(texture){
    visButton = new THREE.Mesh(new THREE.BoxGeometry(5,1.3,0),new THREE.MeshBasicMaterial({map:texture,transparent:true}));
    PIEaddElement(visButton);
    PIEsetClick(visButton,VisibleButtonClick);
    visButton.position.set(13,1,0);
    visButton.visible=false;
    PIErender();
  });

  loader.load('invisible.png',function(texture){
    invisButton = new THREE.Mesh(new THREE.BoxGeometry(5,1.3,0),new THREE.MeshBasicMaterial({map:texture,transparent:true}));
    PIEaddElement(invisButton);
    PIEsetClick(invisButton,InVisibleButtonClick);
    invisButton.position.set(13,-0.5,0);
    invisButton.visible=false;
    PIErender();
  });

  loader.load('showray.png',function(texture){
    showrayButton = new THREE.Mesh(new THREE.BoxGeometry(5,1.3,0),new THREE.MeshBasicMaterial({map:texture,transparent:true}));
    PIEaddElement(showrayButton);
    PIEsetClick(showrayButton,showRayButtonClick);
    showrayButton.position.set(13,-3,0);
    showrayButton.visible=false;
    PIErender();
  });

  loader.load('next.png',function(texture){
    nextButton = new THREE.Mesh(new THREE.BoxGeometry(5,1.3,0),new THREE.MeshBasicMaterial({map:texture,transparent:true}));
    PIEaddElement(nextButton);
    PIEsetClick(nextButton,nextButtonClick);
    nextButton.position.set(13,-4.5,0);
    nextButton.visible=false;
    PIErender();
  });

  loader.load('hint.png',function(texture){
    hintButton = new THREE.Mesh(new THREE.BoxGeometry(5,1.3,0),new THREE.MeshBasicMaterial({map:texture,transparent:true}));
    PIEaddElement(hintButton);
    PIEsetClick(hintButton,hintButtonClick);
    hintButton.position.set(13,-6,0);
    hintButton.visible=false;
    PIErender();
  });
}


//Generates the ray diagram
var incidentRay,reflectedRay,virtualRay;
function generateRayDiagram(flag){
  var material,dashedmaterial;
  if(flag==0){
    incidentmaterial = new THREE.LineBasicMaterial({
       color: 0xffff00,
       linewidth:2,
       transparent:true,
       opacity:1,
    });

    reflectedmaterial = new THREE.LineBasicMaterial({
       color: 0xffff00,
       linewidth:2,
       transparent:true,
       opacity:1,
    });

    virtualmaterial = new THREE.LineBasicMaterial({
       color: 0xffff00,
       linewidth:2,
       transparent:true,
       opacity:1,
    });

    var dashedmaterial = new THREE.LineDashedMaterial( {
    color: "#006400",
    linewidth: 2,
    scale: 1,
    dashSize: 0.25,
    gapSize: 0.25,
    transparent:true,
    opacity:1,
  } );
  }

  if(flag==1){
    incidentmaterial = new THREE.LineBasicMaterial({
  	   color: "red",
       linewidth:2,
       transparent:true,
       opacity:1,
    });

    reflectedmaterial = new THREE.LineBasicMaterial({
  	   color: "red",
       linewidth:2,
       transparent:true,
       opacity:1,
    });

    virtualmaterial = new THREE.LineBasicMaterial({
  	   color: "red",
       linewidth:2,
       transparent:true,
       opacity:1,
    });

    var dashedmaterial = new THREE.LineDashedMaterial( {
    color: "red",
    linewidth: 2,
    scale: 1,
    dashSize: 0.25,
    gapSize: 0.25,
    transparent:true,
    opacity:1,
  } );
  }


var incidentGeometry = new THREE.Geometry();
incidentGeometry.vertices.push(
	new THREE.Vector3( ranObjX, ranObjY, 0 ),
	new THREE.Vector3( 0, normalY, 0 ),
  new THREE.Vector3( 0, normalY, 0 )
);

incidentRay = new THREE.Line( incidentGeometry, incidentmaterial );
incidentRay.visible=false;
PIEaddElement(incidentRay);
PIErender();

var reflectedGeometry = new THREE.Geometry();
reflectedGeometry.vertices.push(
	new THREE.Vector3( ranEyeX, ranEyeY, 0 ),
	new THREE.Vector3( 0, normalY, 0 ),
  new THREE.Vector3( 0, normalY, 0 )
);

reflectedRay = new THREE.Line( reflectedGeometry, reflectedmaterial );
reflectedRay.visible=false;
PIEaddElement(reflectedRay);
PIErender();

var virtualGeometry = new THREE.Geometry();
virtualGeometry.vertices.push(
	new THREE.Vector3( -ranObjX, ranObjY, 0 ),
	new THREE.Vector3( 0, normalY, 0 ),
  new THREE.Vector3( 0, normalY, 0 )
);

virtualRay = new THREE.Line( virtualGeometry, virtualmaterial );
virtualRay.visible=false;
PIEaddElement(virtualRay);
PIErender();

//Dashed ray
var dashedgeometry = new THREE.Geometry();
dashedgeometry.vertices.push(
	new THREE.Vector3( -ranObjX, ranObjY, 0 ),
	new THREE.Vector3( ranObjX, ranObjY, 0 ),
  new THREE.Vector3(ranObjX, ranObjY, 0 )
);
dashedgeometry.computeLineDistances();

dashedRay = new THREE.Line( dashedgeometry, dashedmaterial );
dashedRay.visible=false;
PIEaddElement(dashedRay);
PIErender();

image = new THREE.Mesh(new THREE.BoxGeometry(0.8,0.8,0.8),new THREE.MeshLambertMaterial({color:"#101010",transparent:true,opacity:0.6}));
PIEaddElement(image);
image.position.set(-ranObjX,ranObjY,0);
image.visible=false;
image.rotation.z+=Math.PI;
}

var animationStatus=0
function updateExperimentElements(t,dt){
  if(LearningCheck==1){

  }

  if(TryItCheck==1){
    incidentRay.material.opacity+=(dt/2000);
    if(incidentRay.material.opacity>=1){
      incidentRay.material.opacity=1;
      reflectedRay.material.opacity+=(dt/2000);

      if(reflectedRay.material.opacity>=1){
        virtualRay.material.opacity+=(dt/2000);

        if(virtualRay.material.opacity>=1){
          dashedRay.material.opacity+=(dt/2000);
           if(dashedRay.material.opacity>=1){
             PIEstopAnimation();
             notice.visible=true;
             PIEdragElement(object);
             PIEdragElement(eye);
             PIEsetDrag(object,AnimationStop);
             PIEsetDrag(eye,AnimationStop);
             animationStatus=0;
             incidentRay.material.opacity=1;
             reflectedRay.material.opacity=1;
             virtualRay.material.opacity=1;
             dashedRay.material.opacity=1;
           }
        }
      }
    }
  }

}



//Button Click Answer check functions
var normalY;
function VisibleButtonClick(){
  normalY = ((ranObjX*ranEyeY)+(ranEyeX*ranObjY))/(ranObjX+ranEyeX);
  if(normalY<=4&&normalY>=-4){
    alert("Correct! That object's image is visible!");
  }
  else{
    alert("Wrong! The image is NOT Visible!");
  }
}

function InVisibleButtonClick(){
  normalY = ((ranObjX*ranEyeY)+(ranEyeX*ranObjY))/(ranObjX+ranEyeX);
  if(normalY<=4&&normalY>=-4){
    alert("Wrong! The image is Visible!");
  }
  else{
    alert("Correct! That object's image is NOT visible!");
  }
}


var showRay=0;
function showRayButtonClick(){
  showRay=1;
  incidentRay.visible=true;
  reflectedRay.visible=true;
  virtualRay.visible=true;
  image.visible=true;
  dashedRay.visible=true;
  PIErender();
}

function nextButtonClick(){
  incidentRay.visible=false;
  reflectedRay.visible=false;
  virtualRay.visible=false;
  image.visible=false;
  dashedRay.visible=false;
  resetFlag=1;
  loadLearning();
  PIErender();
}

function hintButtonClick(){
  alert("Hint: Click on SHOW RAYS to observe ray diagram! If rays converge outside of mirror (rays are red in colour) then object will be INVISIBLE!")
}

//CheckBox Handling FUNCTIONS
var resetFlag=0;
function loadLearning(){
  PIEchangeInputCheckbox("Try It Yourself",false);
  PIEchangeInputCheckbox("Learning",true);
  //f1.close();


  PIEremoveDragElement(object);
  PIEremoveDragElement(eye);

  if(resetFlag==1){
    //Generating random positions for eye and object
    ranObjX = Math.floor(Math.random() * -8) -1;
    ranObjY = Math.floor(Math.random()*13)-6;
    ranEyeX = Math.floor(Math.random() * -8) -1;
    ranEyeY = Math.floor(Math.random()*13)-6;

    object.position.set(ranObjX,ranObjY,0);
    eye.position.set(ranEyeX,ranEyeY,0.01);
  }
  else{
    ranObjX=-8;
    ranObjY=6;
    ranEyeX=-8;
    ranEyeY=-6;
    object.position.set(ranObjX,ranObjY,0);
    eye.position.set(ranEyeX,ranEyeY,0.01);
  }

  TryItCheck=0;
  LearningCheck=1;

  ranEyeX+=0.6;
  ranEyeY+=0.3;
  normalY = ((ranObjX*ranEyeY)+(ranEyeX*ranObjY))/(ranObjX+ranEyeX);

  notice.visible=false;

  incidentRay.visible=false;
  reflectedRay.visible=false;
  virtualRay.visible=false;
  dashedRay.visible=false;
  image.visible=false;

  if(normalY<=4&&normalY>=-4){
    generateRayDiagram(0);
  }
  else{
    generateRayDiagram(1);
  }

  //Loading answering platform
  visButton.visible=true;
  invisButton.visible=true;
  showrayButton.visible=true;
  hintButton.visible=true;
  nextButton.visible=true;

  PIErender();

}

var notice;
function loadTryIt(){
  PIEchangeInputCheckbox("Try It Yourself",true);
  PIEchangeInputCheckbox("Learning",false);
  //f1.open();
  TryItCheck=1;
  LearningCheck=0;
  resetFlag=0;

  object.position.set(-8,6,0);
  eye.position.set(-8,-6,0.01);
  objX=-8,objY=6,eyeX=-8,eyeY=-6;


  PIEdragElement(object);
  PIEsetDrag(object,objectDrag);
  PIEdragElement(eye);
  PIEsetDrag(eye,eyeDrag);

  //Hide unwanted learning mode stuff
  visButton.visible=false;
  invisButton.visible=false;
  showrayButton.visible=false;
  hintButton.visible=false;
  nextButton.visible=false;
  incidentRay.visible=false;
  reflectedRay.visible=false;
  virtualRay.visible=false;
  dashedRay.visible=false;
  image.visible=false;

  //Initial Ray loading
  initialiseRay();

  notice.visible=true;
  PIErender();
}


function objectDrag(element,newpos){
  //AnimationStop();
  //PIEstopAnimation();
  if(newpos.x<=-8){
    object.position.x=-8;
  }
  else if(newpos.x>=-1){
    object.position.x=-1;
  }
  else{
    object.position.x=newpos.x;
  }
  if(newpos.y>=6){
    object.position.y=6;
  }
  else if(newpos.y<=-6){
    object.position.y=-6;
  }
  else{
    object.position.y=newpos.y;
  }
  object.position.z=0;
  objX=object.position.x;
  objY=object.position.y;
  initialiseRay();
}

function eyeDrag(element,newpos){
  //AnimationStop();
  //PIEstopAnimation();
  if(newpos.x<=-8){
    eye.position.x=-8;
  }
  else if(newpos.x>=-1){
    eye.position.x=-1;
  }
  else{
    eye.position.x=newpos.x;
  }
  if(newpos.y>=6){
    eye.position.y=6;
  }
  else if(newpos.y<=-6){
    eye.position.y=-6;
  }
  else{
    eye.position.y=newpos.y;
  }
  eye.position.z=0;
  eyeX=eye.position.x;
  eyeY=eye.position.y;
  initialiseRay();
}

function initialiseRay(){
  ranObjX=objX;
  ranObjY=objY;
  ranEyeX=eyeX;
  ranEyeY=eyeY;
  ranEyeX+=0.6;
  ranEyeY+=0.3;
  normalY = ((ranObjX*ranEyeY)+(ranEyeX*ranObjY))/(ranObjX+ranEyeX);
  if(normalY<=4&&normalY>=-4){
    generateRayDiagram(0);
  }
  else{
    generateRayDiagram(1);
  }
  incidentRay.material.opacity=0;
  reflectedRay.material.opacity=0;
  virtualRay.material.opacity=0;
  dashedRay.material.opacity=0;
}


function AnimationStart(){
  animationStatus=1;
  incidentRay.visible=true;
  reflectedRay.visible=true;
  virtualRay.visible=true;
  image.visible=true;
  dashedRay.visible=true;

  if(TryItCheck==1){
    incidentRay.material.opacity=0;
    reflectedRay.material.opacity=0;
    virtualRay.material.opacity=0;
    dashedRay.material.opacity=0;
    notice.visible=false;
    if(normalY<=4&&normalY>=-4){
        visButton.visible=true;
        invisButton.visible=false;
    }
    else{
        visButton.visible=false;
        invisButton.visible=true;
    }

    PIEremoveDragElement(object);
    PIEremoveDragElement(eye);

  }


  PIErender();
}

function AnimationStop(){
  animationStatus=0;
  /*incidentRay.material.opacity=1;
  reflectedRay.material.opacity=1;
  virtualRay.material.opacity=1;
  dashedRay.material.opacity=1;*/
  incidentRay.visible=false;
  reflectedRay.visible=false;
  virtualRay.visible=false;
  image.visible=false;
  dashedRay.visible=false;
  if(TryItCheck==1){
    visButton.visible=false;
    invisButton.visible=false;
    notice.visible=true;
    PIEremoveDragElement(object);
    PIEremoveDragElement(eye);
    PIEdragElement(object);
    PIEsetDrag(object,objectDrag);
    PIEdragElement(eye);
    PIEsetDrag(eye,eyeDrag);
  }
  PIErender();
}

//Input Slider Handling functions
var objX=-8,objY=6,eyeX=-8,eyeY=-6;
function handleObjectX(newval){
  objX=newval;
  if(TryItCheck==1){
    object.position.x=objX;
    resetExperiment();
  }
  initialiseRay();
  PIErender();
}

function handleObjectY(newval){
  objY=newval;
  if(TryItCheck==1){
    object.position.y=objY;
    resetExperiment();
  }
  initialiseRay();
  PIErender();
}

function handleEyeX(newval){
  eyeX=newval;
  if(TryItCheck==1){
    eye.position.x=eyeX;
    resetExperiment();
  }
  initialiseRay();
  PIErender();
}

function handleEyeY(newval){
  eyeY=newval;
  if(TryItCheck==1){
    eye.position.y=eyeY;
    resetExperiment();
  }
  initialiseRay();
  PIErender();
}


//This function loads the mirror
function loadMirror(){
  var mirror = new THREE.Mesh(new THREE.BoxGeometry(0.3,8,0),new THREE.MeshBasicMaterial({color:"white",transparent:true,opacity:0.9}));
  PIEaddElement(mirror);
  mirror.position.set(0.15,0,0);

  var mirror2 = new THREE.Mesh(new THREE.BoxGeometry(0.4,8.1,-0.01),new THREE.MeshBasicMaterial({color:"#101010",transparent:true,opacity:1}));
  PIEaddElement(mirror2);
  mirror2.position.set(0.15,0,0);

  var dashes=[];
  var temp=-3.75;
  for(var i=0;i<16;i++){
    dashes[i]=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.06,0),new THREE.MeshBasicMaterial({color:"#101010",opacity:0.9,transparent:true}));
    PIEaddElement(dashes[i]);
    dashes[i].rotation.z+=Math.PI/4;
    dashes[i].position.set(0.5,temp,0);
    temp+=0.5;
  }
  PIErender();
}


//Loads the object
function loadObject(x,y,z){
  //Hide any previous instances of object
  object.visible=false;
  object = new THREE.Mesh(new THREE.BoxGeometry(0.8,0.8,0.8),new THREE.MeshLambertMaterial({color:"#101010"}));
  PIEaddElement(object);
  object.position.set(x,y,z);
  PIErender();
}


//Loads the Eye
function loadEye(x,y,z){
  //Hides any previous instances of eye
  eye.visible=false;

  var loader=new THREE.TextureLoader();
  /*loader.load('eye.png',function(texture){
    eye = new THREE.Mesh(new THREE.BoxGeometry(1.565,2,0),new THREE.MeshBasicMaterial({map:texture,transparent:true}));
    PIEaddElement(eye);
    eye.position.set(x,y,z);
    PIErender();
  });*/

  loader.load('observer.png',function(texture){
    eye = new THREE.Mesh(new THREE.BoxGeometry(1.565,2,0),new THREE.MeshBasicMaterial({map:texture,transparent:true}));
    PIEaddElement(eye);
    eye.position.set(x,y,z);
    PIEdragElement(eye);
    PIEsetDrag(eye,eyeDrag);
    PIErender();


    var dot = new THREE.Mesh(new THREE.CircleGeometry(0.1,32,32),new THREE.MeshBasicMaterial({color:"red"}));
    PIEaddElement(dot);
    dot.position.set(0.6,0.3,0);
    dot.visible=false;

    /*eye=new THREE.Group();
    eye.add(dot);
    eye.add(eyemesh);
    PIEaddElement(eye);
    eye.position.set(x,y,z);*/
  });

  PIErender();
}


function resetExperiment(){
  if(TryItCheck==1){
    AnimationStop();
    //PIEstopAnimation();

    /*PIEdragElement(object);
    PIEsetDrag(object,objectDrag);
    PIEdragElement(eye);
    PIEsetDrag(eye,eyeDrag);*/

    incidentRay.visible=false;
    reflectedRay.visible=false;
    virtualRay.visible=false;
    image.visible=false;
    dashedRay.visible=false;
  }
  if(LearningCheck==1){
    resetFlag=0;
    loadLearning();
  }
  PIErender();
}
