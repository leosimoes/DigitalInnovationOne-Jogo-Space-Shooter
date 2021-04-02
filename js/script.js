//******************* Variáveis e constantes globais *******************//
const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;


//*************************** Funções do jogo ***************************//


// Função de movimentação da nave
const flyShip = (event) => {
    if(event.key ==='ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if(event.key === 'ArrowDown'){
        event.preventDefault();
        moveDown();
    } else if(event.key === " "){
        event.preventDefault();
        fireLaser();
    }
}

// Função de subir a nave
const moveUp = () => {
    const topPosition = window.getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === '0px'){
        return;
    } else{
        let position = parseInt(topPosition);
        position -= 50;
        yourShip.style.top = `${position}px`;
    }
}

// Função de descer a nave
const moveDown = () => {
    const topPosition = window.getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === '500px'){
        return;
    } else{
        let position = parseInt(topPosition);
        position += 50;
        yourShip.style.top = `${position}px`;
    }
}

// Função de  de criar laser
const fireLaser = () => {
    const laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

// Função auxiliar para criar o laser
const createLaserElement = () => {
    const xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    const yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    const newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}

// Função de movimentar o laser
const moveLaser = (laser) => {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        // Compara se cada alien foi atingido, se sim, troca o src da imagem
        aliens.forEach((alien) => {
            if(checkLaserCollision(laser, alien)){
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        })

        if(xPosition === 340){
            laser.remove();
        }else{
            laser.style.left = `${xPosition+8}px`;
        }
    }, 10);
}

// Função de criar aliens
const createAliens = () => {
    let newAlien = document.createElement('img');
    const indexSprite = Math.floor(Math.random()*aliensImg.length);
    let alienSprite = aliensImg[indexSprite];
    //let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //sorteio de imagens
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    const topNewAlien = Math.floor(Math.random()*330)+30;
    newAlien.style.top = `${topNewAlien}px`;
    //newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

// Função de  movimentar os inimigos
const moveAlien = (alien) => {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 50) {
            if(Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);
}


// Função de verificar colisão
const checkLaserCollision = (laser, alien) => {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 40;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;
    if(laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if(laserTop <= alienTop && laserTop >= alienBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

// Função de início de jogo
const playGame = () => {
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);

}

// Função de fim de jogo
const gameOver = () => {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) =>{
        alien.remove();
    });
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
       alert('Game over!');
       yourShip.style.top = '250px';
       startButton.syle.display = 'block';
       instructionsText.syle.display = 'block'; 
    });
}

// Iniciar do jogo
startButton.addEventListener('click', (event) => { 
    playGame();
})