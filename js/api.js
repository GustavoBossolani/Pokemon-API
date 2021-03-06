// Atributos DOM
var btnPesquisar = document.querySelector('#pesquisar-pokemon');
var btnGerar = document.querySelector('#gerar-pokemon');
var btnRetornar = document.querySelector('#retornar-poke');
var campo = document.querySelector('#campo-nome');
var output = document.querySelector('#output-campo-nome');
var progresso = document.querySelector('#barra-progresso');

// Atributos API
var xhr = new XMLHttpRequest();
var url;
let pokemonAtual;
let anteriores = [];
let contadorHistorico = -1;
// FIM ATRIBUTOS

inicializar();
var nomes = setInterval(() => { listaExemplos() }, 3000);

function inicializar() {
    console.log('inicializando aplicação..');
    limpaCampos();

    //Fazendo a verificação para exibir mensagem no botão retornar
    if (pokemonAtual != undefined) {
        btnRetornar.setAttribute('data-tooltip', `Retornar para: ${pokemonAtual.name}`);
    } else {
        btnRetornar.setAttribute('data-tooltip', `Busque um Pokemon.`);
    }
    console.log('aplicação inicializada');
}

campo.addEventListener('input', () => {
    output.textContent = campo.value;
    clearInterval(nomes);
});

// METODOS DE PESQUISA E GERAÇÃO DE OBJETOS

function pesquisarPokemon(valorBusca, tipoPesquisa) {

    if (tipoPesquisa === 'pesquisa') {
        url = `https://pokeapi.co/api/v2/pokemon/${valorBusca.toLowerCase().trim()}/`;
    } else {
        var pokedexNumber = Math.floor((Math.random() * 808));
        url = `https://pokeapi.co/api/v2/pokemon/${pokedexNumber}/`;
    }

    xhr.open('GET', url);
    console.log(url);

    xhr.onload = () => {

        console.log('BUSCA FEITA: ', xhr.status);
        pokemonAtual;

        if (xhr.status == 200) {
            console.log('SUCESSO: status - ', xhr.status);

            if (pokemonAtual != undefined) {
                salvarNoHistorico(pokemonAtual);
                pokemonAtual = JSON.parse(xhr.responseText);
            }

            pokemonAtual = JSON.parse(xhr.responseText);
            console.log('ATUAL ' + pokemonAtual.name);

            limpaCampos();
            mudarFoto(pokemonAtual);
            mudarCampos(pokemonAtual);
            setarTipos(pokemonAtual, '#tipo-poke');
            btnRetornar.setAttribute('data-tooltip', `Retornar para: ${pokemonAtual.name.toUpperCase()}`);

        } else {
            M.toast({ html: 'Pokemon não Encontrado', classes: 'rounded' });
            limpaCampos();
        }
    };
    xhr.send();
}

btnPesquisar.addEventListener('click', () => {
    if (event) event.preventDefault();
    pesquisarPokemon(campo.value.toLowerCase().trim(), 'pesquisa');
});

btnGerar.addEventListener('click', () => {
    if (event) event.preventDefault();
    pesquisarPokemon(campo.value.toLowerCase().trim(), 'gerar');
});

btnRetornar.addEventListener('click', () => {
    limpaCampos();
    mudarFoto(pokemonAtual);
    mudarCampos(pokemonAtual);
    setarTipos(pokemonAtual, '#tipo-poke');
});
// FIM METODOS DE CRIAÇÃO


// METODOS DE MANIPULAÇÃO DO DOM
function mudarFoto(pokemon) {
    var imagem = document.querySelector('#poke-imagem');
    imagem.src = pokemon.sprites.front_default;
    var tipo = retornarTipo(pokemon.types[0].type.name);
    imagem.setAttribute('style', `background-color: ${tipo.color}; border-radius: 10px; padding: -10%;`);
}

