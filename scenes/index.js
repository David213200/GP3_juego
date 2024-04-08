import Phaser from 'phaser';

export default class initialScene extends Phaser.Scene {
    constructor() {
        super('InitialScene');
    }

    preload() {
        // Carga la imagen de fondo para la escena inicial
        this.load.image('background', '/public/assets/map&bg/index-bg.jpg');
        // Carga cualquier otro recurso necesario, como la imagen del botón "Start"
        this.load.image('startButton', '/public/assets/botones/play_btn.png');
    }

    create() {
        // Crea un campo de texto para que el jugador ingrese su nombre
        const nameInput = this.add.dom(650, 350, 'input', 'width: 300px; font: 24px Arial', 'your name');
        
        // Desactiva el campo de texto para que no tome el foco
        nameInput.node.disabled = true;

        // Verifica si hay un nombre guardado previamente en sessionStorage
        const prevName = sessionStorage.getItem('playerName');
        if (prevName) {
            nameInput.node.value = prevName; // Establece el valor del campo de texto al nombre guardado
        }

        // Crea el botón "Start" encima del fondo
        const startButton = this.add.image(750, 350, 'startButton').setInteractive();
        startButton.on('pointerdown', () => {
            const playerName = nameInput.node.value; // Obtiene el nombre ingresado por el jugador
            sessionStorage.setItem('playerName', playerName); // Guarda el nombre en sessionStorage
            this.scene.start('GameScene'); // Cambia a la escena del juego
        });
    }
}

