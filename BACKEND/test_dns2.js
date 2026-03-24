const dns = require('dns').promises;
const dnsSync = require('dns');

// Force c-ares to use Google's DNS
dnsSync.setServers(['8.8.8.8', '8.8.4.4']);

async function testDNS() {
  try {
    const srv = await dns.resolveSrv('_mongodb._tcp.cluster0.ctksskp.mongodb.net');
    console.log('SRV Success with custom DNS:', srv);
  } catch (err) {
    console.error('SRV Failed:', err.message, err.code);
  }
}

testDNS();
