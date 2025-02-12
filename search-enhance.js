// ==UserScript==
// @name              搜索引擎增强
// @namespace         search_enhance_namespace
// @version           3.0.0
// @description       搜索引擎导航增强,支持百度、必应、Google等
// @author            Your Name
// @include           *://www.baidu.com/*
// @include           *://www.so.com/s*
// @include           *://www.sogou.com/web*
// @include           *://cn.bing.com/search*
// @include           *://www.bing.com/search*
// @include           *://www.google.com/search*
// @include           *://www.google.com.hk/search*
// @require           https://code.jquery.com/jquery-3.6.0.min.js
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @license           MIT License
// ==/UserScript==

function SearchEnginesNavigation() {
    // 导航配置数据（统一使用body作为容器）
    this.searchEnginesData = [
        {"host": "www.baidu.com", "element": "body", "elementInput": "#kw"},
        {"host": "www.so.com", "element": "body", "elementInput": "#keyword"},
        {"host": "www.sogou.com", "element": "body", "elementInput": "#upquery"},
        {"host": "cn.bing.com", "element": "body", "elementInput": "#sb_form_q"},
        {"host": "www.bing.com", "element": "body", "elementInput": "#sb_form_q"},
        {"host": "www.google.com", "element": "body", "elementInput": "input[name='q'],textarea[name='q']"},
        {"host": "www.google.com.hk", "element": "body", "elementInput": "input[name='q'],textarea[name='q']"}
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
            {"name": "博客园", "url": "https://www.cnblogs.com/search?q=@@"},
            {"name": "GitHub", "url": "https://github.com/search?q=@@"}
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
        const hostKey = window.location.host;

        // 统一CSS样式
        const css = `
            #search_nav_${elementId} {
                position: fixed;
                top: ${GM_getValue(`navPosition_${hostKey}`)?.y || 120}px;
                left: ${GM_getValue(`navPosition_${hostKey}`)?.x || 20}px;
                z-index: 999999;
                width: 280px;
                max-height: 80vh;
                overflow-y: auto;
                cursor: move;
                user-select: none;
                padding: 12px 15px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
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
                color: #555;
                text-decoration: none;
                font-size: 13px;
                background: rgba(0, 0, 0, 0.02);
                border-radius: 6px;
                transition: all 0.2s ease;
            }
            #search_nav_${elementId} .nav-links a:hover {
                color: #1a73e8;
                background: rgba(26, 115, 232, 0.05);
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

            // 添加拖拽功能
            const navElement = document.querySelector(`#search_nav_${elementId}`);
            if (navElement) {
                let isDragging = false;
                let startX, startY, initialX, initialY;

                navElement.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    initialX = navElement.offsetLeft;
                    initialY = navElement.offsetTop;
                    navElement.style.opacity = '0.8';
                });

                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    navElement.style.left = `${initialX + dx}px`;
                    navElement.style.top = `${initialY + dy}px`;
                });

                document.addEventListener('mouseup', () => {
                    if (isDragging) {
                        isDragging = false;
                        navElement.style.opacity = '1';
                        GM_setValue(`navPosition_${hostKey}`, {
                            x: navElement.offsetLeft,
                            y: navElement.offsetTop
                        });
                    }
                });
            }
        }
    };

    // 搜索引擎结果优化
    this.hooks = function () {
        const host = window.location.host;
        if (host === "www.baidu.com") {
            this.hookBaidu();
        } else if (host === "www.google.com") {
            this.hookGoogle();
        } else if (host === "www.bing.com" || host === "cn.bing.com") {
            this.hookBing();
        }
    };

    // 必应搜索优化
    this.hookBing = function () {
        // 处理必应的广告
        const removeAds = () => {
            document.querySelectorAll('.b_ad').forEach(ad => ad.remove());
        };

        // 定期检查并移除广告
        setInterval(removeAds, 1000);

        // 新标签页打开搜索结果
        document.querySelectorAll('.b_algo a').forEach(link => {
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
