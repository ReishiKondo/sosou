window.onload = async () => {
    let response = await fetch('/get-count');
    console.log(response);
    let reply = await response.json();
    console.log(reply);
    for (let i = 0; i < 25; i++) {
        document.querySelector(`#counter-${i}`).innerText = reply[`counter${i + 1}`];
    }
}


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
        const incrementButton = document.getElementById(`increment-${i}`);
        const decrementButton = document.getElementById(`decrement-${i}`);

        //let counterValue = localStorage.getItem(`counter-${i}`) ? parseInt(localStorage.getItem(`counter-${i}`)) : 0;
        //counterElement.textContent = counterValue;
        const response = await fetch(`/counter-value${i + 1}`);
        console.log("test");
        //document.querySelector(`#counter-value${i}`).innerText = await response.text();
        counterElement.textContent = await response.text();
    }

}


