var auth = '';
onmessage = function ({ data }) {
    switch (data[0]) {
        case 'loop':
            loop();
            break;
        case 'auth':
            auth = data[1];
            break;
    }
};

function now() {
    const date = new Date();
    return [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
}

async function loop() {
    function end() {
        postMessage(['end']);
    }

    const result = await GoStumble().catch(() => {});
    if (!result) {
        postMessage(['message', `[${now()}] Cookie invalide ou expiré !`]);
        end();
    } else if (
        result == 'SERVER_ERROR' ||
        result.includes('User path limit exceeded')
    ) {
        postMessage(['message', `[${now()}] Erreur !`]);
        end();
    } else if (result.includes('User')) {
        const data = JSON.parse(result);
        const username = data.User.Username;
        const exp = data.User.Experience;
        const tokenPass = data.User.BattlePass.PassTokens;
        const trophy = data.User.SkillRating;
        const crown = data.User.Crowns;

        postMessage([
            'infos',
            {
                username,
                exp,
                tokenPass,
                trophy,
                crown
            }
        ]);
        postMessage(['message', `[${now()}] Recompenses accordés !`]);
        end();
    } else if (result == 'BANNED') {
        postMessage(['message', `[${now()}] Banned nigger !`]);
        end();
    } else {
        postMessage(['message', `[${now()}] Erreur !`]);
        end();
    }
}

function GoStumble() {
    return new Promise((resolve, reject) => {
        fetch('https://stumble-gays.herokuapp.com/round', {
            method: 'GET',
            headers: {
                authorization: auth
            }
        })
            .then((res) => res.text())
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
}
