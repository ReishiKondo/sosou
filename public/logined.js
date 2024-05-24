
async function reloadCount() {
    let response = await fetch('/get-count');
    console.log(response);
    let reply = await response.json();
    console.log(reply);
    for (let i = 0; i < 25; i++) {
        document.querySelector(`#counter-${i}`).innerText = reply[`counter${i + 1}`];
    }
}



window.onload = async () => {
    reloadCount();
}

const reloadButton = document.getElementById("reload");
reloadButton.addEventListener("click", async () => { reloadCount() });


const counterContainer = document.getElementById('counters');
const counterCount = 25;

for (let i = 0; i < counterCount; i++) {
    const counterDiv = document.createElement('div');
    counterDiv.className = 'counter-container';
    counterDiv.innerHTML = `
            <div>Counter ${i + 1}</div>
            <div id="counter-${i}" class="counter">0</div>
            <button id="increment-${i}">Increment</button>
            <button id="decrement-${i}">Decrement</button>
        `;
    counterContainer.appendChild(counterDiv);
}

for (let i = 0; i < counterCount; i++) {
    const counterElement = document.getElementById(`counter-${i}`);
    const incrementButton = document.getElementById(`increment-${i}`);
    const decrementButton = document.getElementById(`decrement-${i}`);

    let counterValue = localStorage.getItem(`counter-${i}`) ? parseInt(localStorage.getItem(`counter-${i}`)) : 0;
    counterElement.textContent = counterValue;

    incrementButton.addEventListener('click', () => {
        renewCount(`${i + 1}`, 0);
    });

    decrementButton.addEventListener('click', () => {
        renewCount(`${i + 1}`, 1);
    });
}

async function renewCount(id, upDown01) {
    try {
        const response = await fetch('/renew-count', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ counter_id: id, upDown: upDown01 })
        });

        const data = await response.json();
        console.log(data); // サーバーからのレスポンスデータにアクセスできます
        await reloadCount();
    } catch (error) {
        console.error('Error:', error);
    }
}

