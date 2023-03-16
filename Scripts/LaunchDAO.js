

class LaunchDAO {

    static instance;
    
    static API_ENDPOINT = "https://api.spacexdata.com/v5/launches";

    #crewDAO;

    constructor() {
        if(LaunchDAO.instance) {
            return LaunchDAO.instance;
        }

        LaunchDAO.instance = this;

        this.#crewDAO = new CrewDAO();
    }

    async #parseLaunch(data) {
        const launch = new Lauch(data.id, data.name, data.date_utc);

        launch.setSuccess(data.success);
        launch.setDetails(data.details);
        launch.setImages(data.links.flickr.original);
        
        const crews = data.crew;

        await Promise.all(crews.map(async (c) => {
            const role = c.role;
            const crewId = c.crew;

            const crew = await this.#crewDAO.findCrewById(crewId);
            launch.addCrew(crew, role);
        }));

        return launch;
    }

    async findLaunchById(launchId) {
        let rawReponse = await fetch(LaunchDAO.API_ENDPOINT + '/' + launchId);
        let data = await rawReponse.json();

        const launch = await this.#parseLaunch(data);
        return launch;
    }

    async getLatestLaunch() {
        let rawReponse = await fetch(LaunchDAO.API_ENDPOINT + '/latest');
        let data = await rawReponse.json();

        const latest = await this.#parseLaunch(data);
        return latest;
    }

    async searchLaunch(query, page = 1) {

        console.log("RECHERCHE DE " + query + " (page " + page + ")");

        const params = {
            query: { $or: [{name: { $regex: query, $options: 'i' }}] },
            options: { page, limit: 20 }
        };

        let rawReponse = await fetch(LaunchDAO.API_ENDPOINT + '/query', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });

        let data = await rawReponse.json();

        
        const results = [];

        await Promise.all(data.docs.map(async (l) => {
            results.push(await this.#parseLaunch(l));
        }));

        return {page, hasNextPage: data.hasNextPage, results};
    }
}