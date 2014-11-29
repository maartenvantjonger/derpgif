App = {
    serviceUrl: "http://gifs.com/r.json",
    images: [],
    imageIndex: 0,
    liveImage: null,
    preloadImage: null,

    initialize: function () {
        App.liveImage = $(".imageA");
        App.preloadImage = $(".imageB");

        App.downloadImage(function(imageUrl) {
            App.displayImage(0);
            App.downloadImage();
            App.downloadImage();
        });
    },
    downloadImage: function(whenDone) {
        $.getJSON(App.serviceUrl, function(response) {
            var imageUrl = response.gif_url;
            //console.log("Downloading: " + imageUrl);

            var testImage = new Image();
            testImage.onerror = function() {
                //console.log("Failed downloading: " + imageUrl);
                App.downloadImage(whenDone);
            };
            testImage.onload = function () {
                //console.log("Succesfully downloaded: " + imageUrl);
                App.images.push(imageUrl);
                if (whenDone) {
                    whenDone(imageUrl);
                }
            };
            testImage.src = response.gif_url;
        });
    },
    displayImage: function(imageDelta) {
        App.imageIndex += imageDelta;
        var imageUrl = "url(" + App.images[App.imageIndex] + ")";
        App.preloadImage.css("background-image", imageUrl);

        var preloadImage = App.preloadImage;
        var liveImage = App.liveImage;

        if (imageDelta > 0) {
            preloadImage.css({ "transition":"0", "transform":"translate3d(100%, 0, 0)" });
            preloadImage.redraw().css({ "transition":"500ms", "transform":"translate3d(0, 0, 0)" });
            liveImage.css({ "transition":"500ms", "transform":"translate3d(-100%, 0, 0)" });
        }
        else if (imageDelta < 0) {
            preloadImage.css({ "transition":"0", "transform":"translate3d(-100%, 0, 0)" });
            preloadImage.redraw().css({ "transition":"500ms", "transform":"translate3d(0, 0, 0)" });
            liveImage.css({ "transition":"500ms", "transform":"translate3d(100%, 0, 0)" });
        }

        App.liveImage = App.preloadImage;
        App.preloadImage = liveImage;
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
            //console.log("Preloading image");
            App.downloadImage(function () {
                if (!imageReady) {
                    App.displayImage(1);
                }
            });
        }
    }
};

$(document).ready(function() {
    App.initialize();
});

$.fn.redraw = function(){
  this.each(function(){
    var redraw = this.offsetHeight;
  });

  return this;
};
