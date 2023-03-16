
const view = {
    rechercheInput: document.querySelector("#bloc-recherche > input"),
    rechercheButton: document.querySelector("#bloc-recherche > button"),
    resultList: document.querySelector("#bloc-resultats"),
    favorisList: document.querySelector("#liste-favoris"),
    favorisButton: document.querySelector("#btn-favoris"),
    starsFavorisIcon: document.querySelector("#btn-favoris > img"),
    loadingIcon: document.querySelector("#bloc-gif-attente"),
    infoResultats: document.querySelector("#information-resultats"),

    getQueryInput: function () {
        return this.rechercheInput.value.trim();
    },

    setQueryInput: function (query) {
        this.rechercheInput.value = query;
    },

    clearResultat: function () {
        this.resultList.innerHTML = "";
    },

    appendResultat: function (id, name, query) {
        const resElement = document.createElement("p");
        resElement.innerHTML = name.replace(new RegExp(query, 'i'), "<span class='match-word'>" + query + "</span>");

        resElement.addEventListener('click', () => window.location.href = './launch.html?id=' + id);

        this.resultList.appendChild(resElement);
    },

    showAucunResultat: function() {
        this.infoResultats.innerHTML = "<p>Aucun résultat</p>";
    },

    showLoading: function() {
        this.loadingIcon.style.display = 'block';
    },

    hideLoading: function() {
        this.loadingIcon.style.display = 'none';
    },

    clearInfo: function() {
        this.hideLoading();
        this.infoResultats.innerHTML = "";
    },

    clearFavoris: function() {
        this.favorisList.innerHTML = "";
    },

    addFavoris: function(fav) {
        const favElement = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = fav;

        span.addEventListener("click", (event) => {
            this.setQueryInput(event.target.textContent);
            this.updateFavorisButton();
            makeSearch();
        });

        favElement.append(span);

        const supprIcon = document.createElement('img');
        supprIcon.setAttribute('src', 'images/croix.svg');
        supprIcon.setAttribute('width', 15);

        supprIcon.addEventListener('click', (e) => {
            models.favorisService.removeFavoris(fav);
            this.updateFavorisFromModel(models.favorisService);
        });

        favElement.append(supprIcon);

        this.favorisList.appendChild(favElement);
    },

    updateFavorisFromModel: function(favorisService) {
        this.clearFavoris();

        const favoris = favorisService.getFavoris();

        if(favoris.length == 0) {
            this.favorisList.textContent = "Aucune recherche en favoris";
        }

        favoris.forEach(f => {
            this.addFavoris(f);
        });

        this.updateFavorisButton();
    },

    updateFavorisButton: function () {
        if(models.favorisService.exist(this.getQueryInput())) {
            this.enableStarsFavoris();
        }
        else {
            this.disableStarsFavoris();
        }
    },

    enableFavorisButton: function() {
        this.favorisButton.disabled = false;
        this.favorisButton.classList.add('btn_clicable');
    },

    disableFavorisButton: function() {
        this.favorisButton.disabled = true;
        this.favorisButton.classList.remove('btn_clicable');
    },

    enableStarsFavoris() {
        this.enableFavorisButton();
        this.starsFavorisIcon.setAttribute('src', "images/etoile-pleine.svg");
    },

    disableStarsFavoris() {
        this.starsFavorisIcon.setAttribute('src', "images/etoile-vide.svg");
    }


}


const models = {
    launches: new LaunchDAO(),
    favorisService: new FavorisService()
}

view.rechercheButton.onclick = async function(e) {
    makeSearch();
}

const createScrollHandler = function(hasNextPage, page) {
    const scrollHandler = async function () {
        const contentHeight = view.resultList.scrollHeight;
        const visibleHeight = view.resultList.clientHeight;
        const scrollPosition = view.resultList.scrollTop;

        if(scrollPosition + visibleHeight >= contentHeight) {
            if(hasNextPage) await makeSearch(page + 1);
            view.resultList.removeEventListener('scroll', scrollHandler);        
        }

    }

    return scrollHandler;
}

const makeSearch = async function(page = 1) {
    view.showLoading();
    const data = await models.launches.searchLaunch(view.getQueryInput(), page);

    if(page == 1) view.clearResultat();
    view.clearInfo();

    if(data.results.length == 0) {
        view.showAucunResultat();
    }
    else {
        data.results.forEach((l) => {
            view.appendResultat(l.getId(), l.getNom(), view.getQueryInput());
        });

        const scrollHandler = createScrollHandler(data.hasNextPage, page);

        if(data.hasNextPage) {
            view.resultList.addEventListener('scroll', scrollHandler);
        }
    }
}


view.rechercheInput.addEventListener('input', e => {
    if(e.target.value.length > 0) {
        view.enableFavorisButton();

        if(models.favorisService.exist(view.getQueryInput())) {
            view.enableStarsFavoris();
        }
        else {
            view.disableStarsFavoris();
        }
    }
    else {
        view.disableFavorisButton();
        view.disableStarsFavoris();
    }
});

view.favorisButton.addEventListener("click", (e) => {

    const recherche = view.getQueryInput();

    if(models.favorisService.exist(recherche)) {
        models.favorisService.removeFavoris(recherche);
    }
    else {
        models.favorisService.addFavoris(recherche);
    }

    view.updateFavorisFromModel(models.favorisService);

});

window.onload = function () {
    view.updateFavorisFromModel(models.favorisService);


    if(view.getQueryInput().length > 0) {
        makeSearch();
    }
    
}

