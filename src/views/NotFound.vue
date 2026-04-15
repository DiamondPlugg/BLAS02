<script setup>

</script>

<template>
    <div class="error-page">
        <div class="error-container">
            <h1 class="error-code">404</h1>

            <h2 class="error-title">Упс... Что-то пошло не так</h2>
            <p class="error-subtitle">Фиксики уже в пути</p>
        </div>
    </div>
</template>

<style scoped>
.error-page {
    background-color: #efede3;
    color: #302f2c;
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    text-align: center;
    padding: 20px;
}

.error-container {
    max-width: 800px;
}

.error-code {
    font-size: 180px;
    font-weight: 900;
    margin: 0;
    line-height: 1;
    letter-spacing: -5px;
    color: #302f2c;
}

.error-title {
    font-size: 42px;
    font-weight: 800;
    margin-top: 20px;
    margin-bottom: 10px;
}

.error-subtitle {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 50px;
    opacity: 0.8;
}

@media (max-width: 600px) {
    .error-code {
        font-size: 120px;
    }

    .error-title {
        font-size: 28px;
    }

    .error-subtitle {
        font-size: 22px;
    }
}
</style>