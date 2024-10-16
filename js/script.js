
"use strict";

(function () {
    // Global variables
    var userAgent = navigator.userAgent.toLowerCase(),
        initialDate = new Date(),

        $document = $(document),
        $window = $(window),
        $html = $("html"),
        $body = $("body"),

        isDesktop = $html.hasClass("desktop"),
        isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        windowReady = false,
        isNoviBuilder = false,
        loaderTimeoutId,
        plugins = {
            bootstrapTooltip: $("[data-toggle='tooltip']"),
            bootstrapModalDialog: $('.modal'),
            bootstrapTabs: $(".tabs-custom"),
            rdNavbar: $(".rd-navbar"),
            mfp: $('[data-lightbox]').not('[data-lightbox="gallery"] [data-lightbox]'),
            mfpGallery: $('[data-lightbox^="gallery"]'),
            materialParallax: $(".parallax-container"),
            rdGoogleMaps: $(".rd-google-map"),
            rdMailForm: $(".rd-mailform"),
            rdInputLabel: $(".form-label"),
            regula: $("[data-constraints]"),
            selectFilter: $("select"),
            stepper: $("input[type='number']"),
            wow: $(".wow"),
            owl: $(".owl-carousel"),
            swiper: $(".swiper-slider"),
            slick: $('.slick-slider'),
            search: $(".rd-search"),
            searchResults: $('.rd-search-results'),
            statefulButton: $('.btn-stateful'),
            isotope: $(".isotope"),
            popover: $('[data-toggle="popover"]'),
            viewAnimate: $('.view-animate'),
            radio: $("input[type='radio']"),
            checkbox: $("input[type='checkbox']"),
            customToggle: $("[data-custom-toggle]"),
            counter: $(".counter"),
            progressLinear: $(".progress-linear"),
            circleProgress: $(".progress-bar-circle"),
            countDown: $('[data-circle-countdown]'),
            preloader: $(".preloader"),
            captcha: $('.recaptcha'),
            scroller: $(".scroll-wrap"),
            lightGallery: $("[data-lightgallery='group']"),
            lightGalleryItem: $("[data-lightgallery='item']"),
            lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
            mailchimp: $('.mailchimp-mailform'),
            campaignMonitor: $('.campaign-mailform'),
            copyrightYear: $(".copyright-year"),
            buttonWinona: $('.button-winona'),
            rdRange: $('.rd-range'),
            radioPanel: $('.radio-panel .radio-inline'),
            hoverdir: $('.hoverdir .hoverdir-item'),
            multitoggle: document.querySelectorAll('[data-multitoggle]'),
            customWaypoints: $('[data-custom-scroll-to]'),
        };

    // Initialize scripts that require a loaded page
    $window.on('load', function () {
        // Page loader & Page transition
        if (plugins.preloader.length && !isNoviBuilder) {
            pageTransition({
                page: $('.page'),
                animDelay: 500,
                animDuration: 500,
                animIn: 'fadeIn',
                animOut: 'fadeOut',
                conditions: function (event, link) {
                    return !/(\#|callto:|tel:|mailto:|:\/\/)/.test(link) && !event.currentTarget.hasAttribute('data-lightgallery');
                },
                onReady: function () {
                    clearTimeout(loaderTimeoutId);
                    plugins.preloader.addClass('loaded');
                    windowReady = true;
                }
            });
        }
    });

    // Initialize scripts that require a finished document
    $(function () {
        isNoviBuilder = window.xMode;

        /**
         * @desc Calculate the height of swiper slider basing on data attr
         * @param {object} object - slider jQuery object
         * @param {string} attr - attribute name
         * @return {number} slider height
         */
        function getSwiperHeight(object, attr) {
            var val = object.attr("data-" + attr),
                dim;

            if (!val) {
                return undefined;
            }

            dim = val.match(/(px)|(%)|(vh)|(vw)$/i);

            if (dim.length) {
                switch (dim[0]) {
                    case "px":
                        return parseFloat(val);
                    case "vh":
                        return $window.height() * (parseFloat(val) / 100);
                    case "vw":
                        return $window.width() * (parseFloat(val) / 100);
                    case "%":
                        return object.width() * (parseFloat(val) / 100);
                }
            } else {
                return undefined;
            }
        }

        /**
         * @desc Toggle swiper videos on active slides
         * @param {object} swiper - swiper slider
         */
        function toggleSwiperInnerVideos(swiper) {
            var prevSlide = $(swiper.slides[swiper.previousIndex]),
                nextSlide = $(swiper.slides[swiper.activeIndex]),
                videos,
                videoItems = prevSlide.find("video");

            for (var i = 0; i < videoItems.length; i++) {
                videoItems[i].pause();
            }

            videos = nextSlide.find("video");
            if (videos.length) {
                videos.get(0).play();
            }
        }

        /**
         * @desc Toggle swiper animations on active slides
         * @param {object} swiper - swiper slider
         */
        function toggleSwiperCaptionAnimation(swiper) {
            var prevSlide = $(swiper.container).find("[data-caption-animate]"),
                nextSlide = $(swiper.slides[swiper.activeIndex]).find("[data-caption-animate]"),
                delay,
                duration,
                nextSlideItem,
                prevSlideItem;

            for (var i = 0; i < prevSlide.length; i++) {
                prevSlideItem = $(prevSlide[i]);

                prevSlideItem.removeClass("animated")
                    .removeClass(prevSlideItem.attr("data-caption-animate"))
                    .addClass("not-animated");
            }

            var tempFunction = function (nextSlideItem, duration) {
                return function () {
                    nextSlideItem
                        .removeClass("not-animated")
                        .addClass(nextSlideItem.attr("data-caption-animate"))
                        .addClass("animated");
                    if (duration) {
                        nextSlideItem.css('animation-duration', duration + 'ms');
                    }
                };
            };

            for (var i = 0; i < nextSlide.length; i++) {
                nextSlideItem = $(nextSlide[i]);
                delay = nextSlideItem.attr("data-caption-delay");
                duration = nextSlideItem.attr('data-caption-duration');
                if (!isNoviBuilder) {
                    if (delay) {
                        setTimeout(tempFunction(nextSlideItem, duration), parseInt(delay, 10));
                    } else {
                        tempFunction(nextSlideItem, duration);
                    }
                } else {
                    nextSlideItem.removeClass("not-animated")
                }
            }
        }

        // Example pushState and popstate handling with AJAX
        $(".nav-link").on('click', function(event) {
            event.preventDefault();  // Evitar recargar la página completa
            let url = $(this).attr("href");

            // Cargar contenido dinámico
            $.ajax({
                url: url,
                success: function(data) {
                    $("#contenido").html(data);
                    history.pushState({path: url}, '', url);
                }
            });
        });

        // Manejo del botón "atrás" del navegador
        window.addEventListener('popstate', function(event) {
            if (event.state) {
                $.ajax({
                    url: event.state.path,
                    success: function(data) {
                        $("#contenido").html(data);
                    }
                });
            }
        });
    });
})();
