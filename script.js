// ============================================
//   VALENTINE MEGA WOW - JAVASCRIPT COMPLET
// ============================================

// ============ CONFIGURATION ============
const SECRET_CODE = "22498201711";
const WEDDING_DATE = new Date("2026-07-30T00:00:00");

// Messages d'amour pour "Cherche et Trouve"
const LOVE_MESSAGES = [
    "Chaque kilomètre qui nous sépare ne fait que renforcer mon amour pour toi. Tu es ma force, même à distance.",
    "Dans un monde de 8 milliards de personnes, c'est toi que mon cœur a choisi. C'est toi, ma 224, mon unique.",
    "Tu n'es pas juste mon amour, tu es mon avenir, mon rêve devenu réalité, ma raison de sourire chaque matin.",
    "Les meilleurs moments de ma vie sont ceux passés avec toi, et les plus beaux sont encore à venir.",
    "Je t'ai aimée hier, je t'aime aujourd'hui, et je t'aimerai pour toujours. Tu es mon éternité."
];

// Mots pour le pendu
const HANGMAN_WORDS = [
    { word: "TIRAMISU", hints: [
        "Ton cadeau préféré que je t'ai offert 🎁",
        "C'est sucré et italien 🇮🇹",
        "Tu en as mangé le 30/11/2025"
    ]},
    { word: "AMOUR", hints: [
        "Ce que je ressens pour toi ❤️",
        "C'est plus fort que tout",
        "C'est en 5 lettres et commence par A"
    ]},
    { word: "MARIAGE", hints: [
        "Notre projet pour le 30 juillet 💒",
        "Un jour spécial qui nous attend",
        "Le jour où tu deviendras ma femme"
    ]}
];

// Indices pour chaque niveau de puzzle
const PUZZLE_HINTS = [
    "💎 Quelque chose de précieux t'attend...",
    "✨ Brillant comme ton sourire...",
    "👰 Pour le plus beau jour de notre vie..."
];

// Variables globales
let currentStep = 'login';
let currentPuzzleLevel = 1;
let puzzleState = [];
let draggedPiece = null;
let memoryFlippedCards = [];
let memoryMatchedPairs = 0;
let memoryAttempts = 0;
let heartsFound = 0;
let currentHangmanWord = 0;
let hangmanLives = 6;
let hangmanGuessedLetters = [];
let escapeAttempts = 0;
let carouselCurrentIndex = 0;

// ============ PARTICULES ANIMÉES ============
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 10 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        
        if (Math.random() > 0.5) {
            particle.innerHTML = Math.random() > 0.5 ? '💕' : '⭐';
            particle.style.fontSize = Math.random() * 15 + 10 + 'px';
        } else {
            particle.style.background = `rgba(255, ${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 0.5 + 0.2})`;
        }
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.pointerEvents = 'none';
        
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.animation = `float ${duration}s ${delay}s infinite ease-in-out`;
        
        particlesContainer.appendChild(particle);
    }
}

// Animation CSS pour les particules
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        50% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// ============ ÉTAPE 1: CODE SECRET ============
function checkCode() {
    const input = document.getElementById('secret-code').value.trim();
    const errorMsg = document.getElementById('error-msg');
    
    if (input.toUpperCase() === SECRET_CODE.toUpperCase()) {
        errorMsg.textContent = '';
        showCinematic();
    } else {
        errorMsg.textContent = '❌ Code incorrect. Regarde la carte dans les fleurs... 💐';
        document.getElementById('secret-code').value = '';
        
        const inputField = document.getElementById('secret-code');
        inputField.style.animation = 'shake 0.5s';
        setTimeout(() => {
            inputField.style.animation = '';
        }, 500);
    }
}

// Permettre Enter pour valider
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('secret-code');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkCode();
            }
        });
    }
});

