// Elementos principais
const accessScreen = document.getElementById('access-screen');
const mainContent = document.getElementById('main-content');
const accessBtn = document.getElementById('access-btn');
const accessCode = document.getElementById('access-code');
const updateMessageBtn = document.getElementById('update-message');
const messageEditor = document.getElementById('message-editor');
const messageText = document.getElementById('message-text');
const photosContainer = document.getElementById('photos-container');
const photoModal = document.getElementById('photo-modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.querySelector('.close-modal');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const nextBtn = document.getElementById('next-btn');
const volumeSlider = document.getElementById('volume-slider');
const backgroundMusic = document.getElementById('background-music');
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const countdownMessage = document.getElementById('countdown-message');

// Data do aniversário (modifique para a data correta)
const birthdayDate = new Date();
birthdayDate.setDate(birthdayDate.getDate() + 7); // Definindo para daqui a 7 dias
birthdayDate.setHours(0, 0, 0, 0);

// Músicas para o player (adicione mais se quiser)
const musicPlaylist = [
    {
        title: "Música do Nosso Amor",
        src: "https://assets.mixkit.co/music/preview/mixkit-romantic-sunset-687.mp3"
    },
    {
        title: "Canção Especial",
        src: "https://assets.mixkit.co/music/preview/mixkit-sunny-day-583.mp3"
    },
    {
        title: "Melodia Feliz",
        src: "https://assets.mixkit.co/music/preview/mixkit-cleaning-up-217.mp3"
    }
];

let currentMusicIndex = 0;

// Verificação de acesso
accessBtn.addEventListener('click', function() {
    const code = accessCode.value.trim();
    
    // Verifica se o código está correto (pode ser qualquer código ou vazio)
    // Em um caso real, você poderia definir um código específico
    if (code === "" || code === "aniversario" || code === "1234" || code === "amor") {
        // Simula o acesso via QR code
        accessScreen.classList.remove('active');
        mainContent.classList.add('active');
        
        // Inicia a música de fundo
        backgroundMusic.src = musicPlaylist[currentMusicIndex].src;
        backgroundMusic.volume = volumeSlider.value / 100;
        
        // Inicia a contagem regressiva
        startCountdown();
        
        // Carrega fotos salvas (se houver)
        loadSavedPhotos();
    } else {
        alert("Código de acesso incorreto! Use o QR code ou insira 'aniversario'");
        accessCode.value = "";
        accessCode.focus();
    }
});

// Permite pressionar Enter para acessar
accessCode.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        accessBtn.click();
    }
});

// Atualiza a mensagem personalizada
updateMessageBtn.addEventListener('click', function() {
    const newMessage = messageEditor.value.trim();
    if (newMessage) {
        messageText.textContent = newMessage;
        alert("Mensagem atualizada com sucesso!");
        
        // Salva no localStorage
        localStorage.setItem('anniversaryMessage', newMessage);
    } else {
        alert("Por favor, digite uma mensagem antes de atualizar!");
    }
});

// Carrega mensagem salva (se houver)
window.addEventListener('load', function() {
    const savedMessage = localStorage.getItem('anniversaryMessage');
    if (savedMessage) {
        messageEditor.value = savedMessage;
        messageText.textContent = savedMessage;
    }
});

// Gerenciamento de fotos
photosContainer.addEventListener('click', function(e) {
    // Verifica se o clique foi no input de upload
    if (e.target.classList.contains('photo-upload')) {
        return;
    }
    
    // Verifica se o clique foi no placeholder para adicionar foto
    if (e.target.closest('.photo-item.placeholder')) {
        const fileInput = e.target.closest('.photo-item.placeholder').querySelector('.photo-upload');
        fileInput.click();
    }
    
    // Verifica se o clique foi em uma foto existente para ampliar
    if (e.target.closest('.photo-item:not(.placeholder)')) {
        const img = e.target.closest('.photo-item').querySelector('img');
        if (img) {
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            photoModal.style.display = 'flex';
        }
    }
});

// Fecha o modal
closeModal.addEventListener('click', function() {
    photoModal.style.display = 'none';
});

