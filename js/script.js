"use strict";

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Efecto de máquina de escribir
    const initTypewriter = () => {
        const phrases = [
            "Sobre mí", 
            "Thiago Ivan Antonio Godoy", 
            "¿En qué puedo ayudarte?", 
            "¡Trabajemos juntos!"
        ];
        
        const typeElement = document.getElementById('typewriter-text');
        if (!typeElement) return;

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeWriter = () => {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typeElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typeElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let typingSpeed = isDeleting ? 46 : 100;

            if (!isDeleting && charIndex === currentPhrase.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500;
            }

            setTimeout(typeWriter, typingSpeed);
        };

        setTimeout(typeWriter, 400);
    };

    // 2. Control de Tema Oscuro / Claro
    const initTheme = () => {
        const themeToggleBtn = document.getElementById('theme-toggle');
        const bodyElement = document.body;
        
        if (!themeToggleBtn) return;

        const currentTheme = localStorage.getItem('theme');

        if (currentTheme === 'dark') {
            bodyElement.classList.add('dark-theme');
            themeToggleBtn.textContent = 'Modo Claro';
        }

        themeToggleBtn.addEventListener('click', () => {
            bodyElement.classList.toggle('dark-theme');
            
            if (bodyElement.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.textContent = 'Modo Claro';
            } else {
                localStorage.setItem('theme', 'light');
                themeToggleBtn.textContent = 'Modo Oscuro';
            }
        });
    };

    const initEmailCopyButton = () => {
        const emailBtn = document.getElementById('email-btn');
        if (!emailBtn) return;

        const realEmail = emailBtn.getAttribute('data-email');
        let isRevealed = false;

        emailBtn.addEventListener('click', () => {
            if (!isRevealed) {
                emailBtn.textContent = realEmail;
                isRevealed = true;
            } else {
                navigator.clipboard.writeText(realEmail).then(() => {
                    emailBtn.textContent = "¡Copiado!";
                    emailBtn.classList.add('copied');

                    setTimeout(() => {
                        emailBtn.textContent = realEmail;
                        emailBtn.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error("Error al copiar al portapapeles:", err);
                });
            }
        });
    };

    // 4. Animaciones al hacer scroll (Observer)
    const initObserver = () => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const gridContainers = document.querySelectorAll('.grid-container');
        gridContainers.forEach(grid => {
            const cards = grid.querySelectorAll('.card-dynamic');
            cards.forEach((card, index) => {
                card.classList.add('hidden');
                if (index % 3 === 0) card.classList.add('delay-1');
                else if (index % 3 === 1) card.classList.add('delay-2');
                else card.classList.add('delay-3');
                
                observer.observe(card);
            });
        });

        const independentElements = document.querySelectorAll('.skills-list, .sobre-mi-content, .category-title, .contact-links');
        independentElements.forEach(el => {
            el.classList.add('hidden');
            observer.observe(el);
        });
    };

    // 5. Widget de Audio
// 5. Widget de Audio
    const initAudioWidget = () => {
        const audio = document.getElementById('bg-audio');
        const toggleBtn = document.getElementById('audio-toggle');
        const audioIcon = document.getElementById('audio-icon');
        const prevBtn = document.getElementById('audio-prev');
        const nextBtn = document.getElementById('audio-next');
        const songTitle = document.getElementById('song-title');
        const progressBar = document.getElementById('audio-progress');
        const timeCurrent = document.getElementById('time-current');
        const timeTotal = document.getElementById('time-total');

        if (!audio || !toggleBtn) return;

        const playlist = [
            { title: "Chill Track", src: "./audio/mi-bendicion.mp3" },
            { title: "Focus Music", src: "./audio/mile-high.mp3" },
            { title: "Coding Synthwave", src: "./audio/running.mp3" }
        ];
        
        let currentTrack = 0;
        audio.volume = 0.3;

        const formatTime = (seconds) => {
            if (isNaN(seconds) || seconds < 0) return "0:00";
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60);
            return `${min}:${sec < 10 ? '0' : ''}${sec}`;
        };

        const updateProgressBarColor = () => {
            const max = parseFloat(progressBar.max) || 100;
            const val = parseFloat(progressBar.value) || 0;
            const percentage = (val / max) * 100;
            progressBar.style.background = `linear-gradient(to right, var(--text-main) ${percentage}%, var(--card-border) ${percentage}%)`;
        };

        const loadTrack = (index) => {
            audio.src = playlist[index].src;
            songTitle.textContent = playlist[index].title;
            
            progressBar.value = 0;
            timeCurrent.textContent = "0:00";
            updateProgressBarColor();
            
            audio.load();
        };

        loadTrack(currentTrack);

        const playAudio = () => {
            audio.play().then(() => {
                audioIcon.textContent = '❚❚';
                toggleBtn.setAttribute('aria-label', 'Pausar música');
            }).catch(e => console.error("Error al reproducir:", e));
        };

        const pauseAudio = () => {
            audio.pause();
            audioIcon.textContent = '▶';
            toggleBtn.setAttribute('aria-label', 'Reproducir música');
        };

        toggleBtn.addEventListener('click', () => {
            audio.paused ? playAudio() : pauseAudio();
        });

        const changeTrack = (direction) => {
            currentTrack = (currentTrack + direction + playlist.length) % playlist.length;
            const wasPlaying = !audio.paused;
            loadTrack(currentTrack);
            if (wasPlaying) playAudio();
        };

        prevBtn.addEventListener('click', () => changeTrack(-1));
        nextBtn.addEventListener('click', () => changeTrack(1));

    audio.addEventListener('ended', () => {
        if (currentTrack < playlist.length - 1) {
            currentTrack++;
            loadTrack(currentTrack);
            playAudio();
        } else {
            pauseAudio();
            currentTrack = 0;
            loadTrack(currentTrack);
        }
    });
        audio.addEventListener('loadedmetadata', () => {
            timeTotal.textContent = formatTime(audio.duration);
            progressBar.max = Math.floor(audio.duration);
            updateProgressBarColor();
        });

        audio.addEventListener('timeupdate', () => {
            timeCurrent.textContent = formatTime(audio.currentTime);
            if (document.activeElement !== progressBar) {
                progressBar.value = Math.floor(audio.currentTime);
                updateProgressBarColor();
            }
        });

        progressBar.addEventListener('input', () => {
            audio.currentTime = progressBar.value;
            timeCurrent.textContent = formatTime(audio.currentTime);
            updateProgressBarColor();
        });
    };

    // Inicialización general en orden
    initAudioWidget();
    initObserver();
    initTypewriter();
    initTheme();
    initEmailCopyButton();
});