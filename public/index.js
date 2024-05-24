
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
            `;
    counterContainer.appendChild(counterDiv);
}

for (let i = 0; i < counterCount; i++) {

    async () => {
        const counterElement = document.getElementById(`counter-${i}`);
        const response = await fetch(`/counter-value${i + 1}`);
        console.log("test");
        counterElement.textContent = await response.text();
    }

}


