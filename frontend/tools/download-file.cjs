const fs = require('fs');
const axios = require('axios');

(async () => {
  const address = process.argv[2];
  const destination = process.argv[3];

  console.log(`Downloading ${address} to ${destination}.`);
  try {
    const response = await axios.get(address, { responseType: 'arraybuffer' });
    fs.writeFileSync(destination, response.data);
    console.log('Success');
  } catch (e) {
    console.warn(`Unable to download ${address}`);
    throw e;
  }
})();