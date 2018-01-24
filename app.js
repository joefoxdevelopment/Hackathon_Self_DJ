var pickAndPlay = function(source) {
    var audio     = document.getElementById(".player" + source);
    var container = document.querySelector(".source" + source);
    var sound     = document.querySelector(".picker"+source+"[type=file]").files[0];
    var reader    = new FileReader();

    reader.addEventListener("load", function () {
        container.src = reader.result;
    }, false);

    if (sound) {
        reader.readAsDataURL(sound);
    }
};

var fade = function() {
    var player1 = document.getElementById("player1");
    var player2 = document.getElementById("player2");
    var slider  = document.getElementById("mixer");
    var vol     = slider.value / slider.max;

    player1.volume = vol * document.getElementById("vol1").value;
    player2.volume = (1 - vol) * document.getElementById("vol2").value;
};

var vol = function(source) {
    var player = document.getElementById("player" + source);
    var slider = document.getElementById("vol" + source);
    player.volume = slider.value/slider.max;
};
