<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎  {{ name }}</div>
    <div class="dashboard-text">今天是</div>
    <div class="dashboard-text">      {{ time }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ]),
    time() {
      return moment(Date.now()).format('yyyy年MM月DD日')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
