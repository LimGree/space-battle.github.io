var GAME = {
  width: screen.width * 0.3,
  height: screen.height * 0.8,
  background: '#010352',
  difficulty: 0.1,
  colon: 7,
  stroke: 10
};


var canvas = document.getElementById("canvas");
canvas.width = GAME.width;
canvas.height = GAME.height;
var canvasContext = canvas.getContext("2d");
var speed = {
  x: [-2, -1, 0, 1, 2],
  y: [2, 3, 4, 5]
};


var plane = new Image();
plane.src = './img/plane.png';
var enemy_1 = new Image();
var bg = new Image();
bg.src = "./img/cos.png";
var fire = new Image();
fire.src = "./img/plane1.png"
var PLANE = {
  x: 175,
  y: GAME.height - 150,
  xDirection: 4,
  yDirection: 4,
  image: plane,
  width: GAME.width / 10,
  height: GAME.height / 15
};
var LAZER = {
  x: PLANE.x + PLANE.width / 5,
  y: PLANE.y,
  width: PLANE.width / 6,
  height: 0,
}


let enemies = [];

function pre_createEnemies(numColl, numStr) {
  for (let x = 0; x < numColl; x++) {
    for (let y = 1; y < numStr; y++) {
      var spaceDif = GAME.difficulty * 10 - 1;
      var listEnemy = ["./img/1.png", "./img/2.png", "./img/3.png", "./img/4.png", "./img/5.png"];
      if (spaceDif < 4) {
        var k = Math.floor(Math.random() * spaceDif);
      } else if ((spaceDif >= 4) && (spaceDif < 11)) {
        var k = Math.floor(Math.random() * (4 - (spaceDif - 4)) + (spaceDif - 4));
      } else {
        var k = 4;
      }
      console.log(k)
      var enemy = {
        x: ((GAME.width - (GAME.width / 10 * numColl + GAME.width / 40 * (numColl - 1))) / 2) + x * (GAME.width / 10 + GAME.width / 40),
        y: y * (-GAME.height / 15 - GAME.height / 50),
        width: GAME.width / 10,
        height: GAME.height / 15,
        image: new Image(),
        speed: 1,
        health: k + 1,
      };
      enemy.image.src = listEnemy[k];
      enemies.push(enemy);
    }
  }
}
function createEnemies() {

  if (GAME.difficulty < 1) {
    pre_createEnemies(GAME.colon, GAME.stroke * GAME.difficulty);
  } 
  if (GAME.difficulty >=1) {
    pre_createEnemies(GAME.colon, GAME.stroke + 1);
  }
}
function removeRandomElements(array, n) {
  var length = array.length;
  if (n >= length) {
    array.length = 0;
  } else {
    for (let i = 0; i < n; i++) {
      var index = Math.floor(Math.random() * length);
      array.splice(index, 1);
    }
  }
}

function drawEnemies() {
  enemies.forEach(enemy => canvasContext.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height));
}

function moveEnemiesDown() {
  if (enemies.length === 0) {
    GAME.difficulty += 0.1;
    createEnemies();
    removeRandomElements(enemies, Math.floor((Math.random() * enemies.length - 1)));
  }
  for (var enemy of enemies) {
    enemy.y += enemy.speed;
    if ((enemy.y > canvas.height) && (enemies.length !== 0)) {
      enemy.y = -enemy.height;
      enemies = []
      createEnemies();
      removeRandomElements(enemies, Math.floor((Math.random() * enemies.length - 1)));
    }

  }
}

canvas.addEventListener('mousemove', onCanvasMouseMove);
document.addEventListener("mousedown", handleMouseClick);

function onCanvasMouseMove(event) {
  PLANE.x = event.clientX - PLANE.width / 1.5;
  PLANE.y = event.clientY - PLANE.height * 0.5;
  clampPosition();
}
function clampPosition() {
  if (PLANE.x < 0) {
    PLANE.x = 0;
  }
  if (PLANE.y < 0) {
    PLANE.y = 0;
  }
  if ((PLANE.x + PLANE.width) > GAME.width) {
    PLANE.x = GAME.width - PLANE.width;
  }
  if ((PLANE.y + PLANE.height) > GAME.height) {
    PLANE.y = GAME.height - PLANE.height;
  }
}


function drawFrame() {
  canvasContext.clearRect(0, 0, GAME.width, GAME.height);
  drawBackground();
  drawEnemies();
  moveEnemiesDown();
  drawPlane();
  drawBullets();
  drawLazer();
  updateLazer();
  requestAnimationFrame(drawFrame);

}

function drawBackground() {
  canvasContext.drawImage(bg, 0, 0, GAME.width, GAME.height);
}

function drawPlane() {
  canvasContext.drawImage(PLANE.image, PLANE.x, PLANE.y, PLANE.width, PLANE.height);
}

function play() {
  drawFrame();
}
let bullets = [];

function handleMouseClick(event) {
  if (event.button === 0) {
    const bullet = {
      x: PLANE.x + 2,
      y: PLANE.y,
      width: 44,
      height: 12,
      speed: 10,
      image: new Image(),
    };
    bullet.image.src = "./img/plane1.png";
    bullets.push(bullet);
  }
}
function drawBullets() {
  bullets.forEach((bullet) => {
    bullet.y -= bullet.speed;
    canvasContext.drawImage(bullet.image, bullet.x, bullet.y, bullet.width, bullet.height);
    enemies.forEach((enemy, index) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        if (enemy.health === 1) {
          enemies.splice(index, 1);
        }
        enemy.health -= 1;
        bullets.splice(bullets.indexOf(bullet), 1);
      }
    });
  });
}

function drawLazer() {
  canvasContext.fillStyle = "lime";
  canvasContext.fillRect(LAZER.x, LAZER.y, LAZER.width, LAZER.height);
}
function updateLazer() {
  enemies.forEach((enemy, index) => {
    if ( LAZER.x < enemy.x + enemy.width &&
      LAZER.x + LAZER.width > enemy.x){
        if (enemy.health < 0) {
          enemies.splice(index, 1);
        }
        enemy.health -= 0.25
    }
  })
  LAZER.height = GAME.height - GAME.height - LAZER.y;
  LAZER.x = PLANE.x + PLANE.width / 2.25;
  LAZER.y = PLANE.y;

}
play();
