<template>
    <div class="about-page">
        <section class="hero">
            <div class="overlay">
                <h1>О НАС</h1>
            </div>
        </section>

        <section class="about-content">
            <div class="container">
                <div class="text">
                    <p>
                        <strong>Фотостудия «Между светом и тенью»</strong> — это пространство, созданное для тех, кто
                        говорит на языке
                        фотографии. Мы не предоставляем услуги фотографов, визажистов или реквизита. Наша задача — дать
                        вам идеальный холст, каким является каждый наш зал.
                    </p>
                    Мы объединили шесть уникальных локаций под одной крышей, чтобы вы могли реализовать любую
                    творческую задумку: от дерзкой fashion-съемки до уютного семейного портрета.
                    <p>

                    </p>

                    <h2>Почему стоит выбрать нас?</h2>

                    <ul>
                        <li>
                            <strong>Чистый лист для вашего творчества.</strong> Вы полностью контролируете процесс.
                            Приходите со своей командой, светом и идеями — залы оборудованы качественным базовым светом
                            и интерьерами, готовыми к трансформации.
                        </li>

                        <li>
                            <strong>Разнообразие пространств.</strong> В нашем распоряжении 6 залов с разными
                            характерами: от брутального лофта и гламурного красного до минималистичного лайтрума и
                            атмосферного данжн-зала. Каждый найдет «свой» свет.

                        </li>

                        <li>
                            <strong>Удобство и свобода.</strong>Зали студии — это ваш съемочный цех. Вы не ограничены
                            чужим расписанием (в рамках аренды) и не зависите от стиля работы приглашенного студийного
                            фотографа.
                        </li>

                        <li>
                            <strong>Вдохновляющая атмосфера.</strong> Мы верим, что пространство влияет на результат.
                            Наши залы спроектированы так, чтобы грань между светом и тенью помогала рождать кадры с
                            характером
                        </li>
                    </ul>

                    <p>
                        Мы предоставляем только один, но самый важный ресурс — пространство, наполненное светом и
                        характером. Остальное создаете вы.
                    </p>
                </div>

                <div class="image">
                    <img src="/about_1.jpg" alt="about" />
                    <span class="note">*Текст написан с помощью ИИ.</span>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.about-page {
    font-family: Arial, sans-serif;
    color: #222;
}

.hero {
    height: 25vh;
    background: url('/hero_about_fon.jpg') center/cover no-repeat;
    position: relative;
}

.overlay {
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
}

.overlay h1 {
    color: white;
    font-size: 48px;
    letter-spacing: 4px;
}

.about-content {
    background-color: #efede3;
    padding: 60px 0;
}

.container {
    max-width: 1200px;
    margin: auto;
    display: flex;
    gap: 40px;
}

.text {
    flex: 1;
    font-size: 16px;
    line-height: 1.6;
}

.text h2 {
    margin-top: 30px;
}

.text ul {
    margin-top: 20px;
}

.text li {
    margin-bottom: 15px;
}

.image {
    flex: 1;
    position: relative;
}

.image img {
    width: 100%;
    object-fit: cover;
}

.note {
    font-size: 12px;
    color: gray;
    position: absolute;
    bottom: -20px;
    right: 0;
}
</style>