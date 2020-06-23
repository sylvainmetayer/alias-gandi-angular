const faker = require("faker");
const fs = require("fs");
/**
 * Generate fake response for Gandi API
 * Date won't be realistic.
 */
function generateDomain(domain) {
  const tld = domain.split(".")[1];
  return {
    status: [
      faker.random.arrayElement([
        "clientHold",
        "clientUpdateProhibited",
        "clientTransferProhibited",
        "clientDeleteProhibited",
        "clientRenewProhibited",
        "serverHold",
        "pendingTransfer",
        "serverTransferProhibited"
      ])
    ],
    dates: {
      created_at: faker.date.recent(365).toISOString(),
      registry_created_at: faker.date.recent(365).toISOString(),
      registry_ends_at: faker.date.future(1, faker.date.recent(1)).toISOString(),
      updated_at: faker.date.recent(7).toISOString()
    },
    tags: [],
    fqdn: domain,
    id: faker.random.uuid(),
    autorenew: faker.random.boolean(),
    tld: tld,
    owner: faker.name.lastName(),
    orga_owner: faker.name.lastName(),
    domain_owner: faker.name.lastName(),
    nameserver: {
      current: "livedns"
    },
    href: faker.internet.url(),
    fqdn_unicode: domain
  }
}

function generateMailbox(domain) {
  const name = faker.name.lastName().toLowerCase();
  const aliasesNb = faker.random.number(10);
  const aliases = [];
  for (let i = 0; i < aliasesNb; i++) {
    aliases.push(faker.lorem.word());
  }
  return {
    quota_used: faker.random.number(5000),
    domain: domain,
    mailbox_type: faker.random.arrayElement(["standard", "premium", "free"]),
    login: name,
    href: faker.internet.url(),
    address: `${name}@${domain}`,
    id: faker.random.uuid(),
    responder: { message: '', enabled: false },
    aliases: aliases,
  };
}

const domains = [];
const mailboxes = [];

for (let i = 0; i < 10; i++) {
  let domain = faker.internet.domainName();
  domains.push(generateDomain(domain));
  for (let j = 0; j < i; j++) {
    mailboxes.push(generateMailbox(domain));
  }
}

const filename = './data.js';
fs.writeFileSync(filename, `module.exports = {
  domains: ${JSON.stringify(domains, null, 2)},
  mailboxes: ${JSON.stringify(mailboxes, null, 2)}
};
`)
