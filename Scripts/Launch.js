

class Lauch {

    #id;
    #nom = "";
    #date;
    #success;
    #details;
    #images = [];
    #crews = [];

    constructor(id, nom, date) {
        this.#id = id;
        this.#nom = nom;
        this.#date = date;
    }

    setDetails(details) {
        this.#details = details;
    }

    setSuccess(s) {
        this.#success = s;
    }

    setImages(images) {
        this.#images = images;
    }

    addCrew(crew, role) {
        this.#crews.push({crew, role});
    }

    getId() {
        return this.#id;
    }

    getNom() {
        return this.#nom;
    }

    getDate() {
        return this.#date;
    }

    getImages() {
        return this.#images;
    }

    getCrews() {
        return this.#crews;
    }

    haveDetails() {
        return this.#details ? true : false;
    }

    getDetails() {
        if(this.haveDetails()) {
            return this.#details;
        } 

        return "Aucun détail";
    }

}