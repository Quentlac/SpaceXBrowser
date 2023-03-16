const view = {

    launchTitle: document.querySelector("#launch-title"),
    crewList: document.querySelector("#crews-list"),
    launchDate: document.querySelector("#launch-date"),
    imageGallery: document.querySelector("#launch-gallery"),


    launchDescription: document.querySelector("#launch-description"),

    addImage: function(image) {
        const img = document.createElement('img');
        img.setAttribute('src', image);

        this.imageGallery.append(img);
    },

    addCrew: function({crew, role}) {
        const item = document.createElement('div');
        item.classList.add('crew-item', 'item');

        const img = document.createElement('img');
        img.setAttribute('src', crew.getImage());

        item.append(img);
        this.crewList.append(item);
    },

    updateFromModel: function(launch) {

        console.log(launch.getImages());

        this.launchTitle.textContent = launch.getNom();
        this.launchDescription.textContent = launch.getDetails();
        this.launchDate.textContent = new Date(launch.getDate()).toLocaleString();

        const crews = launch.getCrews();
        
        if(crews.length == 0) {
            this.crewList.innerHTML = "<p>Aucun équipage</p>";
        }

        crews.forEach(c => {
            console.log('crew', c);
            this.addCrew(c)
        });

        const images = launch.getImages().slice(0, Math.min(10, launch.getImages().length));
        images.forEach(i => {
            this.addImage(i);
        });


    }

}

const models = {
    launches: new LaunchDAO()
}

const main = async () => {
    const launchId = new URL(window.location.href).searchParams.get('id');
    const launch = await models.launches.findLaunchById(launchId);

    view.updateFromModel(launch);
}

main();

