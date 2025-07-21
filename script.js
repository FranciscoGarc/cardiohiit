// --- ELEMENTOS DEL DOM ---
const startScreen = document.getElementById('start-screen');
const workoutScreen = document.getElementById('workout-screen');
const finishScreen = document.getElementById('finish-screen');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

const exerciseNameEl = document.getElementById('exercise-name');
const nextExerciseLabel = document.getElementById('next-exercise-label');
const timerDisplayEl = document.getElementById('timer-display');
const timerProgressEl = document.getElementById('timer-progress');
const CIRCUMFERENCE = 2 * Math.PI * 45; // ~283

const add10sBtn = document.getElementById('add-10s-btn');
const pauseResumeBtn = document.getElementById('pause-resume-btn');
const endBtn = document.getElementById('end-btn');

// --- DEFINICIÓN DE LA RUTINA ---
const routine = [
    { name: "Movilidad Articular Dinámica", duration: 60, type: "warmup" },
    { name: "Jumping Jacks Suaves", duration: 30, type: "warmup" },
    { name: "Saltos de tijera hacia delante", duration: 30, type: "warmup" },
    { name: "Rotación de brazos", duration: 30, type: "warmup" },
    { name: "Marcha en el Lugar", duration: 30, type: "warmup" },
    { name: "Círculos de Cadera", duration: 30, type: "warmup" },
    { name: "Círculos de Rodillas", duration: 30, type: "warmup" },
    { name: "Círculos de Tobillos", duration: 30, type: "warmup" },
    { name: "Estocadas con giro de torso", duration: 30, type: "warmup" },

    { name: "Burpees", duration: 40, type: "exercise" },
    { name: "Descanso Activo", duration: 20, type: "rest" },
    { name: "Sentadilla con salto", duration: 40, type: "exercise" },
    { name: "Descanso Activo", duration: 20, type: "rest" },
    { name: "Mountain Climbers", duration: 40, type: "exercise" },
    { name: "Descanso Activo", duration: 20, type: "rest" },
    { name: "Rodillas al Pecho", duration: 40, type: "exercise" },
    { name: "Descanso Completo", duration: 60, type: "break" },

    { name: "Saltos de caja", duration: 40, type: "exercise" },
    { name: "Descanso Activo", duration: 20, type: "rest" },
    { name: "Flexiones", duration: 40, type: "exercise" },
    { name: "Descanso Activo", duration: 20, type: "rest" },
    { name: "Puentes de Glúteo", duration: 40, type: "exercise" },
    { name: "Descanso Activo", duration: 20, type: "rest" },
    { name: "Plancha Lateral", duration: 20, type: "exercise" },
    { name: "Plancha Lateral", duration: 20, type: "exercise" },
    { name: "Descanso Completo", duration: 60, type: "break" },

    { name: "Abdominales de Bicicleta", duration: 40, type: "exercise" },
    { name: "Descanso Activo", duration: 20, type: "rest" },
    { name: "Elevación de Piernas", duration: 40, type: "exercise" },
    { name: "Descanso Activo", duration: 20, type: "rest" },
    { name: "Russian twists", duration: 40, type: "exercise" },
    { name: "Descanso Activo", duration: 20, type: "rest" },
    { name: "Plancha", duration: 40, type: "exercise" },
    { name: "Descanso Completo", duration: 60, type: "break" },

    { name: "Flutter kicks", duration: 40, type: "exercise" },
    { name: "Descanso Activo", duration: 20, type: "rest" },
    { name: "Sentadilla con Salto", duration: 40, type: "exercise" },
    { name: "Descanso Activo", duration: 20, type: "rest" },
    { name: "Spider-man planks", duration: 40, type: "exercise" },
    { name: "Descanso Activo", duration: 20, type: "rest" },
    { name: "Talones al Glúteo", duration: 40, type: "exercise" },
    { name: "Descanso Completo", duration: 60, type: "break" },

    { name: "Inchworm to push-up", duration: 40, type: "exercise" },
    { name: "Descanso Activo", duration: 20, type: "rest" },
    { name: "Skater jumps", duration: 40, type: "exercise" },
    { name: "Descanso Activo", duration: 20, type: "rest" },
    { name: "Plancha con Toques de Hombro", duration: 40, type: "exercise" },
    { name: "Descanso Activo", duration: 20, type: "rest" },
    { name: "Jumping Jacks", duration: 40, type: "exercise" },
    { name: "Descanso Completo", duration: 60, type: "break" },

    { name: "Marcha Suave o Caminata Lenta", duration: 120, type: "cooldown" },
    { name: "Estiramiento de Cuádriceps", duration: 60, type: "cooldown" },
    { name: "Estiramiento de Isquiotibiales", duration: 60, type: "cooldown" },
    { name: "Estiramiento de Pecho en Marco de Puerta", duration: 30, type: "cooldown" },
    { name: "Estiramiento de Hombros y Tríceps", duration: 60, type: "cooldown" },
    { name: "Estiramiento de Gemelos", duration: 60, type: "cooldown" }
];

