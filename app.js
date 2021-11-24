const d = document;

d.addEventListener('DOMContentLoaded', e => {
    fetchData();
    printLocalStorage('criptos');
});

//  Consumiendo JSON
const fetchData = async () => {
    try {
        const res = await fetch('data.json');
        const data = await res.json();
        //console.log(data);
        printCriptos(data);
        takeButtons(data);
    }
    catch (error) {
        console.log(error);
    }
};

//  Boton dark mode
const btnDark = d.getElementById('btn-dark');
const dataDark = d.querySelectorAll('[data-dark]');

//  Dark mode segun configuracion de sistema del usuario
const configUser = window.matchMedia('(prefers-color-scheme: dark)');
let children = btnDark.children[0];  // Sol y Luna
    if (configUser.matches){
        children.classList.remove('fa-moon');
        children.classList.add('fa-sun');

        btnDark.classList.remove('text-black');
        btnDark.classList.add('text-white');
    }

//  LocalStorage color theme
const localConfig = localStorage.getItem('theme');

if (localConfig === 'dark'){
        children.classList.remove('fa-moon');
        children.classList.add('fa-sun');

        btnDark.classList.remove('text-black');
        btnDark.classList.add('text-white');

        dataDark.forEach(e => {
            e.classList.add('dark-mode');
            e.classList.remove('light-mode');
        });
} else if (localConfig === 'light'){
        children.classList.remove('fa-sun');
        children.classList.add('fa-moon');

        btnDark.classList.add('text-black');
        btnDark.classList.remove('text-white');
    
        dataDark.forEach(e => {
            e.classList.add('light-mode');
            e.classList.remove('dark-mode');
        });
}

btnDark.addEventListener('click', e => {
    let colorTheme;

    if (children.classList.value == "fas fa-moon"){
        children.classList.remove('fa-moon');
        children.classList.add('fa-sun');

        btnDark.classList.remove('text-black');
        btnDark.classList.add('text-white');

        dataDark.forEach(e => {
            e.classList.add('dark-mode');
            e.classList.remove('light-mode');
        });

        colorTheme = d.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', colorTheme);
    } else {
        children.classList.remove('fa-sun');
        children.classList.add('fa-moon');

        btnDark.classList.add('text-black');
        btnDark.classList.remove('text-white');
    
        dataDark.forEach(e => {
            e.classList.add('light-mode');
            e.classList.remove('dark-mode');
        });
        
        colorTheme = d.body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', colorTheme);
    }
});

//  Cargando criptos al HTML
const containerCriptos = d.getElementById('containerCriptos');

const printCriptos = (data) => {
    const template = d.getElementById('templateCriptos').content;
    const fragment = new DocumentFragment(); // Utilizo fragment para evitar reflow y que se renderice la web por cada iteracion del forEach

    data.forEach(cripto => {
        template.querySelector('button').dataset.id = cripto.id;
        template.querySelectorAll('td')[0].textContent = cripto.nombre.toUpperCase();
        template.querySelectorAll('td')[1].textContent = '$ ' + cripto.precio;
        template.querySelectorAll('td')[2].textContent = '$ ' + cripto.cap;

        const clone = template.cloneNode(true); //  Modifico el template, lo clono y lo agrego al fragment sin incorporar al DOM
        fragment.appendChild(clone);
    });
    containerCriptos.appendChild(fragment); //  Agrego al DOM toda la estructura generada de una
}

//  Agregando log in
const btnLogIn = d.getElementById('logIn');
const modalLogIn = d.getElementsByClassName('container-modallogin')[0];
const formSubmit = d.getElementById('form');
const msgLogIn = d.getElementById('message-login');
const nameText = d.getElementById('name');

//  LocalStorage log in
const userConfig = localStorage.getItem('user');

if (userConfig !== null){
    modalLogIn.style.display = "none";
    btnLogIn.style.display = "none";

    msgLogIn.innerHTML = userConfig;
    }

btnLogIn.addEventListener('click', () => {
    modalLogIn.style.display = "flex";

});

formSubmit.addEventListener('submit', e => {
    e.preventDefault();

    modalLogIn.style.display = "none";
    btnLogIn.style.display = "none";
    msgLogIn.innerHTML += `Bienvenido, ${nameText.value}`;

    localStorage.setItem('user', msgLogIn.innerHTML);
});

//  Modal | Boton de cierre
let btnClose = d.getElementsByClassName("close-btn")[0];

const closeBtn = () => {
    modalLogIn.style.display = "none";
}

const outsideClick = (e) => {
    if (e.target == modalLogIn) {
        modalLogIn.style.display = "none";
    }
}

btnClose.addEventListener("click", closeBtn);
window.addEventListener("click", outsideClick);

//  Almacenar criptos en Portfolio
let portfolio = {};

//  Tomando botones para agregar al Portofolio
const takeButtons = (data) => {
    const buttons = d.querySelectorAll('th button');
    
    buttons.forEach(btn => { 
        btn.addEventListener('click', () => {
            const cripto = data.find(e => e.id === Number(btn.dataset.id));
            cripto.cantidad = 0; // Agrego atributo cantidad

            if (portfolio.hasOwnProperty(cripto.id)){
                console.log('ya existe') // TO DO: Agregar modal con setTimeout
            } else {
                portfolio[cripto.id] = { ...cripto } // spread operator para empujar todo el contenido del objeto
                console.log(portfolio)
                saveCriptoInLocalStorage("criptos", portfolio);
                printInPortfolio();
            }
        });
    });
}

