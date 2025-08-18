<template>
  <div class="error-screen">
    <div class="back-btn">
      <a href="/">Page not found, Back to Home</a>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
$color: rgb(#1482f0, 0.9);

.error-screen {
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;

  .back-btn {
    margin-top: 30px;

    a {
      padding: 9px 12px;
      color: #fff;
      border-radius: 30px;
      font-size: 14px;
      background-color: $color;
      text-decoration: none;
    }
  }
}
</style>