// ============ ANIMATION CINÉMATIQUE ============
function showCinematic() {
    document.getElementById('step-login').classList.remove('active');
    const cinematic = document.getElementById('cinematic-intro');
    cinematic.classList.remove('hidden');
    
    setTimeout(() => {
        cinematic.classList.add('hidden');
        nextStep('puzzles');
        initPuzzle(1);
    }, 4000);
}

// ============ NAVIGATION ENTRE ÉTAPES ============
function nextStep(stepName) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    const nextStepElement = document.getElementById(`step-${stepName}`);
    if (nextStepElement) {
        nextStepElement.classList.add('active');
        currentStep = stepName;
        
        // Initialiser l'étape si nécessaire
        if (stepName === 'memory') initMemoryGame();
        if (stepName === 'search') initSearchGame();
        if (stepName === 'hangman') initHangman();
        if (stepName === 'messages') initFloatingMessages();
        if (stepName === 'question') initQuestion();
        if (stepName === 'reveal') initReveal();
    }
}

// ============ CONFETTIS ============
function createConfetti(count = 100) {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#1dd1a1'];
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = Math.random() * 15 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-20px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.opacity = '1';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            
            document.body.appendChild(confetti);
            
            confetti.animate([
                {
                    top: '-20px',
                    transform: `rotate(0deg)`,
                    opacity: 1
                },
                {
                    top: window.innerHeight + 50 + 'px',
                    transform: `rotate(${Math.random() * 720}deg)`,
                    opacity: 0
                }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            setTimeout(() => confetti.remove(), 5000);
        }, i * 20);
    }
}

// ============ INITIALISATION ============
window.addEventListener('DOMContentLoaded', function() {
    createParticles();
});

// ============ ÉTAPE 2: PUZZLES ÉVOLUTIFS ============
function initPuzzle(level) {
    currentPuzzleLevel = level;
    const board = document.getElementById('puzzle-board');
    const piecesContainer = document.getElementById('puzzle-pieces');
    
    // Update level indicator
    document.getElementById('current-level').textContent = `Niveau ${level}/3`;
    
    // Clear previous content
    board.innerHTML = '';
    piecesContainer.innerHTML = '';
    document.getElementById('puzzle-complete').classList.add('hidden');
    document.getElementById('puzzle-hint').classList.add('hidden');
    
    // Determine grid size
    const gridSize = level + 2; // 3x3, 4x4, 5x5
    const cellSize = level === 1 ? 120 : (level === 2 ? 100 : 85);
    
    // Set grid classes
    board.className = `puzzle-board level-${level}`;
    piecesContainer.className = `puzzle-pieces level-${level}`;
    
    // Initialize puzzle state
    puzzleState = Array(gridSize * gridSize).fill(null);
    
    // Create board cells
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'puzzle-cell';
        cell.style.width = cellSize + 'px';
        cell.style.height = cellSize + 'px';
        cell.dataset.position = i;
        
        cell.addEventListener('dragover', handleDragOver);
        cell.addEventListener('drop', handleDrop);
        cell.addEventListener('dragleave', handleDragLeave);
        
        board.appendChild(cell);
    }
    
    // Create puzzle pieces in random order
    const positions = Array.from({length: gridSize * gridSize}, (_, i) => i);
    shuffleArray(positions);
    
    const imageSize = cellSize * gridSize;
    
    positions.forEach((pos, index) => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.draggable = true;
        piece.style.width = cellSize + 'px';
        piece.style.height = cellSize + 'px';
        piece.dataset.correctPosition = pos;
        piece.dataset.currentPosition = index;
        
        const row = Math.floor(pos / gridSize);
        const col = pos % gridSize;
        piece.style.backgroundImage = `url('puzzle${level}.jpg')`;
        piece.style.backgroundSize = `${imageSize}px ${imageSize}px`;
        piece.style.backgroundPosition = `-${col * cellSize}px -${row * cellSize}px`;
        
        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragend', handleDragEnd);
        
        piecesContainer.appendChild(piece);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function handleDragStart(e) {
    if (e.target.classList.contains('placed')) return;
    draggedPiece = e.target;
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drop-active');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drop-active');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drop-active');
    
    const cell = e.currentTarget;
    const targetPosition = parseInt(cell.dataset.position);
    const correctPosition = parseInt(draggedPiece.dataset.correctPosition);
    
    if (targetPosition === correctPosition) {
        // Correct placement
        cell.appendChild(draggedPiece);
        draggedPiece.classList.add('placed');
        draggedPiece.draggable = false;
        puzzleState[targetPosition] = draggedPiece;
        
        // Check if puzzle is complete
        checkPuzzleComplete();
    } else {
        // Wrong placement - shake
        draggedPiece.style.animation = 'shake 0.5s';
        setTimeout(() => {
            draggedPiece.style.animation = '';
        }, 500);
    }
}

