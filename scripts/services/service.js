import { database,ref,onValue } from "../lib/firebaseLib.js";

class Measure{

    constructor(){
        this.database = database;
        this.ref = ref(this.database, 'dynamic');
    }

    getMeasures(){
        const promise = new Promise((resolve, reject) => {
            onValue(this.ref, (snapshot) => {
                const data = snapshot.val();
                resolve(data);
            });
        });
        return promise;
    }

};

export default Measure;