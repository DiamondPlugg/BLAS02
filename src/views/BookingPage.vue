<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';

const props = defineProps(['halls']);

const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const bookings = ref({});
const errorMsg = ref('');
const modal = reactive({ show: false, title: '', message: '' });

const form = reactive({
    room: '',
    roomPrice: 0,
    date: '',
    time: '',
    duration: 1,
    name: '',
    surname: '',
    phone: '',
    email: '',
    cert: ''
});

const availableRooms = computed(() => {
    if (props.halls && props.halls.length > 0) return props.halls;
    const saved = localStorage.getItem('studio_halls');
    return saved ? JSON.parse(saved) : [];
});

const totalPrice = computed(() => form.roomPrice * form.duration);

const calendarDays = computed(() => {
    const days = [];
    const firstDay = new Date(currentYear.value, currentMonth.value, 1);
    const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);

    let offset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    for (let i = offset; i > 0; i--) {
        days.push({
            day: new Date(currentYear.value, currentMonth.value, 1 - i).getDate(),
            isCurrentMonth: false
        });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
        const y = currentYear.value;
        const m = String(currentMonth.value + 1).padStart(2, '0');
        const d = String(i).padStart(2, '0');
        days.push({
            day: i,
            full: `${y}-${m}-${d}`,
            isCurrentMonth: true
        });
    }
    return days;
});

const isToday = (d) => d === new Date().toISOString().split('T')[0];

const isSlotBooked = (time) => {
    const key = `${form.room}_${form.date}`;
    return bookings.value[key] && bookings.value[key].includes(time);
};

const validateTimeOverlap = () => {
    errorMsg.value = '';
    if (!form.time || !form.date || !form.room) return true;

    const startIdx = timeSlots.indexOf(form.time);
    for (let i = 0; i < form.duration; i++) {
        const slot = timeSlots[startIdx + i];
        if (!slot || isSlotBooked(slot)) {
            errorMsg.value = 'Выбранная длительность пересекается с существующей бронью!';
            return false;
        }
    }
    return true;
};

const selectRoom = (room) => {
    form.room = room.name;
    form.roomPrice = room.price;
    validateTimeOverlap();
};

const selectDate = (dateObj) => {
    if (dateObj.isCurrentMonth) {
        form.date = dateObj.full;
        form.time = '';
        errorMsg.value = '';
    }
};

const changeMonth = (step) => {
    currentMonth.value += step;
    if (currentMonth.value > 11) {
        currentMonth.value = 0;
        currentYear.value++;
    } else if (currentMonth.value < 0) {
        currentMonth.value = 11;
        currentYear.value--;
    }
};

const resetForm = () => {
    Object.assign(form, {
        room: '', roomPrice: 0, date: '', time: '',
        duration: 1, name: '', surname: '', phone: '', email: '', cert: ''
    });
    errorMsg.value = '';
};

const showCustomModal = (title, message) => {
    modal.title = title;
    modal.message = message;
    modal.show = true;
};

const closeModal = () => {
    modal.show = false;
    if (modal.title === 'Успешно!') resetForm();
};

const submitBooking = () => {
    if (!form.room) { errorMsg.value = 'Выберите зал'; return; }
    if (!form.date) { errorMsg.value = 'Выберите дату'; return; }
    if (!form.time) { errorMsg.value = 'Выберите время'; return; }
    if (!validateTimeOverlap()) return;

    const key = `${form.room}_${form.date}`;
    if (!bookings.value[key]) bookings.value[key] = [];

    const startIdx = timeSlots.indexOf(form.time);
    for (let i = 0; i < form.duration; i++) {
        bookings.value[key].push(timeSlots[startIdx + i]);
    }

    localStorage.setItem('studio_bookings', JSON.stringify(bookings.value));
    showCustomModal('Успешно!', 'Бронирование сохранено!');
};

