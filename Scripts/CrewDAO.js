
class CrewDAO {

    static instance;
    
    static API_ENDPOINT = "https://api.spacexdata.com/v4/crew";

    constructor() {
        if(CrewDAO.instance) {
            return CrewDAO.instance;
        }

        CrewDAO.instance = this;
    }
    



    async findCrewById(crewId) {
        let rawReponse = await fetch(CrewDAO.API_ENDPOINT + '/' + crewId);
        let data = await rawReponse.json();

        const crew = new Crew(data.name, data.image);
        
        return crew;
    }



}