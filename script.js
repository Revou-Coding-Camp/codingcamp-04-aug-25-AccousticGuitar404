document.addEventListener('DOMContentLoaded', function() {
    // --- Dapatkan semua elemen yang dibutuhkan ---
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const modeToggleBtn = document.getElementById('mode-toggle');
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const languageSelector = document.getElementById('language-selector');

    // --- Data teks untuk berbagai bahasa ---
    const languageData = {
        id: {
            title: 'Daftar Tugas',
            placeholder: 'Tambah tugas baru...',
            themeLabel: 'Ganti Tema',
            filterText: 'Filter tugas:',
            filterAll: 'Semua',
            filterActive: 'Aktif',
            filterCompleted: 'Selesai',
            createdText: 'Dibuat:',
            completedText: 'Selesai:',
            completeBtn: 'Selesai',
            deleteBtn: 'Hapus'
        },
        en: {
            title: 'To-Do List',
            placeholder: 'Add a new task...',
            themeLabel: 'Change Theme',
            filterText: 'Filter tasks:',
            filterAll: 'All',
            filterActive: 'Active',
            filterCompleted: 'Completed',
            createdText: 'Created:',
            completedText: 'Completed:',
            completeBtn: 'Complete',
            deleteBtn: 'Delete'
        },
        de: {
            title: 'Aufgabenliste',
            placeholder: 'Neue Aufgabe hinzufügen...',
            themeLabel: 'Thema ändern',
            filterText: 'Aufgaben filtern:',
            filterAll: 'Alle',
            filterActive: 'Aktiv',
            filterCompleted: 'Erledigt',
            createdText: 'Erstellt:',
            completedText: 'Erledigt:',
            completeBtn: 'Erledigt',
            deleteBtn: 'Löschen'
        },
        ko: {
            title: '할 일 목록',
            placeholder: '새로운 할 일 추가...',
            themeLabel: '테마 변경',
            filterText: '필터:',
            filterAll: '모두',
            filterActive: '진행 중',
            filterCompleted: '완료',
            createdText: '생성됨:',
            completedText: '완료됨:',
            completeBtn: '완료',
            deleteBtn: '삭제'
        }
    };

    // --- Fungsi untuk memperbarui teks UI ---
    function updateUI(lang) {
        const data = languageData[lang];
        if (!data) return;

        document.getElementById('welcome-message').textContent = data.title;
        todoInput.placeholder = data.placeholder;
        document.querySelector('.theme-toggle-label').textContent = data.themeLabel;
        document.getElementById('filter-text').textContent = data.filterText;
        document.getElementById('filter-all').textContent = data.filterAll;
        document.getElementById('filter-active').textContent = data.filterActive;
        document.getElementById('filter-completed').textContent = data.filterCompleted;

        // Perbarui teks pada tombol yang sudah ada
        const existingTodos = todoList.querySelectorAll('li');
        existingTodos.forEach(todo => {
            const completeBtn = todo.querySelector('.complete-btn');
            const deleteBtn = todo.querySelector('.delete-btn');
            const createdSpan = todo.querySelector('.timestamps span');
            const completedSpan = todo.querySelector('.completed-time');

            if (completeBtn) completeBtn.textContent = data.completeBtn;
            if (deleteBtn) deleteBtn.textContent = data.deleteBtn;
            if (createdSpan) createdSpan.textContent = `${data.createdText} ${createdSpan.textContent.split(': ')[1]}`;
            if (completedSpan && completedSpan.textContent) {
                completedSpan.textContent = ` | ${data.completedText} ${completedSpan.textContent.split(': ')[1]}`;
            }
        });
    }
    
    // --- Simpan bahasa pilihan ke localStorage ---
    const savedLang = localStorage.getItem('language') || 'id'; // Default: Indonesia
    languageSelector.value = savedLang;
    updateUI(savedLang);

    languageSelector.addEventListener('change', function() {
        const selectedLang = this.value;
        localStorage.setItem('language', selectedLang);
        updateUI(selectedLang);
    });
    
    // --- Fitur Ganti Tema (Dark/Light Mode) ---
    modeToggleBtn.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
    });

    // --- Fungsi untuk Format Tanggal dan Waktu ---
    function formatDateTime(date) {
        const lang = languageSelector.value;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleDateString(lang, options);
    }

    // --- Fungsi untuk Filter Tugas ---
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.id.replace('filter-', '');
            filterTodos(filterType);
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    function filterTodos(filterType) {
        const todos = todoList.querySelectorAll('li');
        todos.forEach(todo => {
            const isCompleted = todo.classList.contains('completed');
            
            switch (filterType) {
                case 'all':
                    todo.style.display = 'flex';
                    break;
                case 'active':
                    if (!isCompleted) {
                        todo.style.display = 'flex';
                    } else {
                        todo.style.display = 'none';
                    }
                    break;
                case 'completed':
                    if (isCompleted) {
                        todo.style.display = 'flex';
                    } else {
                        todo.style.display = 'none';
                    }
                    break;
            }
        });
    }

    // --- Event Listener untuk To-Do List ---
    todoList.addEventListener('click', function(event) {
        if (event.target.classList.contains('complete-btn')) {
            const todoItem = event.target.closest('li');
            const todoTextElement = todoItem.querySelector('.todo-text');
            const completionTimeElement = todoItem.querySelector('.completed-time');
            const lang = languageSelector.value;
            const data = languageData[lang];
            
            todoTextElement.classList.toggle('completed');
            todoItem.classList.toggle('completed');
            
            if (todoTextElement.classList.contains('completed')) {
                const completionTime = formatDateTime(new Date());
                completionTimeElement.textContent = ` | ${data.completedText} ${completionTime}`;
            } else {
                completionTimeElement.textContent = '';
            }
        }
        if (event.target.classList.contains('delete-btn')) {
            event.target.closest('li').remove();
        }
    });
    
    // --- Event Listener untuk Form Input ---
    todoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const todoText = todoInput.value.trim();

        if (todoText !== '') {
            const now = new Date();
            const creationTime = formatDateTime(now);
            const lang = languageSelector.value;
            const data = languageData[lang];

            const listItem = document.createElement('li');
            
            const todoDetails = document.createElement('div');
            todoDetails.innerHTML = `
                <span class="todo-text">${todoText}</span>
                <div class="timestamps">
                    <span>${data.createdText} ${creationTime}</span>
                    <span class="completed-time"></span>
                </div>
            `;
            
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'buttons-container';

            const completeBtn = document.createElement('button');
            completeBtn.textContent = data.completeBtn;
            completeBtn.className = 'complete-btn';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = data.deleteBtn;
            deleteBtn.className = 'delete-btn';
            
            buttonsContainer.appendChild(completeBtn);
            buttonsContainer.appendChild(deleteBtn);
            
            listItem.appendChild(todoDetails);
            listItem.appendChild(buttonsContainer);

            todoList.appendChild(listItem);
            
            todoInput.value = '';
        }
    });
});
