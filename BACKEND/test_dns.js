const dns = require('dns').promises;

async function testDNS() {
  try {
    const srv = await dns.resolveSrv('_mongodb._tcp.cluster0.ctksskp.mongodb.net');
    console.log('SRV Success:', srv);
  } catch (err) {
    console.error('SRV Failed:', err.message, err.code);
  }
}

testDNS();
