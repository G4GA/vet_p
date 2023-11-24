//Maybe an import goes here, need to understand NodeJs and electron first tho
const {ipcRenderer} = require('electron');
//HTML elements
var u_input = document.getElementById ('textName');
var cap = false;


u_input.focus();
u_input.select();

var button = document.getElementById('logInB');

const validate_cred = () => {
    const username = u_input.value;
    const password = document.getElementById ('textPwd').value;
    ipcRenderer.send('login-click',{username,password});
}

const showResult = (result) => {
    var resultHTML = document.getElementById('result-str')
    if (!resultHTML) {
        resultHTML = document.createElement('p');
        resultHTML.id = 'result-str';
        document.getElementById('logInput').appendChild(resultHTML);
    }

    resultHTML.style.textAlign = 'center';

    if (result) {
        resultHTML.style.color = 'green';
        resultHTML.innerHTML = 'Ingreso exitoso';
    }
    else {
        resultHTML.style.color = 'red';
        resultHTML.innerHTML = 'Usuario o contraseña incorrecta';
    }
}

button.addEventListener('click',() => {
    validate_cred();
});

document.addEventListener("keyup", function(event) {
    // If "caps lock" is pressed, display the warning text
    if (event.key==='CapsLock'){
        if (event.getModifierState("CapsLock")) {
            var cap_element = document.getElementById('caps');
            console.log(cap_element);
            if (!cap_element) {
                cap_element = document.createElement('p');
                cap_element.id = 'caps';
                cap_element.style.fontSize = 'small';
                cap_element.style.textAlign = 'center';
                cap_element.style.margin = '0px';
                document.getElementById('logInput').appendChild(cap_element);
                cap_element.innerHTML = 'Mayusculas activadas';
            } else {
                cap_element.remove();
            }
        }
    }
  });

document.addEventListener('keypress', (event) => {
    console.log('Foo');
    if (event.key==='Enter'){
        validate_cred();
    }
});


ipcRenderer.on('login-repply',(event,result) => {
    showResult(result);
});