<script setup>
import { ref, computed } from 'vue';
import { hallsData } from '../data/hallsData';

const sortBy = ref('default');

const sortedHalls = computed(() => {
  let list = [...hallsData];

  if (sortBy.value === 'price') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'area') {
    list.sort((a, b) => b.area - a.area);
  } else if (sortBy.value === 'height') {
    list.sort((a, b) => b.ceilingHeight - a.ceilingHeight);
  } else if (sortBy.value === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
});
</script>

<template>
  <div class="home-page">
    <section class="hero" :style="{ backgroundImage: 'url(/hero-main-fon.jpg)' }">
      <div class="hero-content">
        <h1 class="hero-title">PhotoStudio</h1>
        <p class="hero-subtitle">Между светом и тенью</p>
        <div class="hero-line"></div>
        <p class="hero-tagline">Где тень шепчет, а свет говорит</p>
      </div>
    </section>

    <div class="ticker-wrap">
      <div class="ticker">
        <span v-for="i in 10" :key="i">
          СКИДКА НА ДЕНЬ РОЖДЕНИЯ 15% &nbsp; • &nbsp;
        </span>
      </div>
    </div>

    <div class="home">
      <section id="halls-section" class="halls">
        <div class="container">
          <h2 class="section-title">НАШИ ЗАЛЫ</h2>

          <div class="sort-controls">
            <label for="sort-select">Сортировать по:</label>
            <select id="sort-select" v-model="sortBy" class="sort-select">
              <option value="default">По умолчанию</option>
              <option value="price">Цене (сначала дешевле)</option>
              <option value="area">Площади (сначала большие)</option>
              <option value="height">Высоте потолков</option>
              <option value="rating">Рейтингу</option>
            </select>
          </div>

          <div class="halls-grid">
            <div v-for="hall in sortedHalls" :key="hall.id" class="hall-card" @click="$router.push('/hall/' + hall.id)">
              <div class="hall-image">
                <img :src="hall.faceImage || '/default1.jpg'" alt="зал" @error="handleImgError">
                <div class="price-tag">{{ hall.price }} ₽/час</div>
              </div>
              <div class="hall-info">
                <h3>{{ hall.name }}</h3>
                <div class="hall-details">
                  <span>{{ hall.area }} м²</span>
                  <span class="rating-stars">★ {{ hall.rating }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section id="certificates" class="certificate-section">
      <div class="cert-box">
        <h2>Подарочные сертификаты</h2>
        <p>Подарите близким возможность остановить время.</p>
        <p>Сертификат в студию «Между светом и тенью» — это не просто услуга, это билет в мир искусства...</p>
        <router-link :to="{ name: 'certificates' }" class="btn-red-link">
          Купить сертификат
        </router-link>
      </div>
      <div class="cert-image-container">
        <img class="cert-image-placeholder" src="/hero_sertificate.jpg" alt="Сертификат" />
      </div>
    </section>

    <section class="feedback-section">
      <button class="btn-feedback">Связь с нами</button>
      <div class="footer-info-grid">
        <div class="info-block">
          <h4>Адрес</h4>
          <p>Невский проспект, 2к5</p>
          <p>г. Санкт-Петербург</p>
          <p>с 8:00 до 22:00</p>
        </div>
        <div class="info-block">
          <h4>Контакты</h4>
          <p>support@BLAS.support</p>
          <p>+7 (937) 506-11-06</p>
        </div>
        <div class="info-block">
          <h4>Соцсети</h4>
          <p>ВКонтакте</p>
          <p>Телеграм</p>
          <p>Instagram</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Стили для сортировки */
.sort-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 40px;
}

.sort-select {
  background: #302f2c;
  color: #efede3;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  outline: none;
  font-family: inherit;
}

.price-tag {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(48, 47, 44, 0.9);
  color: #efede3;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}

.hall-details {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 16px;
  color: #302f2c;
  opacity: 0.8;
}

.rating-stars {
  color: #800000;
  font-weight: bold;
}

/* Базовые стили страницы */
.home-page {
  background-color: #efede3;
  color: #302f2c;
}

.hero {
  height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  color: #efede3;
}

.hero-content {
  margin-left: 50%;
  text-align: left;
}

.hero-title {
  font-size: 50px;
  text-transform: uppercase;
  font-weight: 900;
  margin: 0;
}

.hero-subtitle {
  font-size: 45px;
  margin-top: -10px;
}

.hero-line {
  height: 1px;
  background: #efede3;
  width: 100%;
  margin: 20px 0;
}

.hero-tagline {
  font-size: 28px;
  font-style: italic;
}

.ticker-wrap {
  background: #302f2c;
  color: #efede3;
  padding: 25px 0;
  overflow: hidden;
}

.ticker {
  white-space: nowrap;
  display: inline-block;
  animation: scroll 40s linear infinite;
  font-size: 24px;
  font-weight: bold;
}

@keyframes scroll {
  from {
    transform: translateX(0%);
  }

  to {
    transform: translateX(-50%);
  }
}

.home {
  padding: 60px 0;
}

.section-title {
  text-align: center;
  font-size: 40px;
  margin-bottom: 50px;
  text-transform: uppercase;
  font-weight: 900;
}

.halls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  padding: 0 5%;
}

.hall-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #302f2c;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
}

.hall-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.hall-image {
  position: relative;
}

.hall-image img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
}

.hall-info {
  padding: 25px;
  background: #efede3;
  border-top: 1px solid #302f2c;
}

.hall-info h3 {
  font-size: 22px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Секция сертификатов и футер из твоего кода без изменений */
.certificate-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 10%;
  background-color: #efede3;
}

.cert-box {
  background: #302f2c;
  color: #efede3;
  padding: 50px;
  width: 35%;
  z-index: 2;
  margin-right: -5%;
}

.btn-red-link {
  display: inline-block;
  background: #800000;
  color: white;
  padding: 15px 30px;
  text-decoration: none;
  font-weight: bold;
  margin-top: 20px;
}

.cert-image-placeholder {
  width: 60%;
  height: 60%;
  object-fit: cover;
}

.feedback-section {
  padding: 80px 10%;
  text-align: center;
}

.btn-feedback {
  background: #302f2c;
  color: #efede3;
  padding: 18px 60px;
  border: none;
  margin-bottom: 60px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.footer-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: left;
  border-top: 1px solid #302f2c;
  padding-top: 40px;
  gap: 40px;
}

@media (max-width: 1024px) {
  .hero-content {
    margin-left: 10%;
  }

  .certificate-section {
    flex-direction: column;
  }

  .cert-box {
    width: 90%;
    margin-right: 0;
    margin-bottom: -40px;
  }

  .footer-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