// Fecha o modal clicando fora da imagem
photoModal.addEventListener('click', function(e) {
    if (e.target === photoModal) {
        photoModal.style.display = 'none';
    }
});

// Upload de fotos
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('photo-upload')) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const imgUrl = event.target.result;
                addPhotoToGrid(imgUrl);
                savePhotoToStorage(imgUrl);
            };
            
            reader.readAsDataURL(file);
        }
    }
});

// Adiciona foto à grade
function addPhotoToGrid(imgUrl) {
    // Cria novo elemento de foto
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    
    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = 'Foto especial';
    
    photoItem.appendChild(img);
    
    // Insere antes do placeholder
    photosContainer.insertBefore(photoItem, photosContainer.querySelector('.placeholder'));
    
    // Limita a 8 fotos (não incluindo o placeholder)
    const allPhotos = photosContainer.querySelectorAll('.photo-item:not(.placeholder)');
    if (allPhotos.length > 8) {
        photosContainer.removeChild(allPhotos[0]);
        // Remove também do localStorage
        removeOldestPhoto();
    }
}

// Salva foto no localStorage
function savePhotoToStorage(imgUrl) {
    let savedPhotos = JSON.parse(localStorage.getItem('anniversaryPhotos') || '[]');
    savedPhotos.push(imgUrl);
    
    // Mantém apenas as últimas 8 fotos
    if (savedPhotos.length > 8) {
        savedPhotos = savedPhotos.slice(-8);
    }
    
    localStorage.setItem('anniversaryPhotos', JSON.stringify(savedPhotos));
}

// Carrega fotos salvas
function loadSavedPhotos() {
    const savedPhotos = JSON.parse(localStorage.getItem('anniversaryPhotos') || '[]');
    
    savedPhotos.forEach(imgUrl => {
        addPhotoToGrid(imgUrl);
    });
}

// Remove a foto mais antiga do localStorage
function removeOldestPhoto() {
    let savedPhotos = JSON.parse(localStorage.getItem('anniversaryPhotos') || '[]');
    if (savedPhotos.length > 0) {
        savedPhotos.shift(); // Remove a primeira foto
        localStorage.setItem('anniversaryPhotos', JSON.stringify(savedPhotos));
    }
}

// Controle de música
playBtn.addEventListener('click', function() {
    backgroundMusic.play();
    updateMusicInfo();
});

pauseBtn.addEventListener('click', function() {
    backgroundMusic.pause();
});

nextBtn.addEventListener('click', function() {
    currentMusicIndex = (currentMusicIndex + 1) % musicPlaylist.length;
    backgroundMusic.src = musicPlaylist[currentMusicIndex].src;
    backgroundMusic.play();
    updateMusicInfo();
});

volumeSlider.addEventListener('input', function() {
    backgroundMusic.volume = volumeSlider.value / 100;
});

// Atualiza informações da música
function updateMusicInfo() {
    const musicTitle = document.getElementById('music-title');
    const musicArtist = document.getElementById('music-artist');
    
    musicTitle.textContent = musicPlaylist[currentMusicIndex].title;
    musicArtist.textContent = "Playlist especial de aniversário";
}

// Contagem regressiva
function startCountdown() {
    function updateCountdown() {
        const now = new Date().getTime();
        const timeRemaining = birthdayDate.getTime() - now;
        
        if (timeRemaining <= 0) {
            // Aniversário chegou!
            daysElement.textContent = '0';
            hoursElement.textContent = '0';
            minutesElement.textContent = '0';
            secondsElement.textContent = '0';
            countdownMessage.textContent = "Feliz Aniversário! 🎉 Que seu dia seja maravilhoso!";
            return;
        }
        
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        daysElement.textContent = days;
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Atualiza a mensagem baseada no tempo restante
        if (days === 0 && hours < 24) {
            countdownMessage.textContent = "O grande dia está quase chegando! Prepare-se para celebrar!";
        } else if (days === 1) {
            countdownMessage.textContent = "Apenas 1 dia para o seu aniversário! A ansiedade está chegando!";
        } else if (days < 7) {
            countdownMessage.textContent = `Apenas ${days} dias para o seu aniversário! Mal posso esperar!`;
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Inicializa informações da música
updateMusicInfo();
