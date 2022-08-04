const username = prompt("Welcome to Aajcoders chat!\n Please enter your username:")
const socket = io('http://localhost:9000', {
    query:{
        username
    }
});
let nsSocket = "";
socket.on('nsList', (nsData)=>{
    let namespaceDiv = document.querySelector('.namespaces');
    namespaceDiv.innerHTML = "";
    nsData.forEach((data)=>{
        namespaceDiv.innerHTML += `<div class="namespace" ns=${data.endpoint}> <img src="${data.img}" /> </div>`
    });

    Array.from(document.getElementsByClassName('namespace')).forEach((element)=>{
        element.addEventListener('click', (event)=>{
            const endpoint = element.getAttribute('ns');
            joinNS(endpoint);
        });
    });
    joinNS('/fs');
});




