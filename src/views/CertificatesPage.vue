<script setup>

</script>

<template>
    <div class="page-wrapper">
        <div class="container">
            <main class="main-content">
                <section class="text-block">
                    <h1 class="title">О СЕРТИФИКАТАХ</h1>
                    <p class="intro-text">
                        Мы предлагаем простой и удобный способ порадовать коллег, друзей или близких —
                        подарочный сертификат на посещение нашей фотостудии.
                    </p>

                    <h2 class="subtitle">ЧТО НУЖНО ЗНАТЬ:</h2>

                    <ol class="rules-list">
                        <li class="rule-item">
                            <strong>Номинал:</strong> Вы можете приобрести сертификат на любой удобный номинал.
                        </li>
                        <li class="rule-item">
                            <strong>Приобретение:</strong> Купить сертификат можно как в самой фотостудии, так и на
                            нашем сайте.
                        </li>
                        <li class="rule-item">
                            <strong>Активация:</strong> Для бронирования необходимо связаться с администратором студии,
                            назвать код
                            сертификата и выбрать свободное время в желаемом зале.
                        </li>
                        <li class="rule-item">
                            <strong>Срок действия:</strong> Сертификат действителен в течение 6 месяцев.
                        </li>
                    </ol>

                    <p class="promo-note">
                        Сделайте подарок, который гарантированно будет использован для красивых снимков!
                    </p>
                </section>

                <section class="image-container">
                    <img src="/sertificate_1.png" alt="Подарочный сертификат" />
                </section>
            </main>
        </div>
    </div>
</template>

<style scoped>
.page-wrapper {
    background-color: #efede3;
    color: #333333;
    font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
    min-height: 100vh;
    padding: 0 40px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

.main-content {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 60px;
    padding: 60px 0;
}

.title {
    font-size: 42px;
    font-weight: 900;
    margin-bottom: 40px;
    text-transform: uppercase;
    letter-spacing: -1px;
}

.intro-text {
    font-size: 20px;
    line-height: 1.4;
    margin-bottom: 50px;
}

.subtitle {
    font-size: 24px;
    font-weight: 900;
    margin-bottom: 25px;
    text-transform: uppercase;
}

.rules-list {
    list-style: none;
    padding: 0;
}

.rule-item {
    font-size: 18px;
    line-height: 1.5;
    margin-bottom: 20px;
}

.promo-note {
    margin-top: 50px;
    font-size: 18px;
    font-weight: 500;
}

.image-container img {
    width: 100%;
    height: auto;
    display: block;
}

@media (max-width: 900px) {
    .main-content {
        grid-template-columns: 1fr;
    }
}
</style>