window.addEventListener('DOMContentLoaded', () => console.log("workis it still workinging"));


async function getData() {
    try{
      let response = await fetch(`https://data.cdc.gov/resource/unsk-b7fc.json`);
      return response.json();
    }catch(err){
      console.error(err);
      // Handle errors here
    }
  }

  getData().then(res => console.log(res));



 