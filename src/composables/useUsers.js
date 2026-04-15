import { ref } from 'vue';

// Глобальное состояние (вне функции useUsers), чтобы данные были синхронизированы между всеми компонентами
const currentUser = ref(null);
const authModal = ref({ show: false, mode: 'login' });

/**
 * Composable для управления пользователями и авторизацией.
 */
export function useUsers() {
  
  /**
   * Получает список пользователей из LocalStorage.
   * Если администратор отсутствует, создает его по умолчанию.
   */
  function getUsers() {
    const data = localStorage.getItem('studio_users');
    let users = data ? JSON.parse(data) : [];
    
    const adminExists = users.some(function (u) {
      return u.username === 'admin';
    });

    if (!adminExists) {
      users.push({
        id: Date.now(),
        username: 'admin',
        password: 'admin',
        role: 'admin',
        email: 'admin@studio.ru',
        avatar: ''
      });
      saveUsers(users);
    }
    return users;
  }

  /**
   * Сохраняет массив пользователей в LocalStorage.
   */
  function saveUsers(users) {
    localStorage.setItem('studio_users', JSON.stringify(users));
  }

  /**
   * Логика входа в систему.
   */
  function login(username, password) {
    const users = getUsers();
    const found = users.find(function (u) {
      return u.username === username && u.password === password;
    });

    if (found) {
      currentUser.value = found;
      localStorage.setItem('studio_session', JSON.stringify(found));
      return ''; 
    }
    return 'Неверный логин или пароль';
  }

  /**
   * Регистрация нового пользователя.
   */
  function register(username, email, password) {
    const users = getUsers();
    
    const isTaken = users.some(function (u) {
      return u.username === username;
    });

    if (isTaken) return 'Ник занят';

    users.push({ 
        id: Date.now(), 
        username: username, 
        email: email, 
        password: password, 
        role: 'user', 
        avatar: '' 
    });
    
    saveUsers(users);
    return ''; 
  }

  /**
   * Выход из системы.
   */
  function logout() {
    currentUser.value = null;
    localStorage.removeItem('studio_session');
  }

  // Восстановление сессии при инициализации
  const session = localStorage.getItem('studio_session');
  if (session && !currentUser.value) {
    currentUser.value = JSON.parse(session);
  }

  return { 
    currentUser, 
    authModal, 
    login, 
    register, 
    logout, 
    getUsers, 
    saveUsers 
  };
}

export default useUsers;