function checkPuzzleComplete() {
    const completed = puzzleState.every(piece => piece !== null);
    
    if (completed) {
        createConfetti(150);
        
        // Show hint
        const hintBox = document.getElementById('puzzle-hint');
        hintBox.querySelector('.hint-text').textContent = PUZZLE_HINTS[currentPuzzleLevel - 1];
        hintBox.classList.remove('hidden');
        
        setTimeout(() => {
            document.getElementById('puzzle-complete').classList.remove('hidden');
            
            // Update button text
            const btnText = currentPuzzleLevel === 3 ? 'Continuer →' : 'Niveau suivant →';
            document.getElementById('btn-next-puzzle').textContent = btnText;
        }, 1000);
    }
}

function nextPuzzleLevel() {
    if (currentPuzzleLevel < 3) {
        initPuzzle(currentPuzzleLevel + 1);
    } else {
        nextStep('memory');
    }
}

// ============ ÉTAPE 3: JEU MÉMOIRE ============
function initMemoryGame() {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    memoryFlippedCards = [];
    memoryMatchedPairs = 0;
    memoryAttempts = 0;
    
    document.getElementById('pairs-found').textContent = '0/6';
    document.getElementById('attempts').textContent = '0';
    document.getElementById('memory-complete').classList.add('hidden');
    
    // Create array of image pairs (6 images, 2 of each = 12 cards)
    const images = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
    shuffleArray(images);
    
    images.forEach((imgNum, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.image = imgNum;
        card.dataset.index = index;
        
        const front = document.createElement('div');
        front.className = 'card-front';
        front.textContent = '💝';
        
        const back = document.createElement('div');
        back.className = 'card-back';
        back.style.backgroundImage = `url('memory${imgNum}.jpg')`;
        
        card.appendChild(front);
        card.appendChild(back);
        
        card.addEventListener('click', handleCardClick);
        
        grid.appendChild(card);
    });
}

function handleCardClick(e) {
    const card = e.currentTarget;
    
    // Ignore if already flipped or matched
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Ignore if already 2 cards flipped
    if (memoryFlippedCards.length >= 2) {
        return;
    }
    
    // Flip card
    card.classList.add('flipped');
    memoryFlippedCards.push(card);
    
    // Check for match when 2 cards are flipped
    if (memoryFlippedCards.length === 2) {
        memoryAttempts++;
        document.getElementById('attempts').textContent = memoryAttempts;
        
        setTimeout(checkMemoryMatch, 800);
    }
}

