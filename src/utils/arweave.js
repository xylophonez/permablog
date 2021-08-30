import Arweave from 'arweave'

export const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 100000,
  logging: false,
});

export const AMA_CONTRACT = '4B-MIL6d-zgyCSh7SiX-LajwzCjuLxQZQXO6YpfWO3s'