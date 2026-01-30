const welcomeScreen = document.getElementById('welcomeScreen');
const modeSelectionScreen = document.getElementById('modeSelectionScreen');
const ritualScreen = document.getElementById('ritualScreen');
const completionScreen = document.getElementById('completionScreen');

const stepTitle = document.getElementById('stepTitle');
const stepInstructions = document.getElementById('stepInstructions');
const timerDisplay = document.getElementById('timerDisplay');
const audioPlayerContainer = document.getElementById('audioPlayerContainer');
const ritualAudio = document.getElementById('ritualAudio');
const checkboxGroup = document.getElementById('checkboxGroup');
const nextStepButton = document.getElementById('nextStepButton');

const streakCount = document.getElementById('streakCount');
const currentStreakWelcome = document.getElementById('currentStreakWelcome');
const currentStreakMode = document.getElementById('currentStreakMode');
const currentStreakRitualScreen = document.getElementById('currentStreakRitualScreen');
const currentStreakCompletionScreen = document.getElementById('currentStreakCompletionScreen');

const backToModeButton = document.getElementById('backToModeButton');
const currentModeLabel = document.getElementById('currentModeLabel');
const switchModeButton = document.getElementById('switchModeButton');
const helpIcon = document.getElementById('helpIcon');
const helpTooltip = document.getElementById('helpTooltip');

let currentStep = 0;
let ritualMode = 'manual'; // 'manual' o 'audio'
let timerInterval;
let audioFinished = false;
let timeLeft = 0;
let totalDuration = 0;

const TOOLTIP_TEXT = {
    manual: "Modo manual: sigue las instrucciones, marca tus checks y usa el tiempo como referencia. Puedes avanzar cuando hayas cumplido al menos la mitad del tiempo.",
    audio: "Modo audio guiado: da clic en el audio y sigue las instrucciones. Cuando termine, toca “Siguiente paso”."
};

const ritualSteps = [
    {
        id: 'cuerpo',
        title: "Paso C - CUERPO (1 minuto)",
        instructions: "Mientras se prepara tu café o té, bebe un vaso grande de agua y haz 3 estiramientos profundos: intenta tocar el cielo y luego tus pies. Siente cómo tu cuerpo despierta.",
        duration: 60,
        checkboxes: [
            "Bebí un vaso de agua.",
            "Hice 3 estiramientos (cielo y pies)."
        ],
        audioSrc: "audios/ritual_cafe_paso_1.mp3"
    },
    {
        id: 'alma',
        title: "Paso A - ALMA (2 minutos)",
        instructions: "Siéntate en silencio y realiza 5 respiraciones profundas con la técnica 4-7-8 (inhala 4 seg, sostén 7 seg, exhala 8 seg). Siente cómo baja la tensión y tu mente se aclara.",
        duration: 120,
        checkboxes: [
            "Hice mis 5 respiraciones 4-7-8."
        ],
        audioSrc: "audios/ritual_cafe_paso_2.mp3"
    },
    {
        id: 'foco',
        title: "Paso F - FOCO (2 minutos)",
        instructions: "Abre tu cuaderno físico. Escribe tu Objetivo de Enfoque Único (OEU) para hoy: una sola tarea que, si la completas, hará que el día valga la pena. Luego léelo en voz alta y visualiza por un instante cómo se siente haberlo logrado.",
        duration: 120,
        checkboxes: [
            "Escribí mi OEU en el cuaderno.",
            "Leí mi OEU en voz alta.",
            "Visualicé cómo se siente lograrlo."
        ],
        audioSrc: "audios/ritual_cafe_paso_3.mp3"
    }
];

function showScreen(screenId) {
    welcomeScreen.classList.add('hidden');
    modeSelectionScreen.classList.add('hidden');
    ritualScreen.classList.add('hidden');
    completionScreen.classList.add('hidden');
    document.getElementById(screenId).classList.remove('hidden');
    updateStreakDisplay();
}

function startRitual() {
    showScreen('modeSelectionScreen');
}

function goBackToWelcome() {
    clearInterval(timerInterval);
    ritualAudio.pause();
    showScreen('welcomeScreen');
}

function backToModeSelection() {
    clearInterval(timerInterval);
    ritualAudio.pause();
    showScreen('modeSelectionScreen');
}

function selectMode(mode) {
    ritualMode = mode;
    currentStep = 0;
    showScreen('ritualScreen');
    updateModeUI();
    loadStep();
}

