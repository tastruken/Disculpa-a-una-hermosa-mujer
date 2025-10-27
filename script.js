const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');
const questionContainer = document.getElementById('question-container');
const apologyCard = document.getElementById('apology-card');
const noMessage = document.getElementById('no-message');
const buttonWrapper = document.getElementById('button-wrapper');
const questionText = document.getElementById('question-text');

let noClickCount = 0; // Contador de clicks en "No"
let messageIndex = 0; // Índice para los mensajes de súplica
let isPleadingMode = false; // Bandera para saber si el modo súplica está activo

// Lista de mensajes para el botón 'Sí' cuando el botón 'No' es presionado
const pleadingMessages = [
    "Porfa, linda",
    "Dime que si, wapa",
    "Dale aprieta aquí <3",
    "Este botón amor",
    "Aprieta que si dale",
    "pooooooooorfa :(",
    "Yo se que quieres sjdj"
];

// Clases de tamaño para el botón 'Sí' (CRECIENTE) - 9 pasos (0 a 8)
const yesSizeClasses = [
    'py-6 text-3xl', 'py-8 text-4xl', 'py-10 text-5xl', 'py-12 text-6xl',
    'py-16 text-7xl', 'py-20 text-8xl', 'py-20 text-8xl', 'py-20 text-8xl',
    'py-20 text-8xl' 
];

// Clases de tamaño para el botón 'No' (DECRECIENTE) - 9 pasos (0 a 8)
const noSizeClasses = [
    'py-3 px-8 text-xl', 'py-2 px-6 text-lg', 'py-1 px-4 text-base', 'p-1 text-sm',
    'p-0.5 text-xs', 'p-0.5 text-xs', 'p-0.5 text-xs', 'p-0.5 text-xs',
    'p-0.5 text-xs' 
];

// Posiciones de esquina para el botón "No" (Click 10: bottom-right, Click 11: bottom-left, Click 12: top-right, Click 13: top-left)
const cornerPositions = [
    'fixed bottom-4 right-4', 
    'fixed bottom-4 left-4',  
    'fixed top-4 right-4',    
    'fixed top-4 left-4'      
];


// Función para limpiar las clases de tamaño de Tailwind
function cleanSizeClasses(element, prefix) {
    const classes = element.className.split(' ').filter(c => !c.startsWith(prefix));
    element.className = classes.join(' ');
}

// Función para limpiar las clases de posicionamiento fijo
function cleanCornerClasses(element) {
    element.classList.remove('fixed', 'bottom-4', 'right-4', 'left-4', 'top-4');
}

// Función para iniciar la animación de los corazones internos de una tarjeta
const startCardParticles = (cardElement) => {
    const particles = cardElement.querySelectorAll('.apology-heart-particle');
    particles.forEach(p => {
        // Reiniciar animación para asegurar que empiecen desde abajo de la tarjeta
        p.style.animation = 'none';
        void p.offsetWidth; // Trigger reflow
        p.style.animation = `floatSmallParticle 8s linear infinite`;
    });
};


// Función que se llama en cada click de "No"
function handlePleadAction() {
    
    noClickCount++; 

    // FASE 1: ENCOGIMIENTO/CRECIMIENTO (Clicks 1 - 9)
    if (noClickCount <= 9) {
        
        const index = noClickCount - 1; 

        // Lógica del Botón 'SÍ' (Crecer y cambiar texto)
        cleanSizeClasses(yesButton, 'py-'); cleanSizeClasses(yesButton, 'px-'); cleanSizeClasses(yesButton, 'text-');
        const currentYesSizeClass = yesSizeClasses[index];
        yesButton.classList.add(...currentYesSizeClass.split(' '));
        
        yesButton.textContent = pleadingMessages[messageIndex];
        messageIndex = (messageIndex + 1) % pleadingMessages.length; 

        // Lógica del Botón 'NO' (Encoger)
        cleanSizeClasses(noButton, 'py-'); cleanSizeClasses(noButton, 'px-'); cleanSizeClasses(noButton, 'text-'); cleanSizeClasses(noButton, 'p-');
        const currentNoSizeClass = noSizeClasses[index];
        noButton.classList.add(...currentNoSizeClass.split(' '));
        
        if (noClickCount === 9) {
            yesButton.classList.remove('button-glow');
            yesButton.classList.add('shadow-[0_0_50px_rgba(255,100,100,1)]');
        }
    
    // FASE 2: SALTO INICIAL (Click 10)
    } else if (noClickCount === 10) {
        
        noButton.classList.remove('transition-all', 'duration-300'); 
        noButton.remove(); 
        
        noButton.classList.add('fixed', 'bottom-4', 'right-4', 'z-50', 'text-xs', 'bg-red-900', 'p-1', 'shadow-2xl');
        document.body.appendChild(noButton); 
        
        questionText.textContent = "Ya no quedan opciones, elige la correcta";
    
    // FASE 3: SALTOS DE ESQUINA (Clicks 11, 12, 13)
    } else if (noClickCount > 10 && noClickCount <= 13) {
        
        const jumpIndex = noClickCount - 10; 
        
        cleanCornerClasses(noButton);
        
        const newPositionClasses = cornerPositions[jumpIndex]; 
        noButton.classList.add(...newPositionClasses.split(' '));
        noButton.classList.add('z-50', 'text-xs', 'bg-red-900', 'p-1', 'shadow-2xl'); 
        
        questionText.textContent = `Ultimos intentos Pia. (${14 - noClickCount} intentos restantes)`;
        
    // FASE 4: RENDICIÓN FINAL (Click 14+)
    } else if (noClickCount >= 14) {
        
        noButton.classList.add('hidden', 'left-[9999px]'); 
        
        cleanSizeClasses(yesButton, 'py-'); cleanSizeClasses(yesButton, 'px-'); cleanSizeClasses(yesButton, 'text-');
        
        yesButton.classList.remove('bg-rose-red', 'shadow-[0_0_50px_rgba(255,100,100,1)]');
        yesButton.classList.add('bg-deep-magenta', 'py-32', 'text-9xl', 'shadow-[0_0_100px_rgba(255,255,255,1)]', 'w-full');

        yesButton.textContent = "Me alegro, yo igual te amo <3";
        
        questionText.textContent = "Amor la decisión es obvia :)";
    }
    
    yesButton.classList.add('transition-all', 'duration-500'); 
    
}

// Función para configurar el modo súplica (se llama en el primer click de 'No')
function setupPleadingMode() {
    isPleadingMode = true;
    
    questionText.textContent = "¡Respuesta incorrecta! Wajaja";

    buttonWrapper.classList.remove('sm:space-x-8');
    
    yesButton.classList.remove('animate-pulseHeart'); 
    yesButton.classList.add('transition-all', 'duration-500'); 
    noButton.classList.add('no-shrink-transition'); 
    
    handlePleadAction(); 
}

yesButton.addEventListener('click', () => {
    questionContainer.classList.add('hidden');
    
    if (noButton.parentElement === document.body) {
        noButton.remove();
    }

    apologyCard.classList.remove('hidden');
    apologyCard.classList.add('animate-apologyEnter'); 

    startCardParticles(apologyCard);

    window.scrollTo({ top: 0, behavior: 'smooth' });
});

noButton.addEventListener('click', () => {
    if (!isPleadingMode) {
        setupPleadingMode();
    } else {
        handlePleadAction();
    }
});
