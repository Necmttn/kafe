/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import commander from 'commander';
import { CeramicApi, AlgoliaApi } from '@builderdao/apis';
import {
  ProposalStateE,
  filterProposalByState,
} from '@builderdao-sdk/dao-program';
import { uniq } from 'lodash';

import dump from '../../data/dump.json';
import input from '../../data/output.json';

import { getClient } from '../client';
import {
  compareById,
  compareBySlug,
  parseDifficulty,
  parseProtocol,
  parseSlug,
  parseTags,
} from '../utils';

export function makeMigrationCommand() {
  const solana = new commander.Command('solana').description(
    'Solana account migration',
  );

  solana
    .command('run')
    .addOption(
      new commander.Option('--algoliaAppId <algoliaAppId>', 'Algolia App Id')
        .env('ALGOLIA_APP_ID')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--algoliaAdmin <algoliaAdmin>',
        'Algolia Access Key',
      )
        .env('ALGOLIA_ADMIN_KEY')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--algoliaIndex <algoliaIndex>',
        'Algolia Index Name',
      )
        .env('ALGOLIA_INDEX_NAME')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--ceramicUrl <ceramicUrl>', 'Ceramic Node Url')
        .env('CERAMIC_NODE_URL')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--ceramicSeed <ceramicSeed>', 'Ceramic Seed')
        .env('CERAMIC_SEED')
        .makeOptionMandatory(),
    )
    .action(async options => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const algoliaApi = new AlgoliaApi({
        appId: options.algoliaAppId,
        accessKey: options.algoliaAdmin,
        indexName: options.algoliaIndex,
      });

      const client = getClient({
        network: solana.optsWithGlobals().network,
        payer: solana.optsWithGlobals().solanaAdminKey,
      });

      const walletPk = solana.optsWithGlobals().solanaAdminKey.publicKey;

      const ceramicApi = new CeramicApi({
        nodeUrl: options.ceramicUrl,
      });
      ceramicApi.setSeed(options.ceramicSeed);

      const algoliaRecords: any = [];
      const description = 'Migrated tutorial from LEARN.V2 ';
      const mockFile: any = [];
      let id = 0;

      for (const tutorial of Array.from(dump).filter(dt => !dt.is_multi_page)) {
        try {
          const {
            slug: slug0,
            tags: tags0,
            title,
            difficulty: difficulty0,
            description: tutorialDescription,
          } = tutorial;

          const protocol = parseProtocol(tags0);
          const slug = parseSlug(slug0, tags0[0]);
          const difficulty = parseDifficulty(difficulty0);
          const tags: string[] = [
            protocol,
            ...uniq<string>(tags0.slice(1).map(parseTags)),
          ];
          id = await client.getNonce();

          algoliaRecords.push({
            objectID: id.toString(),
            title,
            slug,
            description,
            author: walletPk.toString(),
            state: ProposalStateE.readyToPublish,
            tags,
            difficulty,
            numberOfVotes: 0,
          });

          // @ts-ignore
          const stream = await ceramicApi.storeMetadata({
            title,
            slug,
            description,
            difficulty,
            tags,
          });
          const streamId = stream.id.toString();

          await client.createTutorial({
            id,
            slug,
            userPk: walletPk,
            streamId,
          });

          await client.proposalSetState({
            id,
            adminPk: walletPk,
            newState: ProposalStateE.readyToPublish,
          });

          const entry = {
            id,
            slug,
            title,
            description: tutorialDescription,
            difficulty,
            tags,
            streamId,
            author: walletPk.toString(),
            reviewer1: walletPk.toString(),
            reviewer2: walletPk.toString(),
            state: ProposalStateE.readyToPublish,
            date: Date.now(),
          };
          console.error(entry);
          mockFile.push(entry);
          await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (error) {
          console.error(`(error as Error).message on entry: ${id}`);
          process.exit(1);
        }
      }
      console.log(JSON.stringify(mockFile, null, 2));

      for (const record of algoliaRecords) {
        await algoliaApi.createTutorial(record);
      }
    });

  solana
    .command('list')
    .option('--id', 'sort by id of the proposal')
    .action(async options => {
      const client = getClient({
        network: solana.optsWithGlobals().network,
        payer: solana.optsWithGlobals().solanaAdminKey,
      });

      const parseProposalData = (data: any) => ({
        id: data.account.id.toNumber(),
        slug: data.account.slug,
      });

      const rawProposals = await client.getProposals([
        filterProposalByState(ProposalStateE.readyToPublish),
      ]);
      if (options.id) {
        console.log(
          JSON.stringify(
            rawProposals.map(parseProposalData).sort(compareById),
            null,
            2,
          ),
        );
      } else {
        console.log(
          JSON.stringify(
            rawProposals.map(parseProposalData).sort(compareBySlug),
            null,
            2,
          ),
        );
      }
    });

  solana
    .command('close')
    .addOption(
      new commander.Option(
        '--id <id>',
        'id of the proposal to close',
      ).makeOptionMandatory(),
    )
    .action(async options => {
      const client = getClient({
        network: solana.optsWithGlobals().network,
        payer: solana.optsWithGlobals().solanaAdminKey,
      });

      const walletPk = solana.optsWithGlobals().solanaAdminKey.publicKey;

      const signature = await client.closeTutorial({
        id: options.id,
        authorPk: walletPk,
        userPk: walletPk,
      });
      console.log(signature);
    });

  solana
    .command('feedAlgolia')
    .addOption(
      new commander.Option('--algoliaAppId <algoliaAppId>', 'Algolia App Id')
        .env('ALGOLIA_APP_ID')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--algoliaAdmin <algoliaAdmin>',
        'Algolia Access Key',
      )
        .env('ALGOLIA_ADMIN_KEY')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--algoliaIndex <algoliaIndex>',
        'Algolia Index Name',
      )
        .env('ALGOLIA_INDEX_NAME')
        .makeOptionMandatory(),
    )
    .action(async options => {
      const algoliaApi = new AlgoliaApi({
        appId: options.algoliaAppId,
        accessKey: options.algoliaAdmin,
        indexName: options.algoliaIndex,
      });

      const description = 'Migrated tutorial from LEARN.V2 ';
      for (const record of Array.from(input)) {
        const data = {
          objectID: record.id.toString(),
          title: record.title,
          slug: record.slug,
          description,
          author: record.author,
          state: ProposalStateE.readyToPublish,
          tags: record.tags,
          difficulty: record.difficulty,
          numberOfVotes: 0,
        };
        await algoliaApi.createTutorial(data);
        console.log(data);
      }
    });

  solana.command('closeAll').action(async () => {
    const client = getClient({
      network: solana.optsWithGlobals().network,
      payer: solana.optsWithGlobals().solanaAdminKey,
    });

    const walletPk = solana.optsWithGlobals().solanaAdminKey.publicKey;

    const proposalIds = (
      await client.getProposals([
        filterProposalByState(ProposalStateE.readyToPublish),
      ])
    ).map(data => data.account.id.toNumber());

    for (const id of proposalIds) {
      try {
        const signature = await client.closeTutorial({
          id,
          authorPk: walletPk,
          userPk: walletPk,
        });
        console.log({
          id,
          signature,
        });
      } catch (error) {
        console.error(`error: ${id}`);
      }
    }
  });

  solana
    .command('debugEnv')
    .addOption(
      new commander.Option('--algoliaAppId <algoliaAppId>', 'Algolia App Id')
        .env('ALGOLIA_APP_ID')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--algoliaAdmin <algoliaAdmin>',
        'Algolia Access Key',
      )
        .env('ALGOLIA_ADMIN_KEY')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--algoliaIndex <algoliaIndex>',
        'Algolia Index Name',
      )
        .env('ALGOLIA_INDEX_NAME')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--ceramicUrl <ceramicUrl>', 'Ceramic Node Url')
        .env('CERAMIC_NODE_URL')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--ceramicSeed <ceramicSeed>', 'Ceramic Seed')
        .env('CERAMIC_SEED')
        .makeOptionMandatory(),
    )
    .action(async options => {
      console.log({
        kafePk: solana.optsWithGlobals().kafePk,
        bdrPk: solana.optsWithGlobals().bdrPk,
        solanaNetwork: solana.optsWithGlobals().network,
        solanaAdminKey: solana
          .optsWithGlobals()
          .solanaAdminKey.publicKey.toString(),
        ceramicUrl: options.ceramicUrl,
        ceramicSeed: options.ceramicSeed,
        algoliaAppId: options.algoliaAppId,
        algoliaAdmin: options.algoliaAdmin,
        algoliaIndex: options.algoliaIndex,
      });
    });

  return solana;
}
