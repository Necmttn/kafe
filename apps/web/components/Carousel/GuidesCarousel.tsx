import React from 'react';
import UserAvatar from '@app/components/UserAvatar/UserAvatar';
import ImageStack from '../ImageStack';
import Tags from '../Tags/Tags';
import algoliasearch from 'algoliasearch/lite';
import Link from 'next/link';
import { InstantSearch, Configure } from 'react-instantsearch-dom';
import {
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
} from '@app/constants';
import { connectHits } from 'react-instantsearch-dom';
import { truncateString } from '../../utils/strings';
import useCarousel from '@app/components/Carousel/useCarousel';
import Loader from '@app/components/Loader/Loader';
import routes from '../../routes';

const PER_PAGE = 3;

const searchClient = algoliasearch(
  NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
);

const GuideCard = props => {
  const { hit } = props;

  return (
    <div
      className={
        'border dark:border-kafewhite border-kafeblack w-[450px] min-h-[280px] p-4 px-6 bg-kafewhite dark:bg-kafeblack'
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <small className="mr-2 text-xs">Guide by</small>{' '}
          <UserAvatar ellipsis={true} address={hit.author} />
        </div>
        <ImageStack addresses={['1', '2', '3']} />
      </div>
      <div>
        <Link href={routes.learn.guide(hit.slug)}>
          <h3 className="text-2xl font-larken mt-14">{hit.title}</h3>
        </Link>
        <p className="text-xs tracking-wide">
          {truncateString(hit.description)}
        </p>
        <div className="mt-4">
          <Tags tags={hit.tags} />
        </div>
      </div>
    </div>
  );
};

const Wrapper = ({ hits }) => {
  const { currentIndex, handlePrev, handleNext } = useCarousel(
    PER_PAGE,
    hits.length,
  );

  if (!hits.length) {
    return <Loader />;
  }

  const hit = hits[currentIndex];
  return [
    <div key={hit.objectID} className={`relative top-6 left-6`}>
      <GuideCard hit={hit} />
    </div>,
    <div key="dummy-1" className={`absolute top-4 left-4`}>
      <GuideCard hit={hit} />
    </div>,
    <div key="dummy-2" className={`absolute top-2 left-2`}>
      <GuideCard hit={hit} />
    </div>,
  ];
};

const Guides = connectHits(Wrapper);

const GuidesCarousel = () => {
  return (
    <div className="relative h-[200px]">
      <InstantSearch
        searchClient={searchClient}
        indexName={`${NEXT_PUBLIC_ALGOLIA_INDEX_NAME}_last_updated_at_desc`}
      >
        <Configure
          hitsPerPage={PER_PAGE}
          analytics={false}
          filters="state:published"
        />
        <Guides />
      </InstantSearch>
    </div>
  );
};

export default GuidesCarousel;
