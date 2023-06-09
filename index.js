async function getCountriesAndRegions (countryId, language) {
      // COUNTRY
      const responseCountry = await this.$axios(`https://www.wikidata.org/wiki/Special:EntityData/${countryId}.json`)
      const country = responseCountry.data.entities[countryId]
      const countryName = country.labels[language]?.value || country.labels.en.value
      // console.log()
      // console.log(country)
      const regionsIDList = country.claims.P150.map(item => item.mainsnak.datavalue.value.id)
      // REGION
      const regionsArr = await Promise.all(regionsIDList.map(async (item) => {
        const response = await this.$axios(`https://www.wikidata.org/wiki/Special:EntityData/${item}.json`)
        // console.log(response)
        // console.log(response.data.entities[item].claims.P300)
        const namesRegions = response.data.entities[item].labels
        return namesRegions[language]?.value || namesRegions.en.value
      }))
      return { [countryName]: regionsArr }
     
    }

async function testLog () {
  const countryList = {
    Kenya: 'Q114',
    Tanzania: 'Q924',
    Cameroon: 'Q1009',
    Rwanda: 'Q1037',
    Uganda: 'Q1036',
    Malawi: 'Q1020',
    India: 'Q668',
    UnitedArabEmirates: 'Q878',
    Israel: 'Q801',
    Ethiopia: 'Q115',
    NIGERIA: 'Q1033',
    Turkey: 'Q43'
  }
  const countriesId = Object.values(countryList)
  const regionsList = await Promise.all(countriesId.map(item => this.getCountriesAndRegions(item, 'sw')))
  console.log(regionsList)
}

// async function getCountryList () {
//   const response = await this.$axios(`https://www.wikidata.org/wiki/Special:EntityData/Q114.json`)
//   console.log(response.data.entities.Q114.claims.P150.map(item => item.mainsnak.datavalue.value.id))
// }

// export default { 
//   getCountriesAndRegions,
//   testLog
// }

const countryList = () => {
  const wd = require('./wikidata.json');
  const countries = require('./countries.json');
  let items = [];

  wd.forEach((item) => {
    // const country = countries.find((country) => country.name === item.name);
    // if (!country) {
    //   // country.wd = item.wd;
    //   console.log(item.name);
    // }
    items.push({name: item.name, wdid: item.wdid, id: item.wdid.split('Q')[1]});
  });

  console.log(items);
}

countryList();
