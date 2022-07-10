if (!window.Worker) {
    alert('LE NAVIGATEUR IL MARCHE PAS!');
    alert('faut changer de navigateur pour que ça marche negro');
    throw new Error('Navigator not compatible');
}

var toggled = false;
const button = document.getElementById('toggle');
const consol = document.getElementById('console');
const worker = new Worker('worker.js');

button.addEventListener('click', function () {
    toggled = !toggled;
    button.innerHTML = toggled ? 'Arrêter' : 'Commencer';
    if (toggled) {
        worker.postMessage(['auth', document.getElementById('auth').value]);
        worker.postMessage(['loop']);
    }
});

worker.onmessage = function ({ data }) {
    switch (data[0]) {
        case 'message':
            consol.innerHTML += data[1] + '<br />';
            break;
        case 'end':
            if (!toggled) break;
            setTimeout(() => {
                worker.postMessage(['loop']);
            }, parseInt(document.getElementById('delay').value));
            break;
        case 'infos':
            for (const i in data[1]) {
                document.getElementById(i).innerHTML = data[1][i];
            }
            break;
    }
};
