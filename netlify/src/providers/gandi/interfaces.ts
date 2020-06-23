
interface DomainResponse {
  status: string[];
  dates: {
    created_at: string,
    registry_created_at: string,
    registry_ends_at: string,
    updated_at: string
  };
  tags: string[];
  fqdn: string;
  id: string;
  autorenew: false;
  tld: string;
  owner: string;
  orga_owner: string;
  domain_owner: string;
  nameserver: { current: string };
  href: string;
  fqdn_unicode: string;
}

interface MailboxResponse {
  quota_used: number;
  domain: string;
  // Pro or standard
  mailbox_type: string;
  login: string;
  href: string;
  address: string;
  id: string;
  responder?: { message: string, enabled: boolean };
  aliases?: string[];
}

export { MailboxResponse, DomainResponse };
