var pickAndPlay = function(source) {
    var audio     = window.players[source - 1];
    var container = document.querySelector(".source" + source);
    var sound     = document.querySelector(".picker"+source+"[type=file]").files[0];
    var reader    = new FileReader();

    var file = URL.createObjectURL(sound);
    container.src = file;

    audio.load();
};

var calcVol = function() {
    var player2 = document.getElementById("player2");
    var slider  = document.getElementById("mixer");
    var vol1    = document.getElementById("vol1");
    var vol2    = document.getElementById("vol2");

    window.players[1].volume = ((vol2.value/vol2.max) * slider.value)/slider.max;
    window.players[0].volume = ((vol1.value/vol1.max) * (slider.max - slider.value))/slider.max;
}

window.addEventListener('load', function() {
    window.players = [
        document.getElementById("player1"),
        document.getElementById("player2"),
    ];
});