function checkMemoryMatch() {
    const [card1, card2] = memoryFlippedCards;
    
    if (card1.dataset.image === card2.dataset.image) {
        // Match!
        card1.classList.add('matched');
        card2.classList.add('matched');
        memoryMatchedPairs++;
        
        document.getElementById('pairs-found').textContent = `${memoryMatchedPairs}/6`;
        
        if (memoryMatchedPairs === 6) {
            createConfetti(200);
            setTimeout(() => {
                document.getElementById('memory-complete').classList.remove('hidden');
            }, 1000);
        }
    } else {
        // No match
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    
    memoryFlippedCards = [];
}

// ============ ÉTAPE 4: CHERCHE ET TROUVE ============
function initSearchGame() {
    heartsFound = 0;
    document.getElementById('hearts-found').textContent = '0/5';
    document.getElementById('search-complete').classList.add('hidden');
    
    const composite = document.getElementById('composite-image');
    composite.innerHTML = '';
    
    // Add composite photos (these will be replaced with actual photos later)
    for (let i = 1; i <= 6; i++) {
        const img = document.createElement('img');
        img.src = `composite${i}.jpg`;
        img.className = 'composite-photo';
        img.alt = `Photo ${i}`;
        composite.appendChild(img);
    }
    
    // Add hidden hearts at random positions
    const heartPositions = [
        { top: '15%', left: '20%' },
        { top: '45%', left: '60%' },
        { top: '70%', left: '30%' },
        { top: '25%', left: '75%' },
        { top: '80%', left: '80%' }
    ];
    
    heartPositions.forEach((pos, index) => {
        const heart = document.createElement('div');
        heart.className = 'hidden-heart';
        heart.textContent = '💕';
        heart.style.top = pos.top;
        heart.style.left = pos.left;
        heart.dataset.messageIndex = index;
        
        heart.addEventListener('click', handleHeartClick);
        
        composite.appendChild(heart);
    });
}

function handleHeartClick(e) {
    const heart = e.currentTarget;
    const messageIndex = parseInt(heart.dataset.messageIndex);
    
    heart.classList.add('found');
    heartsFound++;
    
    document.getElementById('hearts-found').textContent = `${heartsFound}/5`;
    
    // Show love message
    showLoveMessage(LOVE_MESSAGES[messageIndex]);
    
    setTimeout(() => {
        heart.remove();
    }, 800);
    
    // Check if all hearts found
    if (heartsFound === 5) {
        setTimeout(() => {
            createConfetti(150);
            document.getElementById('search-complete').classList.remove('hidden');
        }, 3000);
    }
}

function showLoveMessage(message) {
    const display = document.getElementById('love-message-display');
    const messageText = document.getElementById('current-love-message');
    
    messageText.textContent = message;
    display.classList.remove('hidden');
    
    setTimeout(() => {
        display.classList.add('hidden');
    }, 3000);
}

// ============ ÉTAPE 5: PENDU ROMANTIQUE ============
function initHangman() {
    currentHangmanWord = 0;
    loadHangmanWord();
}

function loadHangmanWord() {
    const wordData = HANGMAN_WORDS[currentHangmanWord];
    hangmanLives = 6;
    hangmanGuessedLetters = [];
    
    // Update UI
    document.getElementById('hangman-level').textContent = `Mot ${currentHangmanWord + 1}/3`;
    document.getElementById('hangman-hint').textContent = wordData.hints[0];
    document.getElementById('lives-remaining').textContent = hangmanLives;
    document.getElementById('hangman-result').classList.add('hidden');
    
    // Reset hearts
    const hearts = document.querySelectorAll('.hearts-lives span');
    hearts.forEach(h => h.classList.remove('lost'));
    
    // Create word display
    const wordDisplay = document.getElementById('word-display');
    wordDisplay.innerHTML = '';
    
    for (let letter of wordData.word) {
        const box = document.createElement('span');
        box.className = 'letter-box';
        box.dataset.letter = letter;
        wordDisplay.appendChild(box);
    }
    
    // Create keyboard
    createKeyboard();
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    letters.forEach(letter => {
        const key = document.createElement('button');
        key.className = 'key';
        key.textContent = letter;
        key.dataset.letter = letter;
        key.addEventListener('click', handleLetterGuess);
        keyboard.appendChild(key);
    });
}

function handleLetterGuess(e) {
    const letter = e.currentTarget.dataset.letter;
    const key = e.currentTarget;
    
    if (hangmanGuessedLetters.includes(letter)) return;
    
    hangmanGuessedLetters.push(letter);
    key.classList.add('used');
    
    const wordData = HANGMAN_WORDS[currentHangmanWord];
    const word = wordData.word;
    
    if (word.includes(letter)) {
        // Correct guess
        key.classList.add('correct');
        
        // Reveal letters
        const boxes = document.querySelectorAll('.letter-box');
        boxes.forEach(box => {
            if (box.dataset.letter === letter) {
                box.textContent = letter;
            }
        });
        
        // Check if word complete
        checkHangmanWin();
    } else {
        // Wrong guess
        key.classList.add('wrong');
        hangmanLives--;
        
        document.getElementById('lives-remaining').textContent = hangmanLives;
        
        // Update hearts
        const hearts = document.querySelectorAll('.hearts-lives span');
        hearts[hangmanLives].classList.add('lost');
        
        // Show progressive hints
        const hintIndex = 6 - hangmanLives;
        if (hintIndex < wordData.hints.length) {
            document.getElementById('hangman-hint').textContent = wordData.hints[hintIndex];
        }
        
        // Check if game over
        if (hangmanLives === 0) {
            handleHangmanLoss();
        }
    }
}

function checkHangmanWin() {
    const boxes = document.querySelectorAll('.letter-box');
    const allRevealed = Array.from(boxes).every(box => box.textContent !== '');
    
    if (allRevealed) {
        createConfetti(100);
        
        const result = document.getElementById('hangman-result');
        const resultText = document.getElementById('hangman-result-text');
        
        resultText.textContent = '🎉 Bravo ! Tu as trouvé le mot !';
        result.classList.remove('hidden');
        
        if (currentHangmanWord === 2) {
            document.getElementById('btn-next-word').textContent = 'Continuer →';
        }
    }
}

function handleHangmanLoss() {
    const result = document.getElementById('hangman-result');
    const resultText = document.getElementById('hangman-result-text');
    const wordData = HANGMAN_WORDS[currentHangmanWord];
    
    resultText.textContent = `Le mot était : ${wordData.word}. Réessaie ! 💕`;
    result.classList.remove('hidden');
    document.getElementById('btn-next-word').textContent = 'Réessayer';
}

function nextHangmanWord() {
    if (hangmanLives === 0) {
        // Retry same word
        loadHangmanWord();
    } else if (currentHangmanWord < 2) {
        // Next word
        currentHangmanWord++;
        loadHangmanWord();
    } else {
        // All words done
        nextStep('messages');
    }
}

// ============ ÉTAPE 6: MESSAGES FLOTTANTS ============
function initFloatingMessages() {
    const container = document.getElementById('floating-messages-container');
    container.innerHTML = '';
    
    const messageTexts = [
        "Ma 224, depuis le jour où je t'ai vue, ma vie a pris tout son sens.",
        "La distance n'est rien face à la force de notre amour.",
        "Chaque jour sans toi est un jour de moins avant de te revoir.",
        "Tu es ma lumière, mon espoir, mon futur.",
        "Je t'aimerai jusqu'à mon dernier souffle, et au-delà..."
    ];
    
    const positions = [
        { top: '10%', left: '50%', transform: 'translateX(-50%)' },
        { top: '30%', left: '15%' },
        { top: '30%', right: '15%' },
        { top: '55%', left: '10%' },
        { top: '55%', right: '10%' }
    ];
    
    messageTexts.forEach((text, index) => {
        setTimeout(() => {
            const message = document.createElement('div');
            message.className = 'floating-message';
            message.style.animationDelay = `${index * 0.3}s`;
            
            // Position the message
            Object.assign(message.style, positions[index]);
            
            const p = document.createElement('p');
            p.textContent = text;
            message.appendChild(p);
            
            container.appendChild(message);
            
            // Show next button after last message
            if (index === messageTexts.length - 1) {
                setTimeout(() => {
                    document.getElementById('btn-messages-next').style.display = 'block';
                }, 1500);
            }
        }, index * 1500);
    });
}

// ============ ÉTAPE 7: LA QUESTION ============
const escapeMessages = [
    "Essaie encore 😏",
    "Tu es sûre ? 🤔",
    "Vraiment ? 😢",
    "Allez, clique sur OUI ! 💕",
    "Le bouton OUI est bien mieux ! 😊",
    "Tu me brises le cœur... 💔",
    "Dernier essai... 🥺"
];

function initQuestion() {
    const btnNo = document.getElementById('btn-no');
    escapeAttempts = 0;
    
    btnNo.addEventListener('mouseover', moveNoButton);
    btnNo.addEventListener('touchstart', function(e) {
        e.preventDefault();
        moveNoButton();
    });
}

function moveNoButton() {
    const btnNo = document.getElementById('btn-no');
    const btnYes = document.getElementById('btn-yes');
    const container = document.querySelector('.buttons-container');
    const message = document.getElementById('escape-message');
    
    // Position absolute pour bouger
    if (escapeAttempts === 0) {
        btnNo.style.position = 'absolute';
        btnNo.style.marginLeft = '0';
    }
    
    const containerRect = container.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();
    
    const maxX = containerRect.width - btnRect.width - 40;
    const maxY = containerRect.height - btnRect.height - 40;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';
    
    // NOUVEAU : Agrandir le bouton OUI progressivement
    const newScale = 1 + (escapeAttempts * 0.15);
    btnYes.style.transform = `translateY(-5px) scale(${newScale})`;
    btnYes.style.transition = 'all 0.3s ease';
    
    if (escapeAttempts < escapeMessages.length) {
        message.textContent = escapeMessages[escapeAttempts];
        escapeAttempts++;
    }
    
    if (escapeAttempts > 5) {
        btnNo.style.transform = `scale(${1 - (escapeAttempts - 5) * 0.15})`;
    }
    
    if (escapeAttempts > 8) {
        btnNo.style.opacity = '0';
        btnNo.style.pointerEvents = 'none';
        message.textContent = "Le bouton Non a disparu... Il ne reste que OUI ! 😊";
    }
}

function handleYes() {
    createConfetti(300);
    createHearts();
    setTimeout(() => {
        nextStep('video');
    }, 2000);
}

function createHearts() {
    const hearts = ['💕', '💖', '💗', '💝', '❤️', '💓'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'fixed';
            heart.style.fontSize = Math.random() * 30 + 20 + 'px';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.bottom = '-50px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '9999';
            
            document.body.appendChild(heart);
            
            heart.animate([
                {
                    bottom: '-50px',
                    opacity: 1,
                    transform: 'translateX(0) rotate(0deg)'
                },
                {
                    bottom: '110vh',
                    opacity: 0,
                    transform: `translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg)`
                }
            ], {
                duration: Math.random() * 3000 + 3000,
                easing: 'ease-out'
            });
            
            setTimeout(() => heart.remove(), 6000);
        }, i * 50);
    }
}

