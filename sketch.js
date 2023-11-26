let pursuer1, pursuer2;
let target;
let obstacles = [];
let vehicules = [];
let separationSlider;
let separationDistance = 50; // Valeur par défaut

let followLeader = true;
let leader = vehicules[0]; // Supposons que vehicules[0] est le leader
  leader.drawZoneAhead();
function setup() {
  createCanvas(windowWidth, windowHeight);

  separationSlider = createSlider(0, 200, separationDistance, 1);
  separationSlider.position(10, 10);
  separationSlider.style('width', '80px');
  pursuer1 = new Vehicle(100, 100);
  pursuer2 = new Vehicle(random(width), random(height));

  vehicules.push(pursuer1);
  vehicules.push(pursuer2);

  // On crée un obstacle au milieu de l'écran
// Un cercle avec un rayon de 100 pixels
//une variable pour définir la taille du cercle
let obstacleRadius = 100;

let obstacleColor = '#ff0000'; 

// Créez un obstacle avec les nouvelles spécifications
obstacle = new Obstacle(width / 2, height / 2, obstacleRadius, obstacleColor);

// Ajoutez l'obstacle à la liste des obstacles
obstacles.push(obstacle);

  
}

function draw() {
  // changer le dernier param (< 100) pour effets de trainée
  background(0, 0, 0, 100);

  target = createVector(mouseX, mouseY);

  // Dessin de la cible qui suit la souris
  // Dessine un cercle de rayon 32px à la position de la souris
// Modifier le design du cercle
fill(255, 200, 0); // Remplissage en jaune orangé
stroke(255); // Contour en noir
strokeWeight(3); // Épaisseur du contour
circle(target.x, target.y, 32);

  // dessin des obstacles
  // TODO
  obstacles.forEach(o => {
    o.show();
  });
  let targetMouse = createVector(mouseX, mouseY);
  let targetPrevious;
  separationDistance = separationSlider.value();

  for (let i = 0; i < vehicules.length; i++) {
    if (i == 0) {
      vehicules[i].applyBehaviors(targetMouse, obstacles, vehicules, separationDistance);
    } else {
      let vehiculePrecedent = vehicules[i-1];

      //targetPrevious = createVector(vehiculePrecedent.pos.x, vehiculePrecedent.pos.y);

      // en fait on veut viser un point derriere le vehicule précédent
      // On prend la vitesse du précédent et on en fait une copie
      let pointDerriere = vehiculePrecedent.vel.copy();
      // on le normalise
      pointDerriere.normalize();
      // et on le multiplie par une distance derrière le vaisseau
      pointDerriere.mult(-30);
      // on l'ajoute à la position du vaisseau
      pointDerriere.add(vehiculePrecedent.pos);

      // on le dessine sous la forme d'un cercle pour debug
      fill(255, 0, 0)
      circle(pointDerriere.x, pointDerriere.y, 10);

      vehicules[i].applyBehaviors(pointDerriere, obstacles, vehicules);

     // si le vehicule est à moins de 5 pixels du point derriere, on le fait s'arreter
     // en mettant le poids de son comportement arrive à 0
     // et en lui donnant comme direction du vecteur vel la direction du vecteur
      // entre sa position et le vaisseau précédent
      if(vehicules[i].pos.dist(pointDerriere) < 20 && vehicules[i].vel.mag() <0.01) {
        vehicules[i].weightArrive = 0;
        vehicules[i].weightObstacle = 0;
        vehicules[i].vel.setHeading(p5.Vector.sub(vehiculePrecedent.pos, vehicules[i].pos).heading());
        console.log("stop");
      } else {
        vehicules[i].weightArrive = 0.3;
        vehicules[i].weightObstacle = 0.9;
        console.log("nonstop");
      }

    }
    
    vehicules[i].update();
    vehicules[i].show();
  }
  
}

function mousePressed() {
  obstacle = new Obstacle(mouseX, mouseY, random(5, 60));
  obstacles.push(obstacle);
}

function keyPressed() {
  if (key == "v") {
    vehicules.push(new Vehicle(random(width), random(height)));
  }
  if (key == "d") {
    Vehicle.debug = !Vehicle.debug;
  }
  if (key === 's' || key === 'S') {
    followLeader = !followLeader;
  }

  if (key == "f") {
    const nbMissiles = 10;

    // On tire des missiles !
    for(let i=0; i < nbMissiles; i++) {
      let x = 20+random(10);
      let y = random(height/2-5, random(height/2+5));

      let v = new Vehicle(x, y);
      vehicules.push(v);
    }
  }
}

