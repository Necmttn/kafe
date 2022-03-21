import React from 'react';
import Link from 'next/link';
import routes from '../../routes';
import tw from 'tailwind-styled-components';
import { useRouter } from 'next/router';

export interface NavigateProps {
  $active: boolean;
}

const Navigation = () => {
  const router = useRouter();
  const StyledNavigate: React.FC<NavigateProps> = tw.div`
    ${props =>
      props.$active
        ? 'font-larken-italic dark:bg-kafedarker bg-kafelighter dark:text-kafewhite text-kafeblack rounded-3xl w-[100px]'
        : ''}
    lg:text-2xl
    text-2xl
    font-larken
    block
    dark:hover:bg-kafedarker hover:bg-kafelighter dark:hover:text-kafewhite dark:text-kafewhite hover:text-kafeblack hover:text-kafewhite py-2 rounded-3xl w-32
  `;

  return (
    <>
      <div className="flex flex-col flex-1 mt-5 h-10 lg:h-full">
        <nav>
          <div>
            <Link key="learn" href={routes.learn.index} passHref>
              <StyledNavigate $active={router.pathname === routes.learn.index}>
                Learn
              </StyledNavigate>
            </Link>
          </div>
          <div>
            <Link key="vote" href={routes.vote.index} passHref>
              <StyledNavigate $active={router.pathname === routes.vote.index}>
                Vote
              </StyledNavigate>
            </Link>
          </div>
          <div>
            <Link key="write" href={routes.write.index} passHref>
              <StyledNavigate $active={router.pathname === routes.write.index}>
                Write
              </StyledNavigate>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navigation;
