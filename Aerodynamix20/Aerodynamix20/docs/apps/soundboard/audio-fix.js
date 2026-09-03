// The upstream soundboard currently builds audio URLs from the old genizy
// mirror. Keep the upstream UI/catalog, but send those requests to the
// repository that actually serves the files.
(function () {
    var nativeAudio = window.Audio;
    var brokenRoot = 'https://cdn.jsdelivr.net/gh/genizy/soundboard@main/';
    var workingRoot = 'https://cdn.jsdelivr.net/gh/bubblfan/soundboard@main/';

    window.Audio = function Audio(source) {
        if (typeof source === 'string' && source.indexOf(brokenRoot) === 0) {
            source = workingRoot + source.slice(brokenRoot.length).replace(/^\/+/, '');
        }
        return new nativeAudio(source);
    };
    window.Audio.prototype = nativeAudio.prototype;
})();