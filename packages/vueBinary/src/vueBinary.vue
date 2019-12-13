<!-- VueBinary -->
<template>
  <div class="binary" v-show="debug">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script>
export default {
  /* eslint-disable */
  name: "VueBinary",
  props: {
    imgUrl: {
      type: String,
      default: ""
    },
    debug: {
      type: Boolean,
      default: false,
    },
    threshold: { // 阀值 默认为0时使用自适应阀值
      type: Number,
      default: 0,
    },
    thresholdCalculation: { // 改变动态阀值
      type: Number,
      default: 0,
    }
  },
  data() {
    return {};
  },
  watch: {
    imgUrl: {
      handler: "initCanvas",
      deep: true,
      immediate: true
    }
  },
  methods: {
    initCanvas() {
      if (this.imgUrl === "") {
        return;
      }
      this.$nextTick(() => {
        let img = new Image();
        //解决跨域问题
        img.crossOrigin = "Anonymous";
        img.src = this.imgUrl;
        let canvas;
        let ctx;
        //图片加载完成触发
        img.onload = () => {
          canvas = this.$refs.canvasRef;
          canvas.width = img.width;
          canvas.height = img.height;
          ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, img.width, img.height);
          this.binarization();
        };
      });
    },
    //一维OTSU图像处理算法
    binarization() {
      /** 表示灰度值的分布点概率 [0: 0.01313, 1: 0.12041] */
      var m_pFstdHistogram = new Array();
      /** 其中每一个值等于m_pFstdHistogram中从0到当前下标值的和 */
      var m_pFGrayAccu = new Array();
      /** 其中每一值等于m_pFstdHistogram中从0到当前指定下标值*对应的下标之和 */
      var m_pFGrayAve = new Array();
      /** 值为m_pFstdHistogram【256】中每一点的分布概率*当前下标之和 */
      var m_pAverage = 0;
      /** 灰度某个值 0-255之间个数 [0:2, 149: 1] */
      var m_pHistogram = new Array(); //灰度直方图
      var i, j;
      var temp = 0,
        fMax = 0; //定义一个临时变量和一个最大类间方差的值
      var nThresh = 0; //最优阀值
      //获取灰度图像的信息
      var imageInfo = this.getGrayImageInfo();
      if (imageInfo == null) {
        return;
      }
      //初始化各项参数
      for (i = 0; i < 256; i++) {
        m_pFstdHistogram[i] = 0;
        m_pFGrayAccu[i] = 0;
        m_pFGrayAve[i] = 0;
        m_pHistogram[i] = 0;
      }
      //获取图像信息
      var canvasData = imageInfo[0];
      //获取图像的像素
      var pixels = canvasData.data;
      //下面统计图像的灰度分布信息
      for (i = 0; i < pixels.length; i += 4) {
        //获取r的像素值，因为灰度图像，r=g=b，所以取第一个即可
        let r = pixels[i];
        m_pHistogram[r]++;
      }
      //下面计算每一个灰度点在图像中出现的概率
      var size = canvasData.width * canvasData.height;
      for (i = 0; i < 256; i++) {
        m_pFstdHistogram[i] = m_pHistogram[i] / size;
      }
      //下面开始计算m_pFGrayAccu和m_pFGrayAve和m_pAverage的值
      for (i = 0; i < 256; i++) {
        for (j = 0; j <= i; j++) {
          //计算m_pFGaryAccu[256]
          m_pFGrayAccu[i] += m_pFstdHistogram[j];
          //计算m_pFGrayAve[256]
          m_pFGrayAve[i] += j * m_pFstdHistogram[j];
        }
        //计算平均值
        m_pAverage += i * m_pFstdHistogram[i];
      }
      //下面开始就算OSTU的值，从0-255个值中分别计算ostu并寻找出最大值作为分割阀值
      for (i = 0; i < 256; i++) {
        // 计算前景像素和背景像素的方差 g = w0*w1*(u0-u1) (u0-u1)
        temp =
          ((m_pAverage * m_pFGrayAccu[i] - m_pFGrayAve[i]) *
          (m_pAverage * m_pFGrayAccu[i] - m_pFGrayAve[i])) /
          (m_pFGrayAccu[i] * (1 - m_pFGrayAccu[i]));
        if (temp > fMax) {
          fMax = temp;
          nThresh = i;
        }
      }
      // 如果输入默认阀值 则替换自适应阀值
      if (this.threshold !== 0) {
        nThresh = this.threshold;
      } else if (this.thresholdCalculation !== 0) {
        nThresh += this.thresholdCalculation
      }
      //下面执行二值化过程
      const binaryArr = [];
      for (i = 0; i < canvasData.width; i++) {
        for (j = 0; j < canvasData.height; j++) {
          //取得每一点的位置
          var ids = (i + j * canvasData.width) * 4;
          //取得像素的R分量的值
          let r = canvasData.data[ids];
          //与阀值进行比较，如果小于阀值，那么将改点置为0，否则置为255
          var gray = r > nThresh ? 255 : 0;
          // 二进制 1表示绘制 0表示空白
          binaryArr.push(r > nThresh ? 1 : 0);
          canvasData.data[ids + 0] = gray;
          canvasData.data[ids + 1] = gray;
          canvasData.data[ids + 2] = gray;
        }
      }
      //显示二值化图像
      var newImage = this.$refs.canvasRef.getContext("2d");
      newImage.putImageData(canvasData, 0, 0);
      this.$emit('success', {
        imgBase: this.$refs.canvasRef.toDataURL('image/jpeg'),
        binaryArr: binaryArr.join(''),
        canvasData,
      })
    },

    //获取图像的灰度图像的信息binarization
    getGrayImageInfo() {
      var canvas = this.$refs.canvasRef;
      var ctx = canvas.getContext("2d");
      var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (canvasData.data.length == 0) {
        return null;
      }
      return [canvasData, ctx];
    }
  }
};
</script>
<style lang='scss'>
</style>
