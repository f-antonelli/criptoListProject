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

        let arrayCripto = printCriptosInLocalStorage[printCriptosInLocalStorage.length-1]
        console.log(arrayCripto);
        //console.log(Object.values(arrayCripto)[0])
        portfolio = arrayCripto;
        //portfolio = {...Object.values(arrayCripto)}
        // Object.values(arrayCripto).forEach(element => {
        //     portfolio = { ...element };
        // });
        console.log(portfolio);
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
        console.log(containerPortfolio.appendChild(fragment));
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
