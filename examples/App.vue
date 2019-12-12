<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <vueBinary :imgUrl="imgArr[6]" :debug="true" @success="success"></vueBinary>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      imgArr: [
        'https://3img.evente.cn/89/24/c5/2f8bd4af2030c57438fbdb8735.jpg?imageView2/2/w/740',
        'https://0img.evente.cn/b4/e9/57/859996945c4020a3557d62d727.jpg?imageView2/2/w/740',
        'https://3img.evente.cn/27/7f/65/7708415e9017c368d008c9677a.jpg?imageView2/2/w/740',
        'https://3img.evente.cn/51/7a/a0/3bc7b0aed6857706a9f3b31294.jpg?imageView2/2/w/740',
        'https://1img.evente.cn/ec/d3/02/b6b5ae90a003ec34b34db8f4f7.jpg?imageView2/2/w/740',
        'https://3img.evente.cn/a6/9f/bb/dce6fc4e145771be80316f4f04.jpg?imageView2/2/w/740',
        'https://0img.evente.cn/75/72/5d/6d432e2e93ac90567e626aa224.jpg?imageView2/2/w/740',
      ]
    }
  },
  methods: {
    success(e) {
      // eslint-disable-next-line
      console.log(e);
    },
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
