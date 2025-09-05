const noteInput = document.getElementById('new-note-input');
const addButton = document.getElementById('add-note-button');
const notesContainer = document.getElementById('notes-container');
const toggleThemeButton = document.getElementById('toggle-theme-button');
const body = document.body;

// Array de colores disponibles para las notas (MODIFICADO: expandido de 1 a 3 colores)
const colors = ['note-yellow', 'note-blue', 'note-pink'];

function createNoteElement(text, colorClass) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note', colorClass); 
    noteDiv.textContent = text;

    // Botón de eliminar para cada nota
    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'x';

    deleteButton.addEventListener('click', function() {
        noteDiv.remove();
        saveNotes();
    });

    noteDiv.appendChild(deleteButton);
    notesContainer.appendChild(noteDiv);
    
    saveNotes();
}

// Event listener para agregar notas (MODIFICADO: agregado color aleatorio y deshabilitación del botón)
addButton.addEventListener('click', function() {
    const noteText = noteInput.value.trim();

    if(noteText !== '') {
        // Seleccionar color aleatorio del array de colores
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        createNoteElement(noteText, randomColor);
        noteInput.value = '';
        addButton.disabled = true;
    }
});

function loadNotes() {
    const storedNotes = localStorage.getItem('notes');
    
    if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        
        notes.forEach(noteData => {
            createNoteElement(noteData.text, noteData.color);
        });
    }
}

function setInitialTheme() {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        toggleThemeButton.textContent = 'Modo Claro';
    }
}

noteInput.addEventListener('input', () => {
    addButton.disabled = noteInput.value.trim() === '';
});

toggleThemeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('isDarkMode', isDarkMode);
    toggleThemeButton.textContent = isDarkMode ? 'Modo Claro' : 'Modo Oscuro';
});

notesContainer.addEventListener('dblclick', (event) => {
    const target = event.target;
    if (target.classList.contains('note')) {
        const currentText = target.textContent.slice(0, -1);
        target.textContent = '';
        target.classList.add('editing');

        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        target.appendChild(textarea);
        textarea.focus();

        function saveEdit() {
            const newText = textarea.value.trim();
            target.textContent = newText;
            target.classList.remove('editing');
            
            const deleteButton = document.createElement('span');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'x';
            target.appendChild(deleteButton);

            saveNotes();
        }
        textarea.addEventListener('blur', saveEdit);
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            }
        });
    }
});

// Función para guardar notas en localStorage (AGREGADA: función faltante que causaba errores)
function saveNotes() {
    const notes = [];
    const noteElements = notesContainer.querySelectorAll('.note');
    
    noteElements.forEach(noteElement => {
        // Remover el 'x' del botón de eliminar del texto
        const text = noteElement.textContent.slice(0, -1);
        const colorClass = Array.from(noteElement.classList).find(cls => cls.startsWith('note-'));
        notes.push({ text, color: colorClass });
    });
    
    localStorage.setItem('notes', JSON.stringify(notes));
}

notesContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.remove();
        saveNotes();
    }
});

notesContainer.addEventListener('mouseover', (event) => {
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
    }
});

notesContainer.addEventListener('mouseout', (event) => {
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
});

setInitialTheme();
loadNotes();