// ============ ÉTAPE 9: RÉVÉLATION DE LA PARURE ============
function initReveal() {
    // Phase 1: Countdown
    let count = 3;
    const countdownNum = document.getElementById('reveal-countdown-num');
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNum.textContent = count;
        } else {
            clearInterval(countdownInterval);
            showParureReveal();
        }
    }, 1000);
}

function showParureReveal() {
    // Hide phase 1
    document.getElementById('reveal-phase1').classList.add('hidden');
    
    // Show phase 2 (coffre)
    document.getElementById('reveal-phase2').classList.remove('hidden');
}

// NOUVELLE FONCTION : Ouvrir le coffre
function openChest() {
    const chest = document.getElementById('treasure-chest');
    const instruction = document.querySelector('.click-instruction');
    
    // Désactiver le clic
    chest.style.pointerEvents = 'none';
    chest.style.cursor = 'default';
    instruction.style.display = 'none';
    
    // Ouvrir le coffre
    chest.classList.add('opening');
    
    // Créer l'explosion de particules
    setTimeout(() => {
        createDiamondParticles();
    }, 1000);
    
    // Après 3 secondes, montrer le flash et la parure
    setTimeout(() => {
        // Hide phase 2
        document.getElementById('reveal-phase2').classList.add('hidden');
        
        // Show flash
        const flash = document.querySelector('.flash-overlay');
        flash.classList.add('flash');
        
        setTimeout(() => {
            flash.classList.remove('flash');
            
            // Show phase 3 (parure)
            document.getElementById('reveal-phase3').classList.remove('hidden');
            
            // Start fireworks
            startFireworks();
            
            // Start countdown
            updateCountdown();
            setInterval(updateCountdown, 1000);
            
            // Massive confetti
            createConfetti(500);
        }, 500);
    }, 3000);
}

