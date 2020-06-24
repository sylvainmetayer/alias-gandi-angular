const fs = require('fs');
import { GandiProvider } from './gandi';
import { Domain, Mailbox } from './entities';

interface ProviderInterface {
  /**
   * Return all domains available for given provider,
   * along with it's mailbox basic details (id+name)
   */
  getDomains(): Promise<Domain[]>;
  /**
   * Give details for a given mailbox
   * @param id : wanted mailbox
   */
  getMailbox(id: string, domain: Domain): Promise<Mailbox>;
  /**
   * Apply given aliases to a mailbox and update them.
   * @param mailbox a mailbox
   * @param aliases array of aliases to apply
   * @returns updated alias for given mailbox
   */
  updateAliases(mailbox: Mailbox): Promise<string[]>;
}

const exists = (provider: string | null): boolean => {
  if (provider === null) {
    return false;
  }
  const regex = /[a-z]*/i;
  if (!provider.match(regex)) {
    return false;
  }
  return fs.existsSync(`${__dirname}/${provider}/index.js`);
};

const load = (provider: string): ProviderInterface => {
  const className =
    provider.charAt(0).toUpperCase() + provider.slice(1) + 'Provider';
  // Todo refacto this in a generic way
  if (className === 'GandiProvider') {
    return new GandiProvider();
  }
  throw Error(`${className} Not defined`);
};

const BASE_DEBUG_URL = 'http://localhost:3000/api/mock';

const isDebug = (): boolean => {
  return (
    process.env.EMAIL_ALIAS_DEBUG !== undefined &&
    parseInt(process.env.EMAIL_ALIAS_DEBUG, 10) === 1
  );
};

export { load, exists, ProviderInterface, BASE_DEBUG_URL, isDebug };
