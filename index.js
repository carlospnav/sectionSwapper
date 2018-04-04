/* TODO 
  - Make transitionend run only ONCE per section clicked.
*/

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
      this.selectSection = this.selectSection.bind(this);
      this.returnToMain = this.returnToMain.bind(this);
      this.moveToTop = this.moveToTop.bind(this);
      document.querySelectorAll(".element")
        .forEach((element) => {
          /* Binda o listener de click a cada seção da página e adiciona
          esta seção ao objecto sections. Como init é rodado somente uma vez, 
          cópias extras de selectSection não serão adicionadas ao elemento através
          do método bind. */
          element.addEventListener('click', this.selectSection);
          const newElement = {
            element: element,
            content: element.id.slice(7, 8)
          }
          this.sections[element.id]= newElement;
        });
    },
    hasClass: function hasClassHandler(element, className){
      return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
    },
    moveToTop: function moveToTopHandler(e){
      if (!this.hasClass(e.target, "element")){
        return false;
      }

      const main = App.current.parentNode;
      main.removeChild(App.current);
      main.prepend(App.current);
    },
    selectSection: function selectSectionHandler(e){
      this.current = e.target;

      console.log("current: ", this.current)
      this.current.addEventListener('transitionend', this.moveToTop, true);
      this.content.innerHTML = this.sections[this.current.id].content;
      for (item of Object.keys(this.sections)){
        if (e.target.id !== this.sections[item].element.id){
          this.sections[item].element.classList.add("contracted");
        }  
      } 
      this.current.classList.add("contracted-to-title");
      this.current.querySelector("ul").classList.add("contracted-content");
      this.title().addEventListener('click', this.returnToMain);
    },
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

  App.init();
})();