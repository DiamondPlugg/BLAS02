<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useUsers from './composables/useUsers';
import { hallsData } from './data/hallsData';

const route = useRoute();
const router = useRouter();
const { currentUser, authModal, login, register } = useUsers();

const halls = ref([]);
const authForm = ref({ username: '', email: '', password: '' });
const authError = ref('');

function updateHalls() {
  const saved = localStorage.getItem('studio_halls');
  halls.value = saved ? JSON.parse(saved) : [];
}

function initHalls() {
  const saved = localStorage.getItem('studio_halls');
  if (!saved || JSON.parse(saved).length === 0) {
    localStorage.setItem('studio_halls', JSON.stringify(hallsData));
  }
  updateHalls();
}

function openAuth() {
  authError.value = '';
  authForm.value = { username: '', email: '', password: '' };
  authModal.value.show = true;
  authModal.value.mode = 'login';
}

function handleAuth() {
  authError.value = '';
  let result = '';

  const { username, password, email } = authForm.value;

  // Базовая проверка полей
  if (!username || !password) {
    authError.value = 'Заполните все поля';
    return;
  }

  if (authModal.value.mode === 'reg') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      authError.value = 'Введите Email';
      return;
    }
    if (!emailPattern.test(email)) {
      authError.value = 'Некорректный формат Email';
      return;
    }
  }

  // Вызов функций из композабла
  if (authModal.value.mode === 'login') {
    result = login(username, password);
  } else {
    // Теперь register внутри себя вызовет login и вернет '' при успехе
    result = register(username, email, password);
  }

  if (result === '') {
    // Если вход/регистрация успешны
    authModal.value.show = false;
    authForm.value = { username: '', email: '', password: '' };

    // Опционально: если мы хотим после регистрации сразу кинуть человека в профиль
    if (authModal.value.mode === 'reg') {
      router.push('/');
    }
  } else {
    authError.value = result;
  }
}
function scrollToHalls() {
  const scrollAction = function () {
    setTimeout(function () {
      const el = document.getElementById('halls-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (route.path !== '/') {
    router.push('/').then(scrollAction);
  } else {
    scrollAction();
  }
}

onMounted(function () {
  initHalls();
  window.addEventListener('storage', updateHalls);
});

onUnmounted(function () {
  window.removeEventListener('storage', updateHalls);
});
</script>

<template>
  <div id="app">
    <header class="header">
      <div class="header-container">
        <router-link :to="{ name: 'home' }" class="logo">Между <span class="accent">светом</span> и тенью</router-link>

        <nav class="main-nav">
          <router-link :to="{ name: 'about' }">О нас</router-link>
          <router-link :to="{ name: 'booking' }">Забронировать</router-link>
          <router-link :to="{ name: 'certificates' }">Сертификаты</router-link>
          <a href="#" @click.prevent="scrollToHalls">Залы</a>
        </nav>

        <div class="header-actions">
          <router-link v-if="currentUser && currentUser.role === 'admin'" :to="{ name: 'admin' }" class="admin-gear">
            <img src="/setting.png" alt="Admin" class="icon-img">
          </router-link>

          <div v-if="currentUser" class="user-profile" @click="router.push('/account')">
            <div class="user-icon">
              <img src="/user.png" alt="User Profile">
            </div>
          </div>
          <button v-else class="btn-login" @click="openAuth">Войти</button>
        </div>
      </div>
    </header>

    <main>
      <router-view :halls="halls" @refresh-halls="updateHalls"></router-view>
    </main>

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-links">
          <div class="footer-col">
            <h4>Залы</h4>
            <ul>
              <li v-for="hall in halls" :key="hall.id">
                <router-link :to="'/hall/' + hall.id">{{ hall.name }}</router-link>
              </li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Информация</h4>
            <ul>
              <li><router-link :to="{ name: 'certificates' }">Подарочные сертификаты</router-link></li>
              <li><router-link :to="{ name: 'about' }">О нас</router-link></li>
              <li><router-link :to="{ name: 'privacy' }">Политика конфиденциальности</router-link></li>
              <li><router-link :to="{ name: 'offer' }">Договор оферты</router-link></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Контакты</h4>
            <ul class="contacts-list">
              <li>Адрес: Невский проспект, 2к5, г. СПб</li>
              <li>Режим: ежедневно с 8:00 до 22:00</li>
              <li>Тел: +7 (927) 506-11-06</li>
              <li>Email: support@BLAS.support</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        © "Между светом и тенью", {{ new Date().getFullYear() }}. Все права защищены.
      </div>
    </footer>

    <div v-if="authModal.show" class="modal-overlay" @click.self="authModal.show = false">
      <div class="auth-box">
        <button class="close-x" @click="authModal.show = false">×</button>
        <h2>{{ authModal.mode === 'login' ? 'Вход' : 'Регистрация' }}</h2>
        <div class="auth-form">
          <input type="text" v-model="authForm.username" placeholder="Никнейм">
          <input v-if="authModal.mode === 'reg'" type="email" v-model="authForm.email" placeholder="Email">
          <input type="password" v-model="authForm.password" placeholder="Пароль">
          <p v-if="authError" class="error-msg">{{ authError }}</p>
          <button class="btn-submit" @click="handleAuth">
            {{ authModal.mode === 'login' ? 'Войти' : 'Создать аккаунт' }}
          </button>
          <button class="btn-switch"
            @click="authModal.mode = authModal.mode === 'login' ? 'reg' : 'login'; authError = ''">
            {{ authModal.mode === 'login' ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #efede3;
  font-family: 'Inter', sans-serif;
  color: #302f2c;
}

.header {
  border-bottom: 1px solid #302f2c;
  padding: 20px 0;
  position: sticky;
  top: 0;
  background: #efede3;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 22px;
  font-weight: bold;
  text-decoration: none;
  color: #302f2c;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.accent {
  color: #800000;
}

.main-nav {
  display: flex;
  gap: 30px;
}

.main-nav a {
  text-decoration: none;
  color: #302f2c;
  font-weight: 500;
  font-size: 15px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-img {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.user-icon img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
}

.btn-login {
  background: #302f2c;
  color: #efede3;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
}

.footer {
  border-top: 1px solid #302f2c;
  padding: 60px 20px 20px;
  margin-top: 100px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.footer-links {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 40px;
}

.footer-col h4 {
  margin-bottom: 20px;
  text-transform: uppercase;
  font-size: 16px;
}

.footer-col ul {
  list-style: none;
}

.footer-col li {
  margin-bottom: 10px;
}

.footer-col a {
  color: #302f2c;
  text-decoration: none;
  font-size: 14px;
  opacity: 0.8;
}

.footer-bottom {
  text-align: center;
  margin-top: 50px;
  font-size: 12px;
  opacity: 0.6;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.auth-box {
  background: #efede3;
  position: relative;
  width: 100%;
  max-width: 400px;
  padding: 50px 40px;
  text-align: center;
  border-radius: 30px;
  border: 1px solid #302f2c;
}

.close-x {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  border: none;
  background: none;
  cursor: pointer;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.auth-form input {
  padding: 14px 20px;
  border: 1px solid #302f2c;
  border-radius: 25px;
  background: transparent;
  outline: none;
}

.btn-submit {
  background: #302f2c;
  color: #efede3;
  padding: 14px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
}

.btn-switch {
  background: none;
  border: none;
  text-decoration: underline;
  font-size: 13px;
  cursor: pointer;
  color: #666;
  margin-top: 10px;
}

.error-msg {
  color: #800000;
  font-size: 13px;
}
</style>