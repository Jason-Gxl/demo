### 介绍

人工智能组件，目前有语音识别功能

### 安装依赖项

```sh
npm install
```

### 运行Demo

```sh
npm run start
```

### 功能

语音识别

### 例子

```javascript
var voiceDiscern = plugin.voiceDiscern;

//初始化组件
voiceDiscern.init({moduleName: "CodyyAIEngineWeb", time: 10}, function(data) {

});

//添加监听事件
voiceDiscern.addEvent("OnTranslateSuccess", function(data) {

});

//调用组件接口
voiceDiscern.start(function(data) {

});
```

### 接口

|名称|参数|说明|
|----|----|----|
|init|Object, callback|初始化组件，返回创建的组件对象|
|addEvent|EventName, callback|向组件添加监听事件|
|removeEvent|EventName|移除组件已经存在的事件|
|activateVoiceOrder|sdk：代表调用的是哪个供应商的sdk，0:腾讯，1:科大讯飞，2:阿里,<br/> callback|激活语音指令功能，此功能针对事先录入的一些特定的指令有效|
|activateVoiceDiscern|sdk：代表调用的是哪个供应商的sdk，0:腾讯，1:科大讯飞，2:阿里,<br/>callback|激活语音指令功能|
|activateVoiceTranslate|sdk：代表调用的是哪个供应商的sdk，0:腾讯，1:科大讯飞，2:阿里,<br/>callback|激活语音识别功能|
|startVoiceOrder|callback|开始语音指令功能，此功能针对事先录入的一些特定的指令有效|
|startVoiceDiscern|callback|开始语音识别功能|
|startVoiceTranslate|callback|开始长语音转写功能|
|stopVoiceOrder|callback|关闭语音指令功能|
|stopVoiceDiscern|callback|关闭语音识别功能|
|stopVoiceTranslate|callback|关闭长语音转写功能|
|pip|Function Name, Arguments, callback|管道接口，如果有多个接口需要调用时，可以通过此接口达到链式调用|

### 事件

|名称|说明|
|----|-----------|
|OnTranslateSuccess|转写结果上报事件|
|OnVoice|语音数据上报事件|
|OnFunctionResult|通用调用结果反馈事件|
|OnBehavior|姿态识别结果上报事件|
|OnCommand|指令上报事件|
|OnRealTimeTranslate|长语音实时转写结果上报事件|