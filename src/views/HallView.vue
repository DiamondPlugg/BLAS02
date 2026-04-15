<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useUsers from '../composables/useUsers';
// Импортируем наш массив из нового файла
import { hallsData } from '../data/hallsData';

const route = useRoute();
const router = useRouter();
const { currentUser, authModal } = useUsers();

const hall = ref(null);

// Функция загрузки данных конкретного зала
function loadData(id) {
    const targetId = id || route.params.id;

    // Сначала проверяем, есть ли данные в localStorage (если ты их там сохранял)
    // Если нет — берем из нашего файла hallsData
    const localHalls = JSON.parse(localStorage.getItem('studio_halls')) || [];
    const source = localHalls.length > 0 ? localHalls : hallsData;

    const found = source.find(h => h.id == targetId);

    if (found) {
        hall.value = found;
        // Прокрутка вверх при переходе на страницу зала
        window.scrollTo(0, 0);
    } else {
        console.warn('Зал не найден');
        // Если зал не найден, можно отправить пользователя на главную
        // router.push('/'); 
    }
}

function openBooking() {
    if (!currentUser.value) {
        authModal.show = true;
        authModal.mode = 'login';
    } else {
        router.push('/booking');
    }
}

// Следим за изменением ID в URL (если пользователь переключится между залами)
watch(() => route.params.id, (newId) => {
    if (newId) loadData(newId);
});

onMounted(() => {
    loadData();
});
</script>

<template>
    <div class="hall-page" v-if="hall">
        <section class="hall-hero" :style="{ backgroundImage: `url(${hall.mainImage})` }">
            <div class="hero-overlay">
                <h1>{{ hall.name }}</h1>
            </div>
        </section>

        <div class="content">
            <div class="container content-grid">
                <div class="description-side">
                    <h2>ОПИСАНИЕ ЛОКАЦИИ</h2>
                    <h4 class="accent-text">{{ hall.titleDescription }}</h4>
                    <p class="text-main">{{ hall.fullDescription }}</p>
                </div>

                <div class="info-card">
                    <div class="card-content">
                        <h3>О ЗАЛЕ:</h3>
                        <ul class="specs-list">
                            <li><span>Площадь:</span> {{ hall.area }} м²</li>
                            <li><span>Потолки:</span> {{ hall.ceilingHeight }} м</li>
                            <li><span>Свет:</span> {{ hall.lighting }}</li>
                        </ul>
                        <p class="price-tag">Цена от {{ hall.price }} ₽/час</p>
                        <div class="stars">
                            <span v-for="n in hall.rating" :key="n">★</span>
                        </div>
                        <button class="btn-reserve" @click="openBooking">Забронировать</button>
                    </div>
                </div>
            </div>

            <section class="container gallery-section">
                <div class="gallery-grid">
                    <div v-for="(img, idx) in hall.gallery" :key="idx" class="gallery-item">
                        <img :src="img" alt="фото зала">
                    </div>
                </div>
            </section>
        </div>
    </div>

    <div v-else class="loader">
        <p>Загрузка данных зала...</p>
    </div>
</template>

<style scoped>
.hall-hero {
    height: 450px;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.hero-overlay {
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-overlay h1 {
    color: #efede3;
    font-size: clamp(40px, 8vw, 80px);
    font-weight: 300;
    text-transform: uppercase;
    letter-spacing: 5px;
}

.content {
    padding: 0 5%;
}

.content-grid {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 50px;
    padding: 60px 0;
    text-align: left;
}

.accent-text {
    color: #800000;
    margin-bottom: 20px;
    font-style: italic;
    font-size: 22px;
}

.text-main {
    line-height: 1.8;
    font-size: 18px;
    color: #302f2c;
}

.info-card {
    border: 1px solid #302f2c;
    border-radius: 20px;
    padding: 30px;
    background: #fdfdfa;
    height: fit-content;
    position: sticky;
    top: 100px;
    box-shadow: 10px 10px 0px #302f2c;
}

.specs-list {
    list-style: none;
    padding: 0;
    margin: 20px 0;
}

.specs-list li {
    margin-bottom: 12px;
    font-size: 16px;
    border-bottom: 1px solid rgba(48, 47, 44, 0.1);
    padding-bottom: 8px;
    display: flex;
    justify-content: space-between;
}

.price-tag {
    font-weight: bold;
    font-size: 24px;
    color: #302f2c;
    margin-top: 20px;
}

.stars {
    color: #800000;
    font-size: 20px;
    margin: 10px 0;
}

.btn-reserve {
    background: #302f2c;
    color: #efede3;
    border: none;
    padding: 15px 30px;
    border-radius: 30px;
    width: 100%;
    cursor: pointer;
    margin-top: 20px;
    font-weight: bold;
    transition: all 0.3s;
}

.btn-reserve:hover {
    background: #800000;
    transform: scale(1.02);
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
    margin-bottom: 80px;
}

.gallery-item img {
    width: 100%;
    height: 500px;
    object-fit: cover;
    border-radius: 15px;
    transition: filter 0.3s;
}

.gallery-item img:hover {
    filter: brightness(0.8);
}

.loader {
    text-align: center;
    padding: 100px;
    font-size: 20px;
}

@media (max-width: 900px) {
    .content-grid {
        grid-template-columns: 1fr;
    }

    .info-card {
        position: relative;
        top: 0;
    }

    .gallery-grid {
        grid-template-columns: 1fr;
    }
}
</style>