document.addEventListener('DOMContentLoaded', function() {
    // --- Dapatkan semua elemen yang dibutuhkan ---
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const modeToggleBtn = document.getElementById('mode-toggle');
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    
    // --- Fitur Ganti Tema (Dark/Light Mode) ---
    modeToggleBtn.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
    });

    // --- Fungsi untuk Format Tanggal dan Waktu ---
    function formatDateTime(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleDateString('id-ID', options);
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
            
            todoTextElement.classList.toggle('completed');
            todoItem.classList.toggle('completed');
            
            if (todoTextElement.classList.contains('completed')) {
                const completionTime = formatDateTime(new Date());
                completionTimeElement.textContent = ` | Selesai: ${completionTime}`;
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

            const listItem = document.createElement('li');
            
            const todoDetails = document.createElement('div');
            todoDetails.innerHTML = `
                <span class="todo-text">${todoText}</span>
                <div class="timestamps">
                    <span>Dibuat: ${creationTime}</span>
                    <span class="completed-time"></span>
                </div>
            `;
            
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'buttons-container';

            const completeBtn = document.createElement('button');
            completeBtn.textContent = 'Selesai';
            completeBtn.className = 'complete-btn';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Hapus';
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