function createDiamondParticles() {
    const container = document.querySelector('.diamond-particles');
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.textContent = '💎';
            particle.style.position = 'absolute';
            particle.style.fontSize = Math.random() * 30 + 20 + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.opacity = '0';
            particle.style.pointerEvents = 'none';
            
            container.appendChild(particle);
            
            particle.animate([
                {
                    opacity: 0,
                    transform: 'scale(0) rotate(0deg)'
                },
                {
                    opacity: 1,
                    transform: 'scale(1.5) rotate(360deg)'
                },
                {
                    opacity: 0,
                    transform: 'scale(0) rotate(720deg)'
                }
            ], {
                duration: 3000,
                easing: 'ease-in-out'
            });
            
            setTimeout(() => particle.remove(), 3000);
        }, i * 100);
    }
}

function startFireworks() {
    const fireworksContainer = document.querySelector('.fireworks');
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#1dd1a1', '#FFD700'];
    
    setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.7;
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            fireworksContainer.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = Math.random() * 100 + 50;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${tx}px, ${ty}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0, 0.9, 0.57, 1)'
            });
            
            setTimeout(() => particle.remove(), 1000);
        }
    }, 1500);
}

// ============ CARROUSEL 3D ============
function rotateCarousel(direction) {
    carouselCurrentIndex += direction;
    
    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    const totalItems = items.length;
    
    if (carouselCurrentIndex < 0) {
        carouselCurrentIndex = totalItems - 1;
    } else if (carouselCurrentIndex >= totalItems) {
        carouselCurrentIndex = 0;
    }
    
    updateCarousel();
}

