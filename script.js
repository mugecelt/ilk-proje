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
import { isValidTaskText, CATEGORIES, normalizeCategory } from './taskUtils.js';

// Gerekli HTML elemanlarını seç
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const categorySelect = document.getElementById('categorySelect');
const filterSelect = document.getElementById('filterSelect');

// Firestore'daki "tasks" koleksiyonuna referans
const tasksCollection = collection(db, 'tasks');

// Kategori dropdown'larını sabit kategori listesinden doldurur
function fillCategoryOptions() {
  // Görev ekleme dropdown'u: sadece kategoriler
  CATEGORIES.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });

  // Filtre dropdown'u: başta "Tümü" seçeneği + kategoriler
  const allOpt = document.createElement('option');
  allOpt.value = 'all';
  allOpt.textContent = 'Tümü';
  filterSelect.appendChild(allOpt);

  CATEGORIES.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    filterSelect.appendChild(opt);
  });
}
fillCategoryOptions();

// Tek bir görev satırı (li) oluşturur
function createTaskItem(id, text, done, category) {
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

  // Kategori etiketi (rozet)
  const categoryBadge = document.createElement('span');
  categoryBadge.classList.add('category-badge');
  categoryBadge.textContent = category;

  // Silme butonu
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✕';
  deleteBtn.addEventListener('click', () => {
    deleteDoc(doc(db, 'tasks', id));
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(categoryBadge);
  li.appendChild(deleteBtn);
  return li;
}

// Yeni görevi Firestore'a ekler
async function addTask() {
  const text = taskInput.value.trim();

  // Boş görev eklenmesini engelle
  if (!isValidTaskText(text)) return;

  // Seçilen kategori (güvenlik için normalize edilir)
  const category = normalizeCategory(categorySelect.value);

  await addDoc(tasksCollection, { text, done: false, category });

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

// Firestore'dan en son gelen görevler (filtre değişince tekrar çizmek için saklanır)
let latestTasks = [];

// Seçili filtreye göre görev listesini yeniden çizer
function renderTasks() {
  taskList.innerHTML = '';
  const selectedFilter = filterSelect.value;

  latestTasks.forEach(({ id, text, done, category }) => {
    if (selectedFilter !== 'all' && selectedFilter !== category) return;
    taskList.appendChild(createTaskItem(id, text, done, category));
  });
}

// Filtre değiştiğinde listeyi yeniden çiz
filterSelect.addEventListener('change', renderTasks);

// Firestore'daki değişiklikleri anlık dinle ve listeyi güncelle
onSnapshot(tasksCollection, (snapshot) => {
  latestTasks = snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    // Eski görevlerde category alanı olmayabilir; yoksa "Genel" say
    return {
      id: docSnap.id,
      text: data.text,
      done: data.done,
      category: normalizeCategory(data.category)
    };
  });
  renderTasks();
});
