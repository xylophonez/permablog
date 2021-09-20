import Arweave from 'arweave'

export const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 100000,
  logging: false,
});

export const AMA_CONTRACT = 'zqB8iu-UBW-ZZkIqg28OH1D6yN9SdQp-h-sVWLbGPZ8'
//export const AMA_CONTRACT = '4B-MIL6d-zgyCSh7SiX-LajwzCjuLxQZQXO6YpfWO3s'