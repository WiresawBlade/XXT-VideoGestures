// ==UserScript==
// @name         超星学习通视频手势
// @namespace    https://github.com/WiresawBlade/XXT-VideoGestures
// @version      1.0
// @description  为学习通的视频控件添加键盘操作手势
// @author       锯刃Blade
// @match        *://*.chaoxing.com/*
// @grant        none
// ==/UserScript==

/**
 * 说明
 * 本脚本不包含任何字面意义上的作弊功能
 * 
 * 默认配置如下：
 * 回退：a/左方向键
 * 前进：d/右方向键
 * 暂停或恢复：s
 * 全屏：w/f
 * 静音：m
*/

(() => {
    "use strict";

    const gestures = {
        /** 时间调节步长，单位：秒 */
        timeStep: 1,

        /** 不同事件对应的按键 */
        keys: {
            "back": ["a", "A", "ArrowLeft"],
            "forward": ["d", "D", "ArrowRight"],
            "toggle": ["s", "S"],
            "fullscreen": ["f", "F", "w", "W"],
            "mute": ["m", "M"]
        },

        /**
         * 判断当前按下的单个按键对应哪个事件
         * @param { string } key 
         * @returns { string | undefined }
         */
        selectOneKey: function (key) {
            for (const k in this.keys) {
                /** @type { string[] } */
                const keyArr = this.keys[k];

                if (keyArr.includes(key)) {
                    return k;
                }
            }
        }
    };

    // 开启监控，检测元素插入
    const observer = new MutationObserver(addVideoGestures);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function addVideoGestures() {
        const reader = $("#reader").get(0);
        if (reader !== null) {
            /** @type { HTMLVideoElement } */
            const video = $("#video_html5_api").get(0);
            observer.disconnect();

            // 键盘按下事件
            reader.addEventListener("keydown", (ev) => {
                const currentKey = ev.key;

                // 策略模式，根据事件类型执行不同函数
                const matchEvent = {
                    "back": () => {
                        video.currentTime = video.currentTime - 1;
                    },

                    "forward": () => {
                        video.currentTime = video.currentTime + 1;
                    },

                    "toggle": () => {
                        if (video.paused) {
                            video.play();
                        } else {
                            video.pause();
                        }
                    },

                    "fullscreen": () => {
                        // 不使用 H5 的全屏方案，使用网站提供的
                        /** @type { HTMLButtonElement } */
                        const fsbutton = $(".vjs-fullscreen-control").get(0);
                        fsbutton.click();
                    },

                    "mute": () => {
                        /** @type { HTMLButtonElement } */
                        const muteButton = $(".vjs-mute-control").get(0);
                        muteButton.click();
                    }
                }

                matchEvent[gestures.selectOneKey(currentKey)]();
            });
        }
    }
})();
