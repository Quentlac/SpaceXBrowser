
class Crew {

    #nom = "";
    #image = ""

    constructor(nom, image) {
        this.#nom = nom;
        this.#image = image;
    }


    getNom() {
        return this.#nom;
    }


    getImage() {
        return this.#image;
    }

}