function updateModeUI() {
    const isManual = ritualMode === 'manual';
    currentModeLabel.textContent = `Modo: ${isManual ? 'Manual' : 'Guiado'}`;
    switchModeButton.textContent = isManual ? 'Cambiar a guiado' : 'Cambiar a manual';
    helpTooltip.textContent = TOOLTIP_TEXT[ritualMode];
    // Botón volver y cambiar modo solo visibles en el primer paso
    if (currentStep === 0) {
        backToModeButton.classList.remove('hidden');
        switchModeButton.disabled = false;
    } else {
        backToModeButton.classList.add('hidden');
        switchModeButton.disabled = true;
    }
}

function switchMode() {
    if (currentStep !== 0) return; // Seguridad adicional
    ritualMode = ritualMode === 'manual' ? 'audio' : 'manual';
    updateModeUI();
    loadStep();
}

function loadStep() {
    clearInterval(timerInterval);
    timerDisplay.classList.add('hidden');
    audioPlayerContainer.classList.add('hidden');
    checkboxGroup.classList.add('hidden');
    checkboxGroup.innerHTML = '';
    nextStepButton.disabled = false;
    audioFinished = false;

    if (currentStep >= ritualSteps.length) {
        completeRitual();
        return;
    }

    const step = ritualSteps[currentStep];
    stepTitle.textContent = step.title;
    stepInstructions.textContent = step.instructions;
    updateModeUI();

    // Checkboxes en ambos modos
    if (step.checkboxes && step.checkboxes.length > 0) {
        checkboxGroup.classList.remove('hidden');
        step.checkboxes.forEach((text, index) => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" id="checkbox-${currentStep}-${index}"> ${text}`;
            checkboxGroup.appendChild(label);
        });
    }

    if (ritualMode === 'audio') {
        audioPlayerContainer.classList.remove('hidden');
        ritualAudio.src = step.audioSrc; // Ajusta según tus rutas reales
        ritualAudio.currentTime = 0;
        ritualAudio.pause();
        timerDisplay.classList.add('hidden');
        nextStepButton.disabled = true;

        ritualAudio.onplay = () => {
            nextStepButton.disabled = true;
        };

        ritualAudio.onended = () => {
            audioFinished = true;
            nextStepButton.disabled = false;
        };
    } else {
        timerDisplay.classList.remove('hidden');
        startTimer(step.duration);
    }
}

function startTimer(duration) {
    clearInterval(timerInterval);
    totalDuration = duration;
    timeLeft = duration;
    timerDisplay.textContent = formatTime(timeLeft);

    nextStepButton.disabled = true;

    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft < 0) timeLeft = 0;
        timerDisplay.textContent = formatTime(timeLeft);

        const elapsed = totalDuration - timeLeft;
        const halfTimeReached = elapsed >= totalDuration / 2;

        if (halfTimeReached) {
            nextStepButton.disabled = false;
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
        .toString()
        .padStart(2, '0')}`;
}

function nextStep() {
    if (ritualMode === 'audio' && !audioFinished) {
        alert("Termina primero el audio y luego toca “Siguiente paso”.");
        return;
    }
    clearInterval(timerInterval);
    currentStep++;
    loadStep();
}

function completeRitual() {
    showScreen('completionScreen');
    updateStreak();
}

function updateStreak() {
    const lastCompletionDate = localStorage.getItem('lastCompletionDate');
    const today = new Date().toDateString();
    let streak = parseInt(localStorage.getItem('ritualStreak') || '0', 10);

    if (lastCompletionDate === today) {
        // ya estaba contado
    } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastCompletionDate === yesterday.toDateString()) {
            streak++;
        } else {
            streak = 1;
        }
        localStorage.setItem('ritualStreak', streak.toString());
        localStorage.setItem('lastCompletionDate', today);
    }
    streakCount.textContent = streak;
    updateStreakDisplay();
}

function updateStreakDisplay() {
    const streak = parseInt(localStorage.getItem('ritualStreak') || '0', 10);
    if (currentStreakWelcome) currentStreakWelcome.textContent = streak;
    if (currentStreakMode) currentStreakMode.textContent = streak;
    if (currentStreakRitualScreen) currentStreakRitualScreen.textContent = streak;
    if (currentStreakCompletionScreen) currentStreakCompletionScreen.textContent = streak;
}

// Tooltip (click/tap para mostrar/ocultar)
if (helpIcon && helpTooltip) {
    helpIcon.addEventListener('click', () => {
        helpIcon.parentElement.classList.toggle('show');
    });
}

// Inicializar racha al cargar
document.addEventListener('DOMContentLoaded', () => {
    updateStreakDisplay();
});