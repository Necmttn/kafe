import React from 'react';
import UserAvatar from '@app/components/UserAvatar/UserAvatar';
import ImageStack from '../ImageStack';
import Tags from '../Tags/Tags';
import { VscTriangleLeft, VscTriangleRight } from 'react-icons/vsc';
import { IconContext } from 'react-icons';

type CarouselProps = {
  variation?: 'dotted' | 'solid';
};

const Card = ({ variation }) => {
  return (
    <div
      className={`border ${
        variation === 'dotted' ? 'border-dotted border-1 rounded-3xl' : ''
      } dark:border-kafewhite border-kafeblack w-[450px] min-h-[240px] p-4 px-6 bg-kafewhite dark:bg-kafeblack`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <small className="text-xs">Guide by</small>{' '}
          <UserAvatar ellipsis={false} address="mogwai.sol" />
        </div>
        <ImageStack addresses={['1', '2', '3']} />
      </div>
      <div>
        <h3 className="text-2xl font-larken mt-14">
          Run a Celo Node on a Virtual Machine
        </h3>
        <p className="text-xs tracking-wide">
          Little description of a few words goes here, there needs to be...
        </p>
        <div className="mt-4">
          <Tags tags={['celo', 'node', 'ethereum']} />
        </div>
      </div>
    </div>
  );
};

const Wrapper = ({ variation }) => {
  return (
    <div className="relative">
      <div className="absolute top-6 left-6">
        <Card variation={variation} />
      </div>
      <div className="absolute top-4 left-4">
        <Card variation={variation} />
      </div>
      <div className="absolute top-2 left-2">
        <Card variation={variation} />
      </div>
    </div>
  );
};

const Carousel = ({ variation }: CarouselProps) => {
  return (
    <div className="relative h-[200px]">
      <div className="absolute -left-20 top-1/2 right-0 cursor-pointer dark:hover:bg-kafewhite hover:bg-kafeblack w-16 h-16 rounded-full dark:bg-kafedarker bg-kafelighter group">
        <IconContext.Provider
          value={{
            className:
              'text-kafeblack group-hover:text-kafewhite dark:group-hover:text-kafeblack mx-auto mt-5 ml-4 dark:text-kafewhite w-6 h-6',
          }}
        >
          <VscTriangleLeft />
        </IconContext.Provider>
      </div>
      <Wrapper variation={variation} />
      <div className="absolute left-[490px] top-1/2 cursor-pointer group dark:hover:bg-kafewhite hover:bg-kafeblack w-16 h-16 rounded-full dark:bg-kafedarker bg-kafelighter">
        <IconContext.Provider
          value={{
            className:
              'text-kafeblack group-hover:text-kafewhite dark:group-hover:text-kafeblack mx-auto mt-5 mr-4 dark:text-kafewhite w-6 h-6',
          }}
        >
          <VscTriangleRight />
        </IconContext.Provider>
      </div>
    </div>
  );
};

export default Carousel;
