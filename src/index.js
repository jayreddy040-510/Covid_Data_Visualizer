window.addEventListener('DOMContentLoaded', () => console.log(""));


async function getData() {
    try{
      let response = await fetch(`https://data.cdc.gov/resource/unsk-b7fc.json?$query=SELECT location, series_complete_pop_pct WHERE location NOT IN ('BP2','DD2','GU','AS','FM','IH2','MH','MP','PR','PW','VA2','VI','UM') ORDER BY date DESC, location LIMIT 52`);
      return response.json();
    }catch(err){
      console.error(err);
      // Handle errors here
    }
  }

  getData().then(res => console.log(res));


// console.log(d3);

 