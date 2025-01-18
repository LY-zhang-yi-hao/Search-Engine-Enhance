// ==UserScript==
// @name              搜索引擎增强
// @namespace         search_enhance_namespace
// @version           1.0.0
// @description       搜索引擎导航增强,支持百度、必应、Google等
// @author            Your Name
// @include           *://www.baidu.com/*
// @include           *://www.so.com/s*
// @include           *://www.sogou.com/web*
// @include           *://cn.bing.com/search*
// @include           *://www.google.com/search*
// @require           https://code.jquery.com/jquery-3.6.0.min.js
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @license           MIT License
// ==/UserScript==

function SearchEnginesNavigation(){
    // 导航配置数据
    this.searchEnginesData = [
        {"host":"www.baidu.com", "element":"#content_right","elementInput":"#kw"},
        {"host":"www.so.com", "element":"#side","elementInput":"#keyword"},
        {"host":"www.sogou.com", "element":"#right","elementInput":"#upquery"},
        {"host":"cn.bing.com", "element":"#b_context","elementInput":"#sb_form_q"},
        {"host":"www.google.com", "element":"#rhs,#rcnt", "elementInput":"input[name='q'],textarea[name='q']"},
        {"host":"www.google.com.hk", "element":"#rhs,#rcnt", "elementInput":"input[name='q'],textarea[name='q']"}
    ];
    
    // 默认导航数据
// 修改 defaultNavigationData 部分
this.defaultNavigationData = [
    {"name":"搜索引擎","list":[
        {"name":"百度", "url":"https://www.baidu.com/s?wd=@@"},
        {"name":"必应", "url":"https://cn.bing.com/search?q=@@"}, 
        {"name":"Google", "url":"https://www.google.com/search?q=@@"}
    ]},
    {"name":"综合搜索","list":[
        {"name":"知乎搜索", "url":"https://www.zhihu.com/search?q=@@"},
        {"name":"豆瓣搜索", "url":"https://www.douban.com/search?q=@@"},
        {"name":"小红书", "url":"https://www.xiaohongshu.com/search_result?keyword=@@"},
        {"name":"CSDN", "url":"https://so.csdn.net/so/search?q=@@"},
        {"name":"博客园", "url":"https://www.cnblogs.com/search?q=@@"}
    ]},
    {"name":"视频搜索","list":[
        {"name":"B站搜索", "url":"https://search.bilibili.com/all?keyword=@@"},
        {"name":"抖音", "url":"https://www.douyin.com/search/@@"},
        {"name":"YouTube", "url":"https://www.youtube.com/results?search_query=@@"}
    ]}
];

    // 创建导航HTML
    this.createHtml = function(element, elementInput, navigationData){
        const elementId = Math.ceil(Math.random()*100000000);
        
        // 创建CSS样式
        const css = `
            #search_nav_${elementId} {
                margin: 10px 0;
                padding: 10px;
            }
            #search_nav_${elementId} .nav-title {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 8px;
                color: #333;
            }
            #search_nav_${elementId} .nav-links {
                display: flex;
                flex-wrap: wrap;
            }
            #search_nav_${elementId} .nav-links a {
                display: inline-block;
                margin: 3px 6px 3px 0;
                padding: 4px 8px;
                color: #333;
                text-decoration: none;
                font-size: 13px;
                background: #f8f9fa;
                border-radius: 3px;
            }
            #search_nav_${elementId} .nav-links a:hover {
                color: #1a73e8;
                background: #f1f3f4;
            }
            #search_nav_${elementId} .nav-section {
                margin-bottom: 15px;
                width: 100%;
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
        if(targetElement) {
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
    this.hooks = function(){
        const host = window.location.host;
        if(host === "www.baidu.com"){
            this.hookBaidu();
        }else if(host === "www.google.com"){
            this.hookGoogle(); 
        }
    };
    
    // 百度搜索优化
    this.hookBaidu = function() {
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
    this.hookGoogle = function() {
        // 搜索结果新标签页打开
        const addTargetBlank = () => {
            document.querySelectorAll('#search .g a:not([target="_blank"])').forEach(link => {
                if(!link.getAttribute('target')) {
                    link.setAttribute('target', '_blank');
                }
            });
        };
        
        // 由于 Google 搜索结果是动态加载的，需要定期检查
        setInterval(addTargetBlank, 1000);
        
        // 调整导航样式以适应 Google 界面
        const css = `
            #search_nav_${elementId} {
                margin: 0 16px;
                padding: 16px;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 1px 6px rgba(32,33,36,0.28);
            }
            #search_nav_${elementId} .nav-links a {
                color: #202124;
                background: #f8f9fa;
            }
            #search_nav_${elementId} .nav-links a:hover {
                color: #1a73e8;
                background: #f1f3f4;
            }
            #search_nav_${elementId} .nav-title {
                color: #202124;
            }
        `;
        
        // 添加 Google 专用样式
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    // 初始化显示
    this.show = function(){
        const host = window.location.host;
        const currentEngine = this.searchEnginesData.find(engine => engine.host === host);
        
        if(currentEngine) {
            this.createHtml(currentEngine.element, currentEngine.elementInput, this.defaultNavigationData);
            this.hooks();
        }
    };

    // 启动
    this.start = function(){
        this.show();
    };
}

// 启动脚本
(new SearchEnginesNavigation()).start(); 