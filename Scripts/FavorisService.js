

class FavorisService {

    static LOCALSTORAGE_KEY = "favoris";

    static instance;
    
    #recherchesFavoris = [];

    constructor() {
        if(FavorisService.instance) {
            return FavorisService.instance;
        }

        FavorisService.instance = this;
        this.update();
    }

    update() {
        const data = localStorage.getItem(FavorisService.LOCALSTORAGE_KEY);
        if(data) {
            this.#recherchesFavoris = JSON.parse(data);
        }
        return this.#recherchesFavoris;
    }


    save() {
        localStorage.setItem(FavorisService.LOCALSTORAGE_KEY, JSON.stringify(this.#recherchesFavoris));
    }

    addFavoris(recherche) {
        if(!this.exist(recherche)) {
            recherche = recherche.toLowerCase();
            this.#recherchesFavoris.push(recherche);
            this.save();
        }

        return this.getFavoris();
    }

    removeFavoris(recherche) {
        recherche = recherche.toLowerCase();
        this.#recherchesFavoris = this.#recherchesFavoris.filter(f => f !== recherche);
        this.save();

        return this.getFavoris();
    }

    getFavoris() {
        return this.#recherchesFavoris;
    }

    exist(recherche) {
        recherche = recherche.toLowerCase();
        return this.#recherchesFavoris.indexOf(recherche) != -1;
    }


}