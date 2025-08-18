<template>
  <div class="login-container">
    <div class="login-wrap">
      <h2>登录</h2>
      <div class="error-text">{{ loginForm.loginErrorText }}</div>

      <div class="login-form">
        <input type="text" placeholder="用户名" required autocomplete="no" v-model="loginForm.username" />
        <input type="password" placeholder="密码" required autocomplete="no" v-model="loginForm.password" />
        <button @click="handleLogin">{{ loginForm.loginBtnText }}</button>
      </div>

      <div class="tips">
        <span style="margin-right: 20px">username: admin</span>
        <span> password: 123</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const store = useUserStore()
const router = useRouter()

const loginForm = reactive({
  username: 'admin',
  password: '123',
  loginBtnText: '登录',
  loginErrorText: '',
})

const handleLogin = function () {
  if (!loginForm.username || !loginForm.password) {
    loginForm.loginErrorText = '请检查用户名或密码是否填写正确'
    return
  }

  loginForm.loginErrorText = ''

  if (loginForm.loginBtnText != '登录') return
  loginForm.loginBtnText = '登录中...'

  store
    .login(loginForm)
    .then((res) => {
      router.replace({ path: '/' })
    })
    .catch((err) => {
      alert(err.message || error)
    })
    .finally(() => {
      loginForm.loginBtnText = '登录'
      loginForm.loginErrorText = ''
    })
}
</script>

<style lang="scss" scoped>
$bg: #f4f4f4;
$loginColor: #1677ff;

.login-container {
  min-height: 100vh;
  width: 100vw;
  background-color: $bg;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  * {
    box-sizing: border-box;
  }

  .error-text {
    font-size: 12px;
    color: #f56c6c;
    margin-bottom: 14px;
    text-align: center;
  }

  .login-wrap {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 370px;
    box-sizing: border-box;
    overflow: hidden;

    h2 {
      text-align: center;
      margin-bottom: 20px;
    }

    .login-form {
      position: relative;

      input[type='text'],
      input[type='password'] {
        width: 100%;
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
        outline: none;
      }

      button {
        width: 100%;
        padding: 10px;
        background-color: $loginColor;
        color: #ffffff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        outline: none;
      }

      button:hover {
        background-color: rgba($color: $loginColor, $alpha: 0.8);
      }
    }

    .tips {
      text-decoration: none;
      color: $loginColor;
      float: right;
      font-size: 12px;
      margin-top: 10px;
    }
  }
}
</style>
