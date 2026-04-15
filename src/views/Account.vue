<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import useUsers from '../composables/useUsers';

const router = useRouter();
const { getUsers, saveUsers, logout, currentUser } = useUsers();

const user = ref(null);
const tempUser = ref(null);
const isEditing = ref(false);
const dateLocked = ref(false);
const showAvatarModal = ref(false);
const errors = ref({});

const init = () => {
    const session = localStorage.getItem('studio_session');
    if (!session) return router.push('/');

    const data = JSON.parse(session);
    user.value = data;
    tempUser.value = JSON.parse(JSON.stringify(data));

    if (user.value.birthDate) dateLocked.value = true;
};

onMounted(() => {
    init();
});

const startEditing = () => {
    isEditing.value = true;
    errors.value = {};
};

const handleCancel = () => {
    tempUser.value = JSON.parse(JSON.stringify(user.value));
    isEditing.value = false;
    errors.value = {};
};

const handlePhoneMask = (e) => {
    let v = e.target.value.replace(/\D/g, '');
    let r = '';
    if (v.length > 0) {
        r = '+7 ';
        if (v[0] === '7' || v[0] === '8') v = v.substring(1);
        if (v.length > 0) r += '(' + v.substring(0, 3);
        if (v.length >= 3) r += ') ' + v.substring(3, 6);
        if (v.length >= 6) r += '-' + v.substring(6, 8);
        if (v.length >= 8) r += '-' + v.substring(8, 10);
    }
    tempUser.value.phone = r.substring(0, 18);
    if (errors.value.phone) delete errors.value.phone;
};

const setAvatar = (type) => {
    tempUser.value.avatar = type;
    showAvatarModal.value = false;
};

const handleSave = () => {
    errors.value = {};
    const allUsers = getUsers();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!tempUser.value.username) errors.value.username = 'Введите никнейм';
    if (!tempUser.value.firstName) errors.value.firstName = 'Введите имя';

    if (!tempUser.value.email) {
        errors.value.email = 'Введите email';
    } else if (!emailPattern.test(tempUser.value.email)) {
        errors.value.email = 'Некорректный формат почты';
    }

    if (Object.keys(errors.value).length > 0) return;

    if (tempUser.value.username !== user.value.username) {
        if (user.value.username === 'admin') {
            errors.value.username = 'Логин администратора нельзя изменять';
            return;
        }
        if (allUsers.some(function (u) { return u.username === tempUser.value.username; })) {
            errors.value.username = 'Этот никнейм уже занят';
            return;
        }
    }

    const idx = allUsers.findIndex(function (u) {
        return u.username === user.value.username;
    });

    if (idx !== -1) {
        allUsers[idx] = { ...tempUser.value };
        saveUsers(allUsers);

        localStorage.setItem('studio_session', JSON.stringify(tempUser.value));
        user.value = JSON.parse(JSON.stringify(tempUser.value));

        if (currentUser) {
            currentUser.value = user.value;
        }

        if (user.value.birthDate) dateLocked.value = true;
        isEditing.value = false;
    }
};

const doLogout = () => {
    if (logout) {
        logout();
        router.push('/');
    }
};

const confirmDelete = () => {
    if (user.value.username === 'admin') {
        errors.value.username = 'Нельзя удалить системного администратора';
        return;
    }

    if (confirm('Удалить ваш аккаунт навсегда?')) {
        const allUsers = getUsers().filter(u => u.username !== user.value.username);
        saveUsers(allUsers);
        doLogout();
    }
};

watch(() => tempUser.value?.username, () => { delete errors.value.username });
watch(() => tempUser.value?.firstName, () => { delete errors.value.firstName });
watch(() => tempUser.value?.email, () => { delete errors.value.email });
</script>

