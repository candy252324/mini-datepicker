# mini-datepicker
小程序的日历组件，支持周视图和月视图的切换

## 如何使用
example.json
```
{
  "usingComponents": {
    "mini-datepicker": "example/mini-datepicker"
  },
}

```
example.wxml
```
<view>
  <mini-datepicker defaultDate="{{defaultDate}}" startDay="{{startDay}}" bindchooseDate="chooseDate">
  </mini-datepicker>
</view>
```
example.js
```
data:{
  defaultDate: "2020-3-31",
  startDay: "monday"
}
```