//  Mostrar datos en el Portfolio
const containerPortfolio = d.getElementById('containerPortfolio');
const footer = d.getElementById('footerPortfolio');

const printInPortfolio = () => {
    containerPortfolio.innerHTML = '';

    const template = d.getElementById('templatePortfolio').content;
    const fragment = new DocumentFragment();

    Object.values(portfolio).forEach(cripto => {
        template.querySelector('th').textContent = cripto.nombre.toUpperCase();
        template.querySelectorAll('td')[0].textContent = '$ ' + cripto.precio;
        template.querySelectorAll('td')[1].textContent = '$ ' + cripto.cantidad;
        template.querySelectorAll('button')[0].dataset.id = cripto.id;
        template.querySelectorAll('button')[1].dataset.id = cripto.id;

        const clone = template.cloneNode(true); 
        fragment.appendChild(clone);
    });
    containerPortfolio.appendChild(fragment);

    //  Borrar contenido del footer cuando hay elementos
    if (Object.keys(portfolio).length === 0){ // Uso Object.keys para que sea un array y poder conocer su longitud
        footer.innerHTML = `
            <th scope="row" colspan="4">
                El portfolio esta vacio - Agregue criptos para comenzar a comprar!
            </th>`; 
    } else {
        footer.innerHTML = '';
    }
    portfolioButtons();
}

//  Botones 'Comprar' / 'Vender' del Portfolio
const portfolioButtons = () => {
    const addButton = d.querySelectorAll('#containerPortfolio .btn-buy');
    const delButton = d.querySelectorAll('#containerPortfolio .btn-sell');

    addButton.forEach(btn => {
        btn.addEventListener('click', () => {
            const cripto = portfolio[btn.dataset.id];
            cripto.cantidad++;
            portfolio[btn.dataset.id] = {...cripto};
            localStorage.removeItem('criptos');
            saveCriptoInLocalStorage("criptos", portfolio);
            printInPortfolio();
        });
    });

    delButton.forEach(btn => {
        btn.addEventListener('click', () => {
            const cripto = portfolio[btn.dataset.id];
            cripto.cantidad--;
            localStorage.removeItem('criptos');
            saveCriptoInLocalStorage("criptos", portfolio);
            if (cripto.cantidad === 0 || cripto.cantidad < 0){
                //deleteFromLocalStorage(portfolio[btn.dataset.id]);
                //console.log(portfolio[btn.dataset.id]);
                localStorage.removeItem('criptos');
                delete portfolio[btn.dataset.id]; // delete solo se usa con objetos
                saveCriptoInLocalStorage("criptos", portfolio);
            } else {
                portfolio[btn.dataset.id] = {...cripto};
            }
            printInPortfolio();
        });
    });
}
  
//  Guardar Portfolio en LocalStorage
function saveCriptoInLocalStorage(string, infoCripto){
    let criptosLS;

    criptosLS = getCriptosFromLocalStorage(string);
    criptosLS.push(infoCripto);

    localStorage.setItem(string, JSON.stringify(criptosLS));
}

//  Obtener criptos en Portfolio del LocalStorage
function getCriptosFromLocalStorage(string){
    let criptosInLocalStorage;

    if (localStorage.getItem(string) === null) {
        criptosInLocalStorage = [];
    } else {
        criptosInLocalStorage = JSON.parse(localStorage.getItem(string));
    }
    return criptosInLocalStorage;
}

//  Mostrar criptos en Portfolio del LocalStorage
function printLocalStorage(string){
    let printCriptosInLocalStorage;

    printCriptosInLocalStorage = getCriptosFromLocalStorage(string);

    if (printCriptosInLocalStorage.length !== 0) {

        let arrayCripto = printCriptosInLocalStorage[printCriptosInLocalStorage.length-1];

        portfolio = arrayCripto;

        const template = d.getElementById('templatePortfolio').content;
        const fragment = new DocumentFragment();
    
        Object.values(arrayCripto).forEach(cripto => {
            template.querySelector('th').textContent = cripto.nombre.toUpperCase();
            template.querySelectorAll('td')[0].textContent = '$ ' + cripto.precio;
            template.querySelectorAll('td')[1].textContent = '$ ' + cripto.cantidad;
            template.querySelectorAll('button')[0].dataset.id = cripto.id;
            template.querySelectorAll('button')[1].dataset.id = cripto.id;
    
            const clone = template.cloneNode(true); 
            fragment.appendChild(clone);
        });
        containerPortfolio.appendChild(fragment);

        //  Borrar contenido del footer cuando hay elementos
        if (Object.keys(portfolio).length === 0){ // Uso Object.keys para que sea un array y poder conocer su longitud
            footer.innerHTML = `
                <th scope="row" colspan="4">
                    El portfolio esta vacio - Agregue criptos para comenzar a comprar!
                </th>`; 
        } else {
            footer.innerHTML = '';
        }
        portfolioButtons(); 
    }
}