// --- ESTADO DE LA APLICACIÓN ---
let currentStepIndex = 0;
let timeLeft = 0;
let initialDuration = 0;
let timerInterval = null;
let isPaused = false;

// --- SINTETIZADOR DE SONIDO ---
let synth;

function setupAudio() {
    if (!synth) {
        synth = new Tone.Synth().toDestination();
    }
}

function playSound(note, duration) {
    if (synth) {
        synth.triggerAttackRelease(note, duration);
    }
}

function skipWarmup() {
    // Busca el primer índice cuyo tipo no sea "warmup"
    const nextIndex = routine.findIndex(step => step.type !== "warmup");
    if (nextIndex !== -1) {
        currentStepIndex = nextIndex;
        loadStep(currentStepIndex);
    }
}

// --- LÓGICA DEL TEMPORIZADOR ---

function startWorkout() {
    // Se necesita un gesto del usuario para iniciar el audio context
    setupAudio();
    Tone.start();

    currentStepIndex = 0;
    isPaused = false;
    startScreen.classList.add('hidden');
    finishScreen.classList.add('hidden');
    workoutScreen.classList.remove('hidden');
    pauseResumeBtn.textContent = 'Pausar';
    loadStep(currentStepIndex);
}

function loadStep(index) {
    if (index >= routine.length) {
        finishWorkout();
        return;
    }

    const step = routine[index];
    timeLeft = step.duration;
    initialDuration = step.duration;

    // Oculta el botón si ya no es calentamiento
    const skipWarmupBtn = document.getElementById('skip-warmup-btn');
    if (step.type !== "warmup") {
        skipWarmupBtn.style.display = "none";
    } else {
        skipWarmupBtn.style.display = "block";
    }

    timerProgressEl.style.strokeDasharray = CIRCUMFERENCE;
    timerProgressEl.style.strokeDashoffset = 0;

    updateUIForStep(step, index);
    startTimer();
    playSound("C5", "0.1");
}

function startTimer() {
    clearInterval(timerInterval); // Limpiar cualquier intervalo anterior
    timerInterval = setInterval(() => {
        if (isPaused) return;

        timeLeft--;
        updateTimerDisplay();

        // Sonidos de cuenta regresiva
        if (timeLeft > 0 && timeLeft <= 3) {
            playSound("C4", "0.1");
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            currentStepIndex++;
            loadStep(currentStepIndex);
        }
    }, 1000);
}

function togglePauseResume() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseResumeBtn.textContent = 'Reanudar';
        pauseResumeBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
        pauseResumeBtn.classList.add('bg-green-500', 'hover:bg-green-600');
    } else {
        pauseResumeBtn.textContent = 'Pausar';
        pauseResumeBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
        pauseResumeBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
    }
}

function add10Seconds() {
    timeLeft += 10;
    if (timeLeft > initialDuration) {
        // Si al añadir tiempo superamos la duración inicial, reseteamos la barra de progreso
        initialDuration = timeLeft;
    }
    updateTimerDisplay();
}

function endWorkout() {
    clearInterval(timerInterval);
    workoutScreen.classList.add('hidden');
    finishScreen.classList.remove('hidden');
    playSound("C6", "0.2");
}

function resetWorkout() {
    finishScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

// --- ACTUALIZACIONES DE UI ---

function updateUIForStep(step, index) {
    exerciseNameEl.textContent = step.name;

    const nextStep = routine[index + 1];
    if (nextStep) {
        nextExerciseLabel.textContent = `Siguiente: ${nextStep.name}`;
    } else {
        nextExerciseLabel.textContent = '¡Último ejercicio!';
    }

    // Colorear círculo según tipo de ejercicio
    const colors = {
        exercise: '#22d3ee', // cyan-400
        rest: '#34d399', // emerald-400
        break: '#f59e0b', // amber-500
        warmup: '#a78bfa', // violet-400
        cooldown: '#60a5fa', // blue-400
        stretch: '#60a5fa'
    };
    timerProgressEl.style.stroke = colors[step.type] || '#ffffff';

    updateTimerDisplay();
}

function updateTimerDisplay() {
    timerDisplayEl.textContent = timeLeft;
    const progress = timeLeft / initialDuration;
    const dashOffset = CIRCUMFERENCE * (1 - progress);
    timerProgressEl.style.strokeDashoffset = Math.max(0, dashOffset);
}

// --- EVENT LISTENERS ---
startBtn.addEventListener('click', startWorkout);
restartBtn.addEventListener('click', resetWorkout);
pauseResumeBtn.addEventListener('click', togglePauseResume);
add10sBtn.addEventListener('click', add10Seconds);
endBtn.addEventListener('click', endWorkout);
document.getElementById('skip-warmup-btn').addEventListener('click', skipWarmup);