watch(() => props.halls, (newHalls) => {
    if (form.room && newHalls) {
        const currentRoom = newHalls.find(h => h.name === form.room);
        if (currentRoom) form.roomPrice = currentRoom.price;
    }
}, { deep: true });

onMounted(() => {
    const data = localStorage.getItem('studio_bookings');
    if (data) bookings.value = JSON.parse(data);
});
</script>

<template>
    <div class="booking-page">
        <div class="container">
            <h1 class="title">Забронировать <span class="accent">зал</span></h1>

            <div class="section-box">
                <h2 class="section-title">1. Выбор зала</h2>
                <div class="rooms-grid">
                    <button v-for="room in availableRooms" :key="room.id"
                        :class="['room-card', { active: form.room === room.name }]" @click="selectRoom(room)">
                        <div class="room-name">{{ room.name }}</div>
                        <div class="room-price">{{ room.price }} ₽ / час</div>
                    </button>
                </div>
            </div>

            <div class="main-grid">
                <div class="column">
                    <div class="section-box">
                        <h2 class="section-title">2. Дата и время</h2>

                        <div class="calendar">
                            <div class="calendar-nav">
                                <button @click="changeMonth(-1)">&#10094;</button>
                                <span>{{ monthNames[currentMonth] }} {{ currentYear }}</span>
                                <button @click="changeMonth(1)">&#10095;</button>
                            </div>
                            <div class="calendar-grid">
                                <div v-for="day in weekDays" :key="day" class="day-header">{{ day }}</div>
                                <div v-for="(date, index) in calendarDays" :key="index" :class="['day-cell', {
                                    'disabled': !date.isCurrentMonth,
                                    'selected': form.date === date.full,
                                    'is-today': isToday(date.full)
                                }]" @click="selectDate(date)">
                                    {{ date.day }}
                                </div>
                            </div>
                        </div>

                        <div class="time-controls" v-if="form.date">
                            <div class="input-group">
                                <label>Начало съемки:</label>
                                <select v-model="form.time" @change="validateTimeOverlap">
                                    <option value="">Выберите время</option>
                                    <option v-for="slot in timeSlots" :key="slot" :disabled="isSlotBooked(slot)"
                                        :value="slot">
                                        {{ slot }} {{ isSlotBooked(slot) ? '(Занято)' : '' }}
                                    </option>
                                </select>
                            </div>

                            <div class="input-group">
                                <label>Длительность (часов):</label>
                                <input type="number" v-model.number="form.duration" min="1" max="12"
                                    @input="validateTimeOverlap">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="column">
                    <div class="section-box">
                        <h2 class="section-title">3. Контактные данные</h2>
                        <div class="form-fields">
                            <input type="text" v-model.trim="form.name" placeholder="Имя *">
                            <input type="text" v-model.trim="form.surname" placeholder="Фамилия *">
                            <input type="text" v-model.trim="form.phone"
                                placeholder="Телефон (например, 79001234567) *">
                            <input type="text" v-model.trim="form.email" placeholder="Email *">
                            <input type="text" v-model.trim="form.cert" placeholder="Номер сертификата (8 цифр)">
                        </div>
                        <p v-if="errorMsg" class="error-banner">{{ errorMsg }}</p>
                    </div>

                    <div class="section-box summary">
                        <h2 class="section-title">Итог бронирования</h2>
                        <div class="summary-details">
                            <p><span>Зал:</span> {{ form.room || '—' }}</p>
                            <p><span>Дата:</span> {{ form.date || '—' }}</p>
                            <p><span>Время:</span> {{ form.time ? form.time + ' (' + form.duration + ' ч.)' : '—' }}</p>
                            <div class="divider"></div>
                            <p class="total-price">К оплате: <span>{{ totalPrice }} ₽</span></p>
                        </div>

                        <div class="footer-btns">
                            <button class="btn-secondary" @click="resetForm">Очистить</button>
                            <button class="btn-primary" @click="submitBooking">Забронировать</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-backdrop" v-if="modal.show">
            <div class="modal-window">
                <h3>{{ modal.title }}</h3>
                <p>{{ modal.message }}</p>
                <button class="btn-primary" @click="closeModal">Понятно</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.booking-page {
    background: #efede3;
    min-height: 100vh;
    padding: 60px 20px;
    color: #302f2c;
    font-family: 'Inter', sans-serif;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

.title {
    text-align: center;
    font-size: 32px;
    text-transform: uppercase;
    font-weight: 900;
    margin-bottom: 50px;
    letter-spacing: 2px;
}

.accent {
    color: #800000;
}

.section-box {
    background: #f5f4ee;
    padding: 30px;
    border-radius: 2px;
    margin-bottom: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.section-title {
    font-size: 16px;
    text-transform: uppercase;
    font-weight: 800;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
}

.section-title::before {
    content: '';
    width: 4px;
    height: 20px;
    background: #800000;
    margin-right: 15px;
}

.rooms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
}

.room-card {
    padding: 25px 15px;
    border: 1px solid #eee;
    background: white;
    cursor: pointer;
    transition: 0.2s;
    text-align: center;
}

.room-card.active {
    background: #302f2c;
    color: white;
    border-color: #302f2c;
}

.room-name {
    font-weight: bold;
    margin-bottom: 8px;
}

.room-price {
    font-size: 13px;
    opacity: 0.8;
}

.main-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.calendar {
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
}

.calendar-nav {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    background: #fafafa;
    font-weight: bold;
}

.calendar-nav button {
    border: none;
    background: none;
    cursor: pointer;
    padding: 0 10px;
    font-size: 18px;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: white;
}

.day-header {
    font-size: 11px;
    text-transform: uppercase;
    padding: 10px 0;
    text-align: center;
    background: #f5f5f5;
    font-weight: bold;
}

.day-cell {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    border: 0.5px solid #f9f9f9;
}

.day-cell.disabled {
    color: #ccc;
    cursor: default;
}

.day-cell.selected {
    background: #800000 !important;
    color: white;
    font-weight: bold;
}

.day-cell:hover:not(.disabled) {
    background: #fff5f3;
}

.is-today {
    text-decoration: underline;
    color: #800000;
    font-weight: 800;
}

.time-controls {
    margin-top: 25px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.input-group label {
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
}

.input-group select,
.input-group input {
    padding: 12px;
    border: 1px solid #ddd;
    outline: none;
}

.form-fields {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form-fields input {
    padding: 15px;
    border: 1px solid #eee;
    background: #fcfcfc;
    border-radius: 4px;
}

.error-banner {
    color: #800000;
    font-size: 13px;
    font-weight: bold;
    margin-top: 15px;
    padding: 10px;
    background: #fff1f0;
    border-left: 3px solid #800000;
}

.summary-details p {
    display: flex;
    justify-content: space-between;
    margin: 12px 0;
}

.summary-details span {
    font-weight: bold;
}

.divider {
    height: 1px;
    background: #eee;
    margin: 20px 0;
}

.total-price {
    font-size: 22px;
    font-weight: 900;
}

.total-price span {
    color: #800000;
}

.footer-btns {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 15px;
    margin-top: 30px;
}

.btn-primary {
    background: #302f2c;
    color: white;
    border: none;
    padding: 18px;
    font-weight: bold;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 1px;
}

.btn-secondary {
    background: #eee;
    color: #302f2c;
    border: none;
    cursor: pointer;
}

.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-window {
    background: white;
    padding: 50px;
    text-align: center;
    max-width: 450px;
    border-radius: 4px;
}

.modal-window h3 {
    font-size: 24px;
    margin-bottom: 15px;
    text-transform: uppercase;
}

.modal-window p {
    margin-bottom: 30px;
    line-height: 1.6;
    opacity: 0.8;
}

@media (max-width: 850px) {
    .main-grid {
        grid-template-columns: 1fr;
    }
}
</style>