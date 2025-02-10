// ==UserScript==
// @name              搜索引擎增强
// @namespace         search_enhance_namespace
// @version           2.0.0
// @description       搜索引擎导航增强,支持百度、必应、Google等
// @author            Your Name
// @include           *://www.baidu.com/*
// @include           *://www.so.com/s*
// @include           *://www.sogou.com/web*
// @include           *://cn.bing.com/search*
// @include           *://www.google.com/search*
// @include           *://www.google.com.hk/search*
// @require           https://code.jquery.com/jquery-3.6.0.min.js
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @license           MIT License
// ==/UserScript==

function SearchEnginesNavigation() {
    // 导航配置数据
    this.searchEnginesData = [
        {"host": "www.baidu.com", "element": "#content_right", "elementInput": "#kw"},
        {"host": "www.so.com", "element": "#side", "elementInput": "#keyword"},
        {"host": "www.sogou.com", "element": "#right", "elementInput": "#upquery"},
        {"host": "cn.bing.com", "element": "#b_context", "elementInput": "#sb_form_q"},
        {"host": "www.google.com", "element": "#rhs,#rcnt", "elementInput": "input[name='q'],textarea[name='q']"},
        {"host": "www.google.com.hk", "element": "#rhs,#rcnt", "elementInput": "input[name='q'],textarea[name='q']"}
    ];

    // 默认导航数据
    this.defaultNavigationData = [
        {"name": "搜索引擎", "list": [
            {"name": "百度", "url": "https://www.baidu.com/s?wd=@@"},
            {"name": "必应", "url": "https://cn.bing.com/search?q=@@"},
            {"name": "Google", "url": "https://www.google.com/search?q=@@"}
        ]},
        {"name": "综合搜索", "list": [
            {"name": "知乎搜索", "url": "https://www.zhihu.com/search?q=@@"},
            {"name": "豆瓣搜索", "url": "https://www.douban.com/search?q=@@"},
            {"name": "小红书", "url": "https://www.xiaohongshu.com/search_result?keyword=@@"},
            {"name": "CSDN", "url": "https://so.csdn.net/so/search?q=@@"},
            {"name": "博客园", "url": "https://www.cnblogs.com/search?q=@@"}
        ]},
        {"name": "视频搜索", "list": [
            {"name": "B站搜索", "url": "https://search.bilibili.com/all?keyword=@@"},
            {"name": "抖音", "url": "https://www.douyin.com/search/@@"},
            {"name": "YouTube", "url": "https://www.youtube.com/results?search_query=@@"}
        ]}
    ];

    // 创建导航HTML
    this.createHtml = function (element, elementInput, navigationData) {
        const elementId = Math.ceil(Math.random() * 100000000);

        // 创建CSS样式
        const css = `
            #search_nav_${elementId} {
                position: fixed;
                top: 150px;
                right: ${window.location.host === "www.google.com" ? "650px" : "300px"};  // Google 搜索时更靠左
                margin: 0;
                padding: 12px 15px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                z-index: 9999;
                backdrop-filter: blur(5px);
                border: 1px solid rgba(0, 0, 0, 0.05);
            }
            #search_nav_${elementId} .nav-title {
                font-size: 13px;
                font-weight: 500;
                margin-bottom: 8px;
                color: ${window.location.host === "www.google.com" ? "#5f6368" : "#666"};
                padding-bottom: 4px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            }
            #search_nav_${elementId} .nav-links {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }
            #search_nav_${elementId} .nav-links a {
                display: inline-block;
                padding: 4px 8px;
                color: ${window.location.host === "www.google.com" ? "#1a73e8" : "#555"};
                text-decoration: none;
                font-size: 13px;
                background: ${window.location.host === "www.google.com" ?
                    "rgba(26, 115, 232, 0.03)" :
                    "rgba(0, 0, 0, 0.02)"};
                border-radius: 6px;
                transition: all 0.2s ease;
            }
            #search_nav_${elementId} .nav-links a:hover {
                color: ${window.location.host === "www.google.com" ? "#1967d2" : "#1a73e8"};
                background: ${window.location.host === "www.google.com" ?
                    "rgba(26, 115, 232, 0.08)" :
                    "rgba(26, 115, 232, 0.05)"};
                transform: translateY(-1px);
            }
            #search_nav_${elementId} .nav-section {
                margin-bottom: 12px;
                width: 100%;
            }
            #search_nav_${elementId} .nav-section:last-child {
                margin-bottom: 0;
            }
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        // 创建导航HTML
        let html = `<div id="search_nav_${elementId}">`;
        navigationData.forEach(category => {
            html += `
                <div class="nav-section">
                    <div class="nav-title">${category.name}</div>
                    <div class="nav-links">
            `;

            category.list.forEach(item => {
                html += `<a href="javascript:void(0)" data-url="${item.url}">${item.name}</a>`;
            });

            html += `</div></div>`;
        });
        html += '</div>';

        // 添加到页面
        const targetElement = document.querySelector(element);
        if (targetElement) {
            targetElement.insertAdjacentHTML('afterbegin', html);

            // 绑定点击事件
            const searchInput = document.querySelector(elementInput);
            document.querySelectorAll(`#search_nav_${elementId} a`).forEach(link => {
                link.addEventListener('click', () => {
                    const keyword = searchInput ? searchInput.value : '';
                    const url = link.dataset.url.replace('@@', encodeURIComponent(keyword));
                    window.open(url, '_blank');
                });
            });
        }
    };

    // 搜索引擎结果优化
    this.hooks = function () {
        const host = window.location.host;
        if (host === "www.baidu.com") {
            this.hookBaidu();
        } else if (host === "www.google.com") {
            this.hookGoogle();
        }
    };

    // 百度搜索优化
    this.hookBaidu = function () {
        // 移除广告
        const removeAds = () => {
            document.querySelectorAll('div[style*="visibility"][id*="1"]').forEach(el => el.remove());
            document.querySelectorAll('.ec_tuiguang_link').forEach(el => el.remove());
        };

        // 定期检查并移除广告
        setInterval(removeAds, 1000);

        // 搜索结果新标签页打开
        document.querySelectorAll('#content_left a').forEach(link => {
            link.setAttribute('target', '_blank');
        });
    };

    // Google搜索优化
    this.hookGoogle = function () {
        // 搜索结果新标签页打开
        const addTargetBlank = () => {
            document.querySelectorAll('#search .g a:not([target="_blank"])').forEach(link => {
                if (!link.getAttribute('target')) {
                    link.setAttribute('target', '_blank');
                }
            });
        };

        // 增加延迟，确保页面元素加载完成
        setTimeout(() => {
            addTargetBlank();
        }, 1000);
    };

    // 初始化显示
    this.show = function () {
        const host = window.location.host;
        const currentEngine = this.searchEnginesData.find(engine => engine.host === host);

        if (currentEngine) {
            this.createHtml(currentEngine.element, currentEngine.elementInput, this.defaultNavigationData);
            this.hooks();
        }
    };

    // 启动
    this.start = function () {
        this.show();
    };
}

// 启动脚本
(new SearchEnginesNavigation()).start();
