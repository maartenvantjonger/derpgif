App = {
    serviceUrl: "http://gifs.com/r.json",
    images: [],
    imageIndex: 0,

    initialize: function () {
        App.downloadImage(function(imageUrl) {
            App.displayImage(0);
            App.downloadImage();
            App.downloadImage();
        });
    },
    downloadImage: function(whenDone) {
        $.getJSON(App.serviceUrl, function(response) {
            var imageUrl = response.gif_url;
            console.log("Downloading: " + imageUrl);

            var testImage = new Image();
            testImage.onerror = function() {
                console.log("Failed downloading: " + imageUrl);
                App.downloadImage(whenDone);
            };
            testImage.onload = function () {
                console.log("Succesfully downloaded: " + imageUrl);
                App.images.push(imageUrl);
                if (whenDone) {
                    whenDone(imageUrl);
                }
            };
            testImage.src = response.gif_url;
        });
    },
    displayImage: function(imageIndex) {
        App.imageIndex = imageIndex;
        var imageUrl = App.images[imageIndex];
        document.body.style.backgroundImage = "url(" + imageUrl + ")";
    },
    previous: function() {
        if (App.imageIndex > 0) {
            App.displayImage(App.imageIndex - 1);
        }
    },
    next: function() {
        var imageReady = false;

        if (App.imageIndex < App.images.length - 1) {
            imageReady = true;
            App.displayImage(App.imageIndex + 1);
        }

        if (App.imageIndex >= App.images.length - 2) {
            console.log("Preloading image");
            App.downloadImage(function () {
                if (!imageReady) {
                    App.displayImage(App.imageIndex + 1);
                }
            });
        }
    }
};

App.initialize();