<template>
    <div class="account-page" v-if="user">
        <div class="account-container">
            <h1 class="page-title">Личный кабинет</h1>

            <div class="profile-card">
                <div class="card-controls">
                    <button v-if="!isEditing" class="control-btn" @click="startEditing" title="Редактировать">
                        <img src="/edit.png">
                    </button>
                    <button class="control-btn" @click="doLogout" title="Выйти">
                        <img src="/exit.png">
                    </button>
                    <button class="control-btn" @click="confirmDelete" title="Удалить аккаунт">
                        <img src="/delete.png">
                    </button>
                </div>

                <div class="avatar-section">
                    <div class="avatar-circle">
                        <img v-if="tempUser.avatar === 'cat'" src="/cat.png">
                        <img v-else-if="tempUser.avatar === 'mouse'" src="/mouse.png">
                        <img v-else src="/avatar_none.png">
                    </div>
                    <button v-if="isEditing" class="change-photo-link" @click="showAvatarModal = true">
                        Сменить фото
                    </button>
                </div>

                <div class="info-section">
                    <div class="input-row">
                        <div class="input-group">
                            <label>Никнейм</label>
                            <input v-if="isEditing" type="text" v-model.trim="tempUser.username"
                                :class="{ 'input-error': errors.username }">
                            <div v-else class="view-field">{{ user.username }}</div>
                            <span v-if="errors.username" class="error-msg">{{ errors.username }}</span>
                        </div>
                        <div class="input-group">
                            <label>Имя</label>
                            <input v-if="isEditing" type="text" v-model.trim="tempUser.firstName"
                                :class="{ 'input-error': errors.firstName }">
                            <div v-else class="view-field">{{ user.firstName || '—' }}</div>
                            <span v-if="errors.firstName" class="error-msg">{{ errors.firstName }}</span>
                        </div>
                    </div>

                    <div class="input-row">
                        <div class="input-group">
                            <label>Фамилия</label>
                            <input v-if="isEditing" type="text" v-model.trim="tempUser.lastName">
                            <div v-else class="view-field">{{ user.lastName || '—' }}</div>
                        </div>
                        <div class="input-group">
                            <label>Email</label>
                            <input v-if="isEditing" type="text" v-model.trim="tempUser.email"
                                :class="{ 'input-error': errors.email }">
                            <div v-else class="view-field">{{ user.email }}</div>
                            <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
                        </div>
                    </div>

                    <div class="input-row">
                        <div class="input-group">
                            <label>Номер телефона</label>
                            <input v-if="isEditing" type="text" v-model.trim="tempUser.phone" @input="handlePhoneMask">
                            <div v-else class="view-field">{{ user.phone || '—' }}</div>
                        </div>
                        <div class="input-group">
                            <label>Дата рождения</label>
                            <input v-if="isEditing" type="text" v-model.trim="tempUser.birthDate" :disabled="dateLocked"
                                placeholder="ДД.ММ.ГГГГ">
                            <div v-else class="view-field">{{ user.birthDate || '—' }}</div>
                            <p v-if="isEditing && !dateLocked" class="red-hint">* Дату нельзя будет изменить после
                                сохранения</p>
                        </div>
                    </div>

                    <div v-if="isEditing" class="edit-actions">
                        <button class="btn-save" @click="handleSave">Сохранить</button>
                        <button class="btn-cancel" @click="handleCancel">Отмена</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showAvatarModal" class="modal-overlay" @click.self="showAvatarModal = false">
            <div class="modal-content">
                <h3>Выберите фото</h3>
                <div class="avatar-picks">
                    <div class="pick-item" @click="setAvatar('cat')">
                        <img src="/cat.png">
                        <p>Кошка</p>
                    </div>
                    <div class="pick-item" @click="setAvatar('mouse')">
                        <img src="/mouse.png">
                        <p>Мышь</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.input-error {
    border: 2px solid #800000 !important;
}

.error-msg {
    color: #800000;
    font-size: 12px;
    font-weight: bold;
    margin-top: 4px;
    padding-left: 10px;
}

.account-page {
    background: #efede3;
    min-height: 100vh;
    padding: 60px 5%;
}

.account-container {
    max-width: 900px;
    margin: 0 auto;
}

.profile-card {
    background: #efede3;
    border: 2px solid #302f2c;
    border-radius: 40px;
    display: flex;
    padding: 50px;
    gap: 50px;
    position: relative;
}

