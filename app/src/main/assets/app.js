App = {
    serviceUrl: "http://api.gifme.io/v1/gifs/random?key=rX7kbMzkGu7WJwvG&term=", //"http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=", //"http://gifs.com/r.json",
    tag: "",
    images: [],
    imageIndex: 0,
    enableLogging: false,

    initialize: function () {
        App.downloadImage(function(imageUrl) {
            App.displayImage(0);
            App.downloadImage();
            App.downloadImage();
        });
    },
    downloadImage: function(whenDone) {
        $.getJSON(App.serviceUrl + App.tag, function(response) {
            var imageUrl = response.gif.gif; //response.data.image_url; //response.gif_url;
            App.log("Downloading: " + imageUrl);

            var testImage = new Image();
            testImage.onerror = function() {
                App.log("Failed downloading: " + imageUrl);
                setTimeout(function() {
                    App.downloadImage(whenDone);
                }, 1000);
            };
            testImage.onload = function () {
                App.log("Succesfully downloaded: " + imageUrl);
                App.images.push(imageUrl);
                if (whenDone) {
                    whenDone(imageUrl);
                }
            };
            testImage.src = imageUrl;
        });
    },
    displayImage: function(imageDelta) {
        App.imageIndex += imageDelta;
        var imageUrl = "url(" + App.images[App.imageIndex] + ")";

        var liveImage = $(".live");
        var preloadImage = $(".preload");
        preloadImage.css("background-image", imageUrl);

        if (imageDelta !== 0) {
            liveImage.one("transitionend", function() {
                $(this).css("background-image", "");
                App.log("Former live image cleared");
            });

            var preloadOrigin = imageDelta > 0 ? "100%" : "-100%";
            var liveDestination = imageDelta > 0 ? "-100%" : "100%";

            preloadImage
                .css({ "transition":"0", "transform":"translate3d(" + preloadOrigin + ", 0, 0)" })
                .redraw()
                .css({ "transition":"500ms", "transform":"translate3d(0, 0, 0)" });
            liveImage
                .css({ "transition":"500ms", "transform":"translate3d(" + liveDestination + ", 0, 0)" });
        }

        liveImage.toggleClass("preload live");
        preloadImage.toggleClass("preload live");
    },
    previous: function() {
        if (App.imageIndex > 0) {
            App.displayImage(-1);
        }
    },
    next: function() {
        var imageReady = false;

        if (App.imageIndex < App.images.length - 1) {
            imageReady = true;
            App.displayImage(1);
        }

        if (App.imageIndex >= App.images.length - 2) {
            App.log("Preloading image");
            App.downloadImage(function () {
                if (!imageReady) {
                    App.displayImage(1);
                }
            });
        }
    },
    search: function(text) {
        App.tag = encodeURIComponent(text);

        App.downloadImage(function(imageUrl) {
            var imageDelta = App.images.length - 1 - App.imageIndex;
            App.displayImage(imageDelta);
        });
    },
    log: function(message) {
        if (App.enableLogging) {
            console.log(message);
        }
    }
};

$(document).ready(function() {
    App.initialize();
});

$.fn.redraw = function() {
    this.each(function() {
        var redraw = this.offsetHeight;
    });

    return this;
};
