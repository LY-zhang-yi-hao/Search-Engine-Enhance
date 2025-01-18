# 搜索引擎增强脚本 (Search Engine Enhance) 🚀

这个用户脚本增强了百度、Google、必应等搜索引擎的界面，添加了一个右侧透明导航栏，帮助用户快速在多个搜索引擎和常见网站之间切换。支持自定义导航链接，并且可以移除百度等搜索结果页面中的广告。🌐
极大减少搜索的时间
效果显示：
- **无插件时**：![PixPin_2025-01-18_18-58-19](https://github.com/user-attachments/assets/8c0741f2-85b4-46ae-acdc-dbfe0301a947)

- **有插件时**：![PixPin_2025-01-18_19-01-45](https://github.com/user-attachments/assets/20d88ee0-d25f-4d1d-ad77-31567683ed16)


## 功能 ✨

- **透明导航栏**：在搜索页面右侧显示一个透明的导航栏，与页面的风格无缝融合。🖥️
- **支持多个搜索引擎**：增强对百度、Google、必应、搜狗等搜索引擎的支持。🔍
- **自定义导航链接**：你可以根据需要自定义更多的搜索引擎或网站链接。🔗
- **去广告**：自动去除百度等搜索引擎页面中的广告。🚫
- **新标签页打开搜索结果**：搜索结果点击后默认在新标签页打开。📑

## 安装 💻

### 安装方法 1：使用油猴（Tampermonkey）或暴力猴（Violentmonkey）

1. 安装 [Tampermonkey](https://www.tampermonkey.net/index.php?browser=edge&ext=iikm&version=5.3.3)🧑‍💻
2. 搜索[引擎增强脚本](https://greasyfork.org/zh-CN/scripts/524101-%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%A2%9E%E5%BC%BA)
3. 点击 "安装" 按钮即可✅![image](https://github.com/user-attachments/assets/97a3569b-bfa6-4ab4-9a1c-8f092744e25a)



### 安装方法 2：手动安装

1. 下载 `search_engine_enhance.user.js` 文件。📥
2. 将该文件导入油猴（Tampermonkey）扩展中。🛠️
3. 演示:![PixPin_2025-01-18_18-49-18](https://github.com/user-attachments/assets/5c081eda-4d01-4823-b2bb-2ca790006cdd)


## 配置 ⚙️

- 你可以根据需求修改 `userscript/search_engine_enhance.user.js` 文件中的导航数据，添加或删除搜索引擎链接。📝
  
```javascript
// 示例：自定义导航
this.defaultNavigationData = [
    {
        "name": "自定义搜索引擎", "list": [
            {"name": "百度", "url": "https://www.baidu.com/s?wd=@@"},
            {"name": "必应", "url": "https://cn.bing.com/search?q=@@"},
            {"name": "Google", "url": "https://www.google.com/search?q=@@"}
        ]
    },
    // 更多配置...
];
