<script setup>
import { ref, watch } from 'vue';
import useUsers from '../composables/useUsers';

const props = defineProps(['halls']);
const emit = defineEmits(['refresh-halls']);

const { showAlert } = useUsers();

const currentTab = ref('list');
const isEditing = ref(false);
const showModal = ref(false);
const hallToDelete = ref(null);
const errors = ref({});

const getEmptyForm = () => ({
    id: null,
    name: '',
    area: '',
    price: '',
    titleDescription: '',
    fullDescription: '',
    ceilingHeight: '',
    lighting: '',
    mainImage: '',
    gallery: []
});

const form = ref(getEmptyForm());

const openAdd = () => {
    isEditing.value = false;
    errors.value = {};
    form.value = getEmptyForm();
    currentTab.value = 'add';
};

const openEdit = (hall) => {
    isEditing.value = true;
    errors.value = {};
    form.value = JSON.parse(JSON.stringify(hall));
    currentTab.value = 'edit';
};

const onlyNumbers = (e, field) => {
    let val = e.target.value.replace(/[^\d.]/g, '');
    if (val.split('.').length > 2) val = val.substring(0, val.lastIndexOf('.'));
    form.value[field] = val;

    if (errors.value[field]) delete errors.value[field];
};

const saveAndSync = (newHalls) => {
    localStorage.setItem('studio_halls', JSON.stringify(newHalls));
    emit('refresh-halls');
    currentTab.value = 'list';
};

const handleSubmit = () => {
    errors.value = {};
    const f = form.value;
    let hasError = false;

    const required = [
        { k: 'name', n: 'Название' },
        { k: 'area', n: 'Площадь' },
        { k: 'price', n: 'Цена' },
        { k: 'ceilingHeight', n: 'Высота' },
        { k: 'lighting', n: 'Освещение' },
        { k: 'fullDescription', n: 'Описание' },
        { k: 'mainImage', n: 'Фото' }
    ];

    required.forEach(field => {
        if (!f[field.k] || f[field.k].toString().trim() === '') {
            errors.value[field.k] = 'Поле должно быть заполнено';
            hasError = true;
        }
    });

    if (hasError) return;

    if (parseFloat(f.area) <= 0) {
        errors.value.area = 'Должно быть больше 0';
        return;
    }

    let updatedHalls = Array.isArray(props.halls) ? [...props.halls] : [];

    if (isEditing.value) {
        const idx = updatedHalls.findIndex(h => h.id === f.id);
        if (idx !== -1) updatedHalls[idx] = { ...f };
    } else {
        const newId = updatedHalls.length ? Math.max(...updatedHalls.map(h => h.id)) + 1 : 1;
        updatedHalls.push({ ...f, id: newId });
    }

    saveAndSync(updatedHalls);
    if (showAlert) showAlert('Успех', 'Данные сохранены');
};

const confirmDelete = (id) => {
    hallToDelete.value = id;
    showModal.value = true;
};

const deleteHall = () => {
    const updatedHalls = props.halls.filter(h => h.id !== hallToDelete.value);
    saveAndSync(updatedHalls);
    showModal.value = false;
};

watch(() => form.value.name, () => delete errors.value.name);
watch(() => form.value.lighting, () => delete errors.value.lighting);
watch(() => form.value.fullDescription, () => delete errors.value.fullDescription);
watch(() => form.value.mainImage, () => delete errors.value.mainImage);
</script>

