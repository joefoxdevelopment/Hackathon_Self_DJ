var pickAndPlay = function(source) {
    var audio     = window.selfdj.players[source];
    var container = document.querySelector(".source" + source);
    var sound     = document.querySelector(".picker"+source+"[type=file]").files[0];
    var reader    = new FileReader();

    var file = URL.createObjectURL(sound);
    container.src = file;

    audio.load();
};

var calcVol = function() {
    var slider  = document.getElementById("mixer");
    var vol0    = document.getElementById("vol0");
    var vol1    = document.getElementById("vol1");

    var gain1 = window.selfdj.gains[1];
    var gain0 = window.selfdj.gains[0];

    gain1['volume'].gain.value = ((vol1.value/vol1.max) * slider.value)/slider.max;
    gain0['volume'].gain.value = ((vol0.value/vol0.max) * (slider.max - slider.value))/slider.max;
}

var changeEq = function(slider, type, source) {
    var value = slider.value / slider.max;

    var gains = window.selfdj.gains[source];

    switch(type)
    {
        case 'lowGain': gains.lGain.gain.value = value; break;
        case 'midGain': gains.mGain.gain.value = value; break;
        case 'highGain': gains.hGain.gain.value = value; break;
    }
};

window.addEventListener('load', function() {
    window.selfdj = {};

    window.selfdj.players = [
        document.getElementById("player0"),
        document.getElementById("player1"),
    ];

    window.selfdj.context  = new webkitAudioContext();

    window.selfdj.sources = [
        window.selfdj.context.createMediaElementSource(window.selfdj.players[0]),
        window.selfdj.context.createMediaElementSource(window.selfdj.players[1]),
    ];

    window.selfdj.gaindb = -40.0;
    window.selfdj.gainBandSplit = [360, 3600];

    window.selfdj.gains = [];

    window.selfdj.sources.forEach(function(source, index) {
        window.selfdj.gains[index] = [];

        var hBand = window.selfdj.context.createBiquadFilter();
        hBand.type = "lowshelf";
        hBand.frequency.value = window.selfdj.gainBandSplit[0];
        hBand.gain.value = window.selfdj.gaindb;

        var hInvert = window.selfdj.context.createGain();
        hInvert.gain.value = -1.0;

        var lBand = window.selfdj.context.createBiquadFilter();
        lBand.type = "lowshelf";
        lBand.frequency.value = window.selfdj.gainBandSplit[1];
        lBand.gain.value = window.selfdj.gaindb;

        var lInvert = window.selfdj.context.createGain();
        lInvert.gain.value = -1.0;

        var mBand = window.selfdj.context.createGain();

        hInvert.connect(mBand);
        lInvert.connect(mBand);

        hBand.connect(hInvert);
        lBand.connect(lInvert);

        source.connect(hBand);
        source.connect(mBand);
        source.connect(lBand);

        var lGain = window.selfdj.context.createGain();
        var mGain = window.selfdj.context.createGain();
        var hGain = window.selfdj.context.createGain();

        hBand.connect(hGain);
        mBand.connect(mGain);
        lBand.connect(lGain);

        var sum = window.selfdj.context.createGain();
        lGain.connect(sum);
        mGain.connect(sum);
        hGain.connect(sum);
        sum.connect(window.selfdj.context.destination);

        var volume = window.selfdj.context.createGain();
        source.connect(volume);
        volume.connect(window.selfdj.context.destination);

        window.selfdj.gains[index]['hGain'] = hGain;
        window.selfdj.gains[index]['mGain'] = mGain;
        window.selfdj.gains[index]['lGain'] = lGain;
        window.selfdj.gains[index]['volume'] = volume;
    });
});