function mudarCampos(pokemon) {
    var nomePoke = document.querySelector('#nome-poke');
    var numeroPoke = document.querySelector('#numero-poke');
    var idPoke = document.querySelector('#id-poke');
    var pesoPoke = document.querySelector('#peso-poke');
    var alturaPoke = document.querySelector('#altura-poke');

    nomePoke.textContent = pokemon.name.toUpperCase();
    numeroPoke.textContent = pokemon.id;
    idPoke.textContent = pokemon.order;
    pesoPoke.textContent = pokemon.weight / 10 + ' kg';
    alturaPoke.textContent = pokemon.height / 10 + ' m';
}

function setarTipos(pokemon, elemento) {
    // TEMPLATE DE BADGE PARA ESTILIZAR TIPOS
    //<span class="badge green white-text text-darken-2">GRASS</span>
    var tipoPoke = document.querySelector(elemento);

    // Recuperando objetos de configuração de acordo com o tipo
    var tipos = [];
    pokemon.types.forEach(tipo => {
        console.log(tipo.type.name);
        tipos.push(retornarTipo(tipo.type.name));
    });

    console.log(tipos);

    // Criando as Badges com os determinados tipos
    tipos.forEach(tipo => {

        if (tipo != null) {
            var span = document.createElement('span');
            span.classList.add('white-text');
            span.classList.add('badge-tipo');
            span.setAttribute('style', `background-color: ${tipo.color};`);
            span.textContent = tipo.name.toUpperCase();
            tipoPoke.appendChild(span);
        }
    });

}

function limpaCampos() {
    let nomePoke = document.querySelector('#nome-poke');
    let numeroPoke = document.querySelector('#numero-poke');
    let idPoke = document.querySelector('#id-poke');
    let tipoPoke = document.querySelector('#tipo-poke');
    let pesoPoke = document.querySelector('#peso-poke');
    let alturaPoke = document.querySelector('#altura-poke');
    let imagePoke = document.querySelector('#poke-imagem');

    nomePoke.textContent = '';
    numeroPoke.textContent = '';
    idPoke.textContent = '';
    tipoPoke.textContent = '';
    pesoPoke.textContent = '';
    alturaPoke.textContent = '';
    imagePoke.src = '';

}

function listaExemplos() {
    var exemplos = ['Charizard-mega-x', 'Rattata-alola', 'Deoxys-speed', 'Bulbasaur', 'Blaziken-mega', 'Pikachu'];
    var num = Math.floor((Math.random() * 5));
    output.textContent = exemplos[num];
}

// FIM MÉTODOS DE MANIPULAÇÃO


// METODOS DE BUSCA E RETORNO DE CONFIGURAÇÃO
function buscarTodosTipos() {

    let url = 'https://pokeapi.co/api/v2/type/';
    let tipos;
    let listaTipos = [];

    xhr.open('GET', url);
    xhr.onload = () => {

        if (xhr.status == 200) {
            tipos = JSON.parse(xhr.responseText);

            //Recuperando tipos
            tipos.results.forEach(tipo => {
                listaTipos.push(tipo.name);
            });

        } else {
            console.log("erro ao buscar os tipos");
        }
    };
    xhr.send();
    return listaTipos;
}

