# vue-binary
基于vue+canvas快速简单将图片生成二值化数据的组件(OSTU - 大津算法选自适应阈值)
# 写在前面

### 需求
需要在前端绘制一张图片，然后转为01010的二进制数据 再通过蓝牙连接热敏打印机打印图片
这样说好像有点难理解，我都有点小迷啦...直接上图...功能其实类似于手持打印机这样的产品(原理应该是稍微有些不同)
![热敏打印机](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576228846350&di=a30a57994af838580efda2c35ac68d2f&imgtype=0&src=http%3A%2F%2Fdingyue.nosdn.127.net%2FeTJTSwZns6g2lRhgfm8VR3NdELw6zuIA6Q7uBye6sgCy51530137672172.jpg)

### 思路:
通过js将图片转为黑白噪点图片(用二进制数据填充)然后再转为16进制热敏打印机内容才能打印图片
##### 灰度化数据计算
像素中具有RGB三通道的彩色图像来说怎样才能得到灰度图像呢？只要使R=G=B，三者的值相等就可以得到灰度图像。R=G=B=255为白色，R=G=B=0为黑色，R=G=B=小于255的某个整数时，此时就为某个灰度值。
1. 浮点算法：Gray=R*0.3+G*0.59+B*0.11
2. 整数方法：Gray=(R*30+G*59+B*11)/100
3. 移位方法：Gray =(R*28+G*151+B*77)>>8;
4. 平均值法：Gray=（R+G+B）/3;
##### 因为人对每一种颜色的色值观感是不同的，推荐大家使用第一种会更符合人眼视觉 =，= 
1. 加权平均法 根据重要性及其它指标，将三个分量以不同的权值进行加权平均。由于人眼对绿色的敏感最高，对蓝色敏感最低，因此，对RGB三分量进行加权平均能得到较合理的灰度图像。
2. 平均值法 求出每个像素点的R、G、B三个分量的平均值，然后将彩色图像中的这个平均值赋予给这个像素的三个分量。
2. 最大值法 将彩色图像中的三分量亮度的最大值作为灰度图的灰度值。

### 二值化计算 Otsu算法(大津法)
在初期做完基础工能后用了最暴力的方式 二分法 在(0-255)之间取177这个值来当阀值，再通过阀值对灰度数据进行计算得出0或者1的组合，但是这样处理过黑过白的图片打印效果会非常差...
##### Otsu

1. 先计算图像的直方图，即将图像所有的像素点按照0~255共256个bin，统计落在每个bin的像素点数量，这个很简单啦~
2. 归一化直方图，也即将每个bin中像素点数量除以总的像素点，使其限制在0~1之间
3. 在这里设置一个分类的阈值ii，也即一个灰度级，开始从0迭代
4. 通过归一化的直方图，统计0~i 灰度级的像素(假设像素值在此范围的像素叫做前景像素) 所占整幅图像的比例w0w0，并统计前景像素的平均灰度u0u0；统计i~255灰度级的像素(假设像素值在此范围的像素叫做背景像素) 所占整幅图像的比例w1w1，并统计背景像素的平均灰度u1u1；在这里，设图像的总平均灰度为u2u2，类间方差记为gg。
其中：
u2=ω0∗u0+ω1∗u1u2=ω0∗u0+ω1∗u1，g=ω0(u0−μ2)2+ω1(u1−u2)2g=ω0(u0−μ2)2+ω1(u1−u2)2
将u2u2带入gg中，可得：
g=ω0ω1(u0−u1)2g=ω0ω1(u0−u1)2
5. ++ii,阈值的灰度值加1，并转到第4个步骤，直到i为256时结束迭代
![otsu](https://0img.evente.cn/62/4d/99/a67bf6ca518e1c62e288024f05.jpg?imageView2/2/w/740)
##### 是不是懵逼了？
不要慌，看不懂直接抄公式就OK（直接使用本组件也ok~）向下看 ↓

# Github
- [Github地址](https://github.com/whorcare/vue-binary)
##### 图片展示不出来 可以使用掘金备用地址 =，=
- [掘金](https://juejin.im/post/5df33d1051882512632e772c)

# 生成效果
##### 原图
![原图](https://3img.evente.cn/a6/9f/bb/dce6fc4e145771be80316f4f04.jpg?imageView2/2/w/740)
##### 二值化后
![二值化后](https://0img.evente.cn/3f/34/b9/021273e25d5aac6368a66ab316.jpg?imageView2/2/w/740)
- 原图
![原图](https://3img.evente.cn/27/7f/65/7708415e9017c368d008c9677a.jpg?imageView2/2/w/740)
- 二值化后
![二值化后](https://1img.evente.cn/af/f1/ab/2bd58daf391e1100acb481b458.jpg?imageView2/2/w/740)
# 安装
```
npm i vue-binary
```
# 使用组件
##### 注册
```
// 全局
import vueBinary from 'vue-binary'
Vue.use(vueBinary)
```
##### 使用
```
// 页面
<vueBinary :imgUrl="图片地址" @success="success"></vueBinary>
```

# API
属性 | 含义 |  类型 |默认值 | 是否必填
---|---|---|---|---
imgUrl| 图片地址(支持远程+本地图片 注意不能跨域) | Number|  |是|
threshold| 自定义阀值 | Number|  |否|
thresholdCalculation| 自动适用阀值后进行加减算法(如：-10) |Number |  | 否|
debug| 是否开启调试模式 | Boolean | false | 否|

### 方法
```
success(obj) {
  {
    imgBase: 返回base64图片,
    binaryArr: 二进制数据 1表示黑 0表示空白,
    canvasData: canvas绘制数据,
  }
}
```

### 注意
##### 关于canvas图片跨域
canvas图片跨域，远程图片地址推荐使用同域名，不然引起错误

### 相关参考
1. [数字图像处理课程设计报告](https://wenku.baidu.com/view/f2cbc9116c175f0e7cd13743.html)
2. [详细及易读懂的 大津法（OTSU）原理 和 算法实现](https://blog.csdn.net/u012198575/article/details/81128799)
3. [otsu （大津算法）百科](https://baike.baidu.com/item/otsu/16252828?fr=aladdin)

### 持续开发中的功能...
- 局部大津法（OTSU）
- 2进制数据转热敏打印机图像数据16进制
- 可选类型图片导出
- ...

### 如果你觉得这个项目有趣 不妨给个star~ (҂‾ ▵‾)σ(˚▽˚’!)/
[给我star~](https://github.com/whorcare/vue-binary)

### 交流
##### 有什么意见,或者bug 或者想一起开发vue-binary
![我的微信](https://0img.evente.cn/0f/41/65/8ad030fc5d9f82f6345b3d6e7c.jpg?imageView2/2/w/220)

### ISS
[提iss](https://github.com/whorcare/vue-binary/issues/new)