.card-controls {
    position: absolute;
    top: 25px;
    right: 25px;
    display: flex;
    gap: 15px;
}

.control-btn {
    background: none;
    border: none;
    padding: 0;
}

.control-btn img {
    cursor: pointer;
    width: 26px;
    height: 26px;
    transition: opacity 0.2s;
}

.control-btn img:hover {
    opacity: 0.7;
}

.avatar-circle {
    width: 160px;
    height: 160px;
    border-radius: 30%;
    border: 2px solid #302f2c;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.input-error {
    border-color: #800000 !important;
}

.error-msg {
    color: #800000;
    font-size: 11px;
    font-weight: bold;
    padding-left: 10px;
    margin-top: 2px;
}

.input-group input {
    padding: 12px 20px;
    border: 2px solid #302f2c;
    border-radius: 30px;
    background: transparent;
}

.btn-save {
    background: #302f2c;
    color: #efede3;
    border: none;
    padding: 14px;
    border-radius: 30px;
    cursor: pointer;
    width: 100%;
}

.account-page {
    background: #efede3;
    min-height: 100vh;
    padding: 60px 5%;
}

.account-container {
    max-width: 900px;
    margin: 0 auto;
}

.page-title {
    text-align: center;
    font-size: 36px;
    margin-bottom: 40px;
    color: #302f2c;
}

.profile-card {
    background: #efede3;
    border: 2px solid #302f2c;
    border-radius: 40px;
    display: flex;
    padding: 50px;
    gap: 50px;
    position: relative;
}

.card-controls {
    position: absolute;
    top: 25px;
    right: 25px;
    display: flex;
    gap: 15px;
}

.control-btn img {
    cursor: pointer;
    width: 26px;
    height: 26px;
}

.avatar-section {
    flex: 0 0 180px;
    text-align: center;
}

.avatar-circle {
    width: 160px;
    height: 160px;
    border-radius: 30%;
    border: 2px solid #302f2c;
    background: #efede3;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 80px;
    margin-bottom: 15px;
}

.avatar-circle img {
    width: 160px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.change-photo-link {
    background: none;
    border: none;
    text-decoration: underline;
    color: #302f2c;
    cursor: pointer;
}

.info-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.input-row {
    display: flex;
    gap: 20px;
}

.input-group {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.input-group label {
    font-weight: bold;
    margin-bottom: 5px;
    padding-left: 10px;
    font-size: 14px;
}

.view-field {
    padding: 12px 20px;
    font-size: 16px;
    border-bottom: 1.5px solid #dcdabf;
    color: #555;
}

.input-group input {
    padding: 12px 20px;
    border: 2px solid #302f2c;
    border-radius: 30px;
    background: transparent;
    font-size: 16px;
    color: #302f2c;
}

.input-group input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.red-hint {
    color: #800000;
    font-size: 12px;
    font-weight: bold;
    margin-top: 5px;
    padding-left: 10px;
}

.edit-actions {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.btn-save {
    flex: 2;
    background: #302f2c;
    color: #efede3;
    border: none;
    padding: 14px;
    border-radius: 30px;
    font-weight: bold;
    cursor: pointer;
}

.btn-cancel {
    flex: 1;
    background: #efede3;
    border: 2px solid #302f2c;
    padding: 14px;
    border-radius: 30px;
    font-weight: bold;
    cursor: pointer;
}

.btn-logout {
    background: none;
    border: none;
    text-decoration: underline;
    color: #302f2c;
    cursor: pointer;
    margin-top: 20px;
    text-align: left;
    padding: 0;
}

.avatar-picks {
    display: flex;
    gap: 40px;
    justify-content: center;
    margin-top: 20px;
}

.pick-item img {
    cursor: pointer;
    text-align: center;
    font-size: 50px;
    transition: transform 0.2s;
}

.pick-item:hover {
    transform: scale(1.2);
}

.pick-item p {
    font-size: 14px;
    font-weight: bold;
    margin: 0;
}



.modal-content {
    background: #efede3;
    padding: 40px;
    border: 2px solid #302f2c;
    border-radius: 30px;
    text-align: center;
}
</style>