function retornarTipo(tipoPoke) {
    var objTipo;
    var enumTipos = pegaEnumTipos();

    // Verificação
    switch (tipoPoke) {
        case enumTipos.normal.index:
        case enumTipos.normal.name:
            objTipo = enumTipos.normal;
            break;

        case enumTipos.fighting.index:
        case enumTipos.fighting.name:
            objTipo = enumTipos.fighting;
            break;

        case enumTipos.flying.index:
        case enumTipos.flying.name:
            objTipo = enumTipos.flying;
            break;

        case enumTipos.poison.index:
        case enumTipos.poison.name:
            objTipo = enumTipos.poison;
            break;

        case enumTipos.ground.index:
        case enumTipos.ground.name:
            objTipo = enumTipos.ground;
            break;

        case enumTipos.rock.index:
        case enumTipos.rock.name:
            objTipo = enumTipos.rock;
            break;

        case enumTipos.bug.index:
        case enumTipos.bug.name:
            objTipo = enumTipos.bug;
            break;

        case enumTipos.ghost.index:
        case enumTipos.ghost.name:
            objTipo = enumTipos.ghost;
            break;

        case enumTipos.steel.index:
        case enumTipos.steel.name:
            objTipo = enumTipos.steel;
            break;


        case enumTipos.fire.index:
        case enumTipos.fire.name:
            objTipo = enumTipos.fire;
            break;

        case enumTipos.water.index:
        case enumTipos.water.name:
            objTipo = enumTipos.water;
            break;

        case enumTipos.grass.index:
        case enumTipos.grass.name:
            objTipo = enumTipos.grass;
            break;

        case enumTipos.electric.index:
        case enumTipos.electric.name:
            objTipo = enumTipos.electric;
            break;

        case enumTipos.psychic.index:
        case enumTipos.psychic.name:
            objTipo = enumTipos.psychic;
            break;

        case enumTipos.ice.index:
        case enumTipos.ice.name:
            objTipo = enumTipos.ice;
            break;

        case enumTipos.dragon.index:
        case enumTipos.dragon.name:
            objTipo = enumTipos.dragon;
            break;

        case enumTipos.dark.index:
        case enumTipos.dark.name:
            objTipo = enumTipos.dark;
            break;

        case enumTipos.fairy.index:
        case enumTipos.fairy.name:
            objTipo = enumTipos.fairy;
            break;

        case enumTipos.unknown.index:
        case enumTipos.unknown.name:
            objTipo = enumTipos.unknown;
            break;

        case enumTipos.shadow.index:
        case enumTipos.shadow.name:
            objTipo = enumTipos.shadow;
            break;
    }
    return objTipo;
}

function pegaEnumTipos() {
    var EnumTipos = {
        normal: { index: 0, color: '#c0ca33', name: 'normal' },
        fighting: { index: 1, color: '#e65100', name: 'fighting' },
        flying: { index: 2, color: '#cfd8dc', name: 'flying' },
        poison: { index: 3, color: '#9c27b0', name: 'poison' },
        ground: { index: 4, color: '#827717', name: 'ground' },
        rock: { index: 5, color: '#a1887f', name: 'rock' },
        bug: { index: 6, color: '#e6ee9c', name: 'bug' },
        ghost: { index: 7, color: '#d500f9', name: 'ghost' },
        steel: { index: 8, color: '#607d8b', name: 'steel' },
        fire: { index: 9, color: '#f44336', name: 'fire' },
        water: { index: 10, color: '#1565c0', name: 'water' },
        grass: { index: 11, color: '#4caf50', name: 'grass' },
        electric: { index: 12, color: '#ffeb3b', name: 'electric' },
        psychic: { index: 13, color: '#f06292', name: 'psychic' },
        ice: { index: 14, color: '#b2ebf2', name: 'ice' },
        dragon: { index: 15, color: '#311b92', name: 'dragon' },
        dark: { index: 16, color: '#424242 ', name: 'dark' },
        fairy: { index: 17, color: '#ef9a9a', name: 'fairy' },
        unknown: { index: 18, color: '#ffffff', name: 'unknown' },
        shadow: { index: 19, color: '#9fa8da', name: 'shadow' },
    };
    return EnumTipos;
}

function salvarNoHistorico(pokemon) {
    // inserindo um pokemon anterior no histórico e adcionando um id no mesmo
    anteriores.push(pokemon);
    contadorHistorico++;

    let historico = document.querySelector('#historico');
    var a = document.createElement('a');

    a.textContent = pokemon.name.toUpperCase();
    a.setAttribute('href', '');
    a.setAttribute('id', contadorHistorico);
    a.setAttribute('onClick', 'selecionarPokemon(this.id)');

    historico.appendChild(a);
}

function selecionarPokemon(id) {
    if (event) event.preventDefault();
    console.log(id);

    let pokemon = anteriores[id];
    limpaCampos();
    mudarCampos(pokemon);
    mudarFoto(pokemon);
    setarTipos(pokemon, '#tipo-poke');
}
// FIM METODOS DE CONFIGURAÇÃO E BUSCA