<template>
    <div class="admin-page">
        <h1 class="admin-title">Панель администратора</h1>

        <div class="admin-tabs">
            <button :class="{ active: currentTab === 'list' }" @click="currentTab = 'list'">Список залов</button>
            <button :class="{ active: currentTab === 'add' || currentTab === 'edit' }" @click="openAdd">
                Добавить зал
            </button>
        </div>

        <div class="admin-container">
            <div v-if="currentTab === 'list'">
                <h2 class="tab-title">Список залов</h2>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Площадь</th>
                            <th>Цена</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="hall in halls" :key="hall.id">
                            <td>{{ hall.id }}</td>
                            <td>{{ hall.name }}</td>
                            <td>{{ hall.area }}м²</td>
                            <td>{{ hall.price }}Р/час</td>
                            <td class="action-btns">
                                <button @click="confirmDelete(hall.id)" class="btn-del">
                                    <img src="/delete.png" alt="Удалить">
                                </button>
                                <button @click="openEdit(hall)" class="btn-edit-gear">
                                    <img src="/setting.png" alt="Редактировать">
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-else class="form-wrapper">
                <h2 class="tab-title">{{ isEditing ? 'Редактирование зала' : 'Добавить зал' }}</h2>
                <form @submit.prevent="handleSubmit" class="studio-form" novalidate>

                    <div class="input-group">
                        <label>Название</label>
                        <input v-model.trim="form.name" :class="{ 'input-error': errors.name }"
                            placeholder="Введите название">
                        <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
                    </div>

                    <div class="input-group">
                        <label>Акцентное описание (необязательно)</label>
                        <input v-model.trim="form.titleDescription" placeholder="Энергия страсти...">
                    </div>

                    <div class="input-row">
                        <div class="input-group">
                            <label>Площадь (м²)</label>
                            <input v-model="form.area" :class="{ 'input-error': errors.area }"
                                @input="onlyNumbers($event, 'area')" placeholder="0">
                            <span v-if="errors.area" class="error-text">{{ errors.area }}</span>
                        </div>
                        <div class="input-group">
                            <label>Цена (Р/час)</label>
                            <input v-model="form.price" :class="{ 'input-error': errors.price }"
                                @input="onlyNumbers($event, 'price')" placeholder="0">
                            <span v-if="errors.price" class="error-text">{{ errors.price }}</span>
                        </div>
                    </div>

                    <div class="input-row">
                        <div class="input-group">
                            <label>Высота потолков (м)</label>
                            <input v-model="form.ceilingHeight" :class="{ 'input-error': errors.ceilingHeight }"
                                @input="onlyNumbers($event, 'ceilingHeight')" placeholder="0">
                            <span v-if="errors.ceilingHeight" class="error-text">{{ errors.ceilingHeight }}</span>
                        </div>
                        <div class="input-group">
                            <label>Освещение</label>
                            <input v-model.trim="form.lighting" :class="{ 'input-error': errors.lighting }"
                                placeholder="Напр: Софтбоксы">
                            <span v-if="errors.lighting" class="error-text">{{ errors.lighting }}</span>
                        </div>
                    </div>

                    <div class="input-group">
                        <label>Полное описание</label>
                        <textarea v-model.trim="form.fullDescription" :class="{ 'input-error': errors.fullDescription }"
                            rows="4"></textarea>
                        <span v-if="errors.fullDescription" class="error-text">{{ errors.fullDescription }}</span>
                    </div>

                    <div class="input-group">
                        <label>Главное фото (URL)</label>
                        <input v-model.trim="form.mainImage" :class="{ 'input-error': errors.mainImage }"
                            placeholder="/default3.jpg">
                        <span v-if="errors.mainImage" class="error-text">{{ errors.mainImage }}</span>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-black">{{ isEditing ? 'Сохранить' : 'Добавить' }}</button>
                        <button type="button" @click="currentTab = 'list'" class="btn-outline">Отмена</button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
            <div class="modal-content">
                <h3 class="modal-text">Удалить этот зал?</h3>
                <div class="modal-buttons">
                    <button class="btn-confirm" @click="deleteHall">Удалить</button>
                    <button class="btn-cancel" @click="showModal = false">Отмена</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.input-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

.input-row {
    display: flex;
    gap: 20px;
}

.input-row .input-group {
    flex: 1;
}

.input-error {
    border-color: #800000 !important;
    background-color: #fffafa !important;
}

.error-text {
    color: #800000;
    font-size: 12px;
    margin-top: 5px;
    font-weight: bold;
}

input,
textarea {
    transition: border-color 0.2s;
}

.admin-page {
    background-color: #efede3;
    min-height: 100vh;
    padding: 40px 10%;
    font-family: sans-serif;
}

.admin-title {
    text-align: center;
    font-size: 32px;
    margin-bottom: 40px;
}

.admin-tabs {
    display: flex;
    gap: 20px;
    border-bottom: 1px solid #302f2c;
    margin-bottom: 30px;
}

.admin-tabs button {
    background: none;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 18px;
    color: #666;
}

.admin-tabs button.active {
    color: #000;
    border-bottom: 2px solid #000;
    font-weight: bold;
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.admin-table th {
    text-align: left;
    padding: 15px;
    color: #666;
    font-weight: 400;
}

.admin-table td {
    padding: 15px;
}

.btn-del img,
.btn-edit-gear img {
    width: 23px;
    height: 25px;
    cursor: pointer;
}

.form-wrapper {
    max-width: 600px;
    margin: 0 auto;
}

.tab-title {
    text-align: center;
    font-size: 28px;
    margin-bottom: 30px;
}

.input-group {
    margin-bottom: 15px;
}

.input-group label {
    display: block;
    margin-bottom: 5px;
    color: #333;
}

.input-group input,
.input-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #302f2c;
    border-radius: 12px;
    background: none;
}

.form-actions {
    display: flex;
    gap: 10px;
    margin-top: 25px;
}

.btn-black {
    flex: 1;
    background: #302f2c;
    color: #fff;
    border: none;
    padding: 15px;
    border-radius: 12px;
    cursor: pointer;
}

.btn-outline {
    flex: 1;
    border: 1px solid #302f2c;
    background: none;
    padding: 15px;
    border-radius: 12px;
    cursor: pointer;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

.modal-content {
    background: #efede3;
    padding: 40px;
    border-radius: 30px;
    border: 1px solid #000;
    text-align: center;
    max-width: 400px;
}

.modal-text {
    font-size: 24px;
    margin-bottom: 30px;
    font-weight: bold;
}

.modal-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.btn-confirm {
    background: #302f2c;
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
}

.btn-cancel {
    background: #efede3;
    border: 1px solid #302f2c;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
}
</style>