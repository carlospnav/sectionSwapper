/*Como o global scope não necessita de acesso à nada do funcionamento do App,
protejo o escopo global de poluição "escondendo" as variáveis dentro de um 
escopo de função com uma IIFE. */
(function(){
  const App = {
    sections: {},
    current: null,
    content: null,
    title: function selectTitle(){
      return this.current.querySelector("h2");
    },
    /*Inicializa o app. */
    init: function initHandler(){
      this.content = document.querySelector("#content > p");
      /*Binda funções que são propriedades do objeto App de forma
      a permitir que "this" aponte para o objeto correto mesmo quando
      não há binding implícito e o call site da chamada da seja o objeto global,
      como acontece em um callback de evento. */
      this.selectSection = this.selectSection.bind(this);
      this.returnToMain = this.returnToMain.bind(this);
      this.moveToTop = this.moveToTop.bind(this);
      Array.prototype.slice.call(document.querySelectorAll(".element"))
        .forEach((element) => {
          /* Binda o listener de click a cada seção da página e adiciona
          esta seção ao objecto sections. */
          element.addEventListener('click', this.selectSection);
          const newElement = {
            element: element,
            content: element.id.slice(7, 8)
          }
          this.sections[element.id]= newElement;
        });
    },
    /*Checa se o elemento do DOM tem uma classe específica. Os  + ' ' + são
    para evitar de checar positivo caso uma classe tenha o parâmetro recebido
    'className' como parte de um nome maior. ex: 'container' em 'large-container'. 
    */
    hasClass: function hasClassHandler(element, className){
      return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
    },
    /*Move o elemento do Dom para a primeira posição de seu parent node, somente
    se ele for uma das 4 seções e se não estiver já expandido.*/
    moveToTop: function moveToTopHandler(e){
      if (!this.hasClass(e.target, "element") || !this.hasClass(e.target, "contracted-to-title")){
        return false;
      }
      const main = App.current.parentNode;
      main.removeChild(App.current);
      main.prepend(App.current);
    },
    /*Expande a seção específica, salvando uma referência dela no App para
    fácil acesso posterior. Esta função tambem adiciona o conteúdo apropriado
    da seção (acessado pelo objeto sections do App) no container de conteúdo,
    contrai as demais seções, transforma a seção original em uma seção de título
    e binda o método de expandir ao título desta seção.
    */
    selectSection: function selectSectionHandler(e){
      this.current = e.target;

      this.current.addEventListener('transitionend', this.moveToTop);
      this.content.innerHTML = this.sections[this.current.id].content;
      for (item of Object.keys(this.sections)){
        if (e.target.id !== this.sections[item].element.id){
          this.sections[item].element.classList.add("contracted");
        }  
      } 
      this.current.classList.add("contracted-to-title");
      this.current.querySelector("ul").classList.add("contracted-content");
      this.title().addEventListener('click', this.returnToMain, { once: true});
    },
    /*Contrai a seção específica para voltar à posição original e reseta o estado do 
    App. */
    returnToMain: function returnToMainHandler(e){
      e.stopPropagation();
      this.current.removeEventListener('transitionend', this.moveToTop );
      for(item of Object.keys(this.sections)){
        App.sections[item].element.classList.remove("contracted");
      }
      this.current.classList.remove("contracted-to-title");
      this.current.querySelector("ul").classList.remove("contracted-content");
      this.title().removeEventListener('click', this.returnToMain);
      this.current = null;
    }
  };

  /*Inicializa o app. ;) */
  App.init();
})();