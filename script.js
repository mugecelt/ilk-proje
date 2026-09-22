// Gerekli HTML elemanlarını seç
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// localStorage'da kullanılacak anahtar
const STORAGE_KEY = 'todoTasks';

// Kayıtlı görevleri localStorage'dan oku (yoksa boş dizi)
function loadTasks() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Görevleri diziden alıp localStorage'a kaydet
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Mevcut listedeki görevleri (DOM'dan) diziye çevirip kaydet
function persistCurrentTasks() {
  const tasks = [...taskList.children].map(li => ({
    text: li.querySelector('span').textContent,
    done: li.classList.contains('done')
  }));
  saveTasks(tasks);
}

// Tek bir görev satırı (li) oluşturur
function createTaskItem(text, done) {
  const li = document.createElement('li');
  if (done) li.classList.add('done');

  // Tamamlandı işaretleme kutusu
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = done;
  checkbox.addEventListener('change', () => {
    li.classList.toggle('done', checkbox.checked);
    persistCurrentTasks();
  });

  // Görev metni
  const span = document.createElement('span');
  span.textContent = text;

  // Silme butonu
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✕';
  deleteBtn.addEventListener('click', () => {
    li.remove();
    persistCurrentTasks();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  return li;
}

// Yeni görev ekleme fonksiyonu
function addTask() {
  const text = taskInput.value.trim();

  // Boş görev eklenmesini engelle
  if (text === '') return;

  const li = createTaskItem(text, false);
  taskList.appendChild(li);
  persistCurrentTasks();

  // Input kutusunu temizle
  taskInput.value = '';
  taskInput.focus();
}

// Sayfa açılırken kayıtlı görevleri listeye yükle
function renderSavedTasks() {
  const tasks = loadTasks();
  tasks.forEach(task => {
    taskList.appendChild(createTaskItem(task.text, task.done));
  });
}

// Ekle butonuna tıklanınca görev ekle
addBtn.addEventListener('click', addTask);

// Enter tuşuna basınca da görev eklensin
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Sayfa yüklendiğinde kayıtlı görevleri göster
renderSavedTasks();
