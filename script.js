// Firestore bağlantısı ve gerekli fonksiyonlar
import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { isValidTaskText } from './taskUtils.js';

// Gerekli HTML elemanlarını seç
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Firestore'daki "tasks" koleksiyonuna referans
const tasksCollection = collection(db, 'tasks');

// Tek bir görev satırı (li) oluşturur
function createTaskItem(id, text, done) {
  const li = document.createElement('li');
  if (done) li.classList.add('done');

  // Tamamlandı işaretleme kutusu
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = done;
  checkbox.addEventListener('change', () => {
    updateDoc(doc(db, 'tasks', id), { done: checkbox.checked });
  });

  // Görev metni
  const span = document.createElement('span');
  span.textContent = text;

  // Silme butonu
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✕';
  deleteBtn.addEventListener('click', () => {
    deleteDoc(doc(db, 'tasks', id));
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  return li;
}

// Yeni görevi Firestore'a ekler
async function addTask() {
  const text = taskInput.value.trim();

  // Boş görev eklenmesini engelle
  if (!isValidTaskText(text)) return;

  await addDoc(tasksCollection, { text, done: false });

  // Input kutusunu temizle
  taskInput.value = '';
  taskInput.focus();
}

// Ekle butonuna tıklanınca görev ekle
addBtn.addEventListener('click', addTask);

// Enter tuşuna basınca da görev eklensin
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Firestore'daki değişiklikleri anlık dinle ve listeyi güncelle
onSnapshot(tasksCollection, (snapshot) => {
  taskList.innerHTML = '';
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    taskList.appendChild(createTaskItem(docSnap.id, data.text, data.done));
  });
});
