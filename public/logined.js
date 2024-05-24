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
        sendData(`${i + 1}`, 0)
    });

    decrementButton.addEventListener('click', () => {
        counterValue--;
        counterElement.textContent = counterValue;
        localStorage.setItem(`counter-${i}`, counterValue);
    });
}

async function sendData() {
    try {
        const response = await fetch('http://localhost:8000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'

            },
            body: JSON.stringify({ counter_id: 2, upDown: 0 })
        });

        const data = await response.json();
        console.log(data); // サーバーからのレスポンスデータにアクセスできます
    } catch (error) {
        console.error('Error:', error);
    }
}



// PUTリクエストを送信
document.getElementById('myButton').addEventListener('click', () => sendData());



{/* <script>
    




    const element = document.getElementById("update-target");



    async function sendData(id, upDown) {
      try {
        const requestBody = {
          counter_id: id, // 変数の値を使って counter_id の値を設定
          upDown: upDown
        };
        console.log(requestBody);

        const response = await fetch('http://localhost:8000/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'

          },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log(data); // サーバーからのレスポンスデータにアクセスできます
      } catch (error) {
        console.error('Error:', error);
      }
    }
  </script> */}