function goToSlide(index) {
    carouselCurrentIndex = index;
    updateCarousel();
}

function updateCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    const totalItems = items.length;
    
    items.forEach((item, index) => {
        item.classList.remove('active', 'prev', 'next');
        
        if (index === carouselCurrentIndex) {
            item.classList.add('active');
        } else if (index === (carouselCurrentIndex - 1 + totalItems) % totalItems) {
            item.classList.add('prev');
        } else if (index === (carouselCurrentIndex + 1) % totalItems) {
            item.classList.add('next');
        }
    });
    
    dots.forEach((dot, index) => {
        if (index === carouselCurrentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// ============ COMPTE À REBOURS ============
function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;
    
    if (diff <= 0) {
        document.getElementById('countdown').innerHTML = '<p style="font-size: 36px;">🎉 C\'EST AUJOURD\'HUI ! 🎉</p>';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('countdown').innerHTML = `
        <div class="countdown-item">
            <span class="countdown-number">${days}</span>
            <span class="countdown-label">Jours</span>
        </div>
        <div class="countdown-item">
            <span class="countdown-number">${hours}</span>
            <span class="countdown-label">Heures</span>
        </div>
        <div class="countdown-item">
            <span class="countdown-number">${minutes}</span>
            <span class="countdown-label">Minutes</span>
        </div>
        <div class="countdown-item">
            <span class="countdown-number">${seconds}</span>
            <span class="countdown-label">Secondes</span>
        </div>
    `;
}



