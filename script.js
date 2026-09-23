// Firestore ve Auth bağlantısı ve gerekli fonksiyonlar
import { db, auth } from './firebase-config.js';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { isValidTaskText, CATEGORIES, normalizeCategory, getAuthErrorMessage } from './taskUtils.js';

// Gerekli HTML elemanlarını seç
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const categorySelect = document.getElementById('categorySelect');
const filterSelect = document.getElementById('filterSelect');

// Giriş/kayıt ekranı elemanları
const authScreen = document.getElementById('authScreen');
const appScreen = document.getElementById('appScreen');
const userBar = document.getElementById('userBar');
const userEmailLabel = document.getElementById('userEmailLabel');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authError = document.getElementById('authError');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');

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

  // Giriş yapılmamışsa ekleme yapılamaz
  if (!auth.currentUser) return;

  // Seçilen kategori (güvenlik için normalize edilir)
  const category = normalizeCategory(categorySelect.value);

  await addDoc(collection(db, 'tasks'), {
    text,
    done: false,
    category,
    // Görevi ekleyen kullanıcının kimliği
    userId: auth.currentUser.uid
  });

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

// Aktif Firestore dinleyicisinin aboneliğini durduran fonksiyon
let unsubscribeTasks = null;

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

// Giriş yapan kullanıcının görevlerini Firestore'dan anlık dinlemeye başlar
function startTaskListener(uid) {
  const userTasksQuery = query(collection(db, 'tasks'), where('userId', '==', uid));
  unsubscribeTasks = onSnapshot(userTasksQuery, (snapshot) => {
    latestTasks = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        text: data.text,
        done: data.done,
        category: normalizeCategory(data.category)
      };
    });
    renderTasks();
  });
}

// Görev dinleyicisini durdurur ve listeyi temizler (çıkış yapıldığında)
function stopTaskListener() {
  if (unsubscribeTasks) {
    unsubscribeTasks();
    unsubscribeTasks = null;
  }
  latestTasks = [];
  taskList.innerHTML = '';
}

// Kayıt ol butonu
registerBtn.addEventListener('click', async () => {
  authError.textContent = '';
  try {
    await createUserWithEmailAndPassword(auth, authEmail.value.trim(), authPassword.value);
  } catch (err) {
    authError.textContent = getAuthErrorMessage(err.code);
  }
});

// Giriş yap butonu
loginBtn.addEventListener('click', async () => {
  authError.textContent = '';
  try {
    await signInWithEmailAndPassword(auth, authEmail.value.trim(), authPassword.value);
  } catch (err) {
    authError.textContent = getAuthErrorMessage(err.code);
  }
});

// Çıkış yap butonu
logoutBtn.addEventListener('click', () => signOut(auth));

// Giriş durumu değiştiğinde ekranları ve görev dinleyicisini yönet
onAuthStateChanged(auth, (user) => {
  authError.textContent = '';
  authEmail.value = '';
  authPassword.value = '';

  if (user) {
    authScreen.classList.add('hidden');
    userBar.classList.remove('hidden');
    appScreen.classList.remove('hidden');
    userEmailLabel.textContent = user.email;
    startTaskListener(user.uid);
  } else {
    authScreen.classList.remove('hidden');
    userBar.classList.add('hidden');
    appScreen.classList.add('hidden');
    stopTaskListener();
  }
});
