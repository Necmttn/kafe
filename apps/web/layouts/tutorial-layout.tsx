import { Link, MDXWrapper, PageTitle, SectionContainer } from '@builderdao/ui';
// import { BlogSEO } from '@/components/SEO' // TODO: Add json:schema for this
import React, { ReactNode } from 'react';
import TableOfContent from '@app/components/TableOfContent';
import { useRouter } from 'next/router';
import { TutorialFrontMatter } from '@builderdao/md-utils';
import RightSidebar from './PublicLayout/RightSidebar';
import Tags from '@app/components/Tags/Tags';
import TutorialTips from '@app/components/TutorialTips/TutorialTips';
import { BuilderDaoConfigJson } from '@builderdao/cli';
import { getEnabledCategories } from 'trace_events';
import _, { map } from 'lodash';
import { formatDate } from '@app/lib/utils/format-date';

interface Props {
  tutorialId: number;
  frontMatter: TutorialFrontMatter;
  children: ReactNode;
  config: BuilderDaoConfigJson;
  next?: { slug: string; title: string };
  prev?: { slug: string; title: string };
}

export const TutorialLayout: React.FC<Props> = ({
  tutorialId,
  frontMatter,
  next,
  prev,
  config,
  children,
}) => {
  const { query } = useRouter();
  const { slug, date, title, description, keywords } = frontMatter;
  const [ids, setIds] = React.useState<Array<{ id: string; title: string }>>(
    [],
  );

  React.useEffect(() => {
    /**
     * Working around some race condition quirks :) (don't judge)
     * TODO @Necmttn: see if there's a better way through a remark plugin to do this
     */
    setTimeout(() => {
      const titles = document.querySelectorAll('h2');
      const idArrays = Array.prototype.slice
        .call(titles)
        .map(title => ({ id: title.id, title: title.innerText })) as Array<{
        id: string;
        title: string;
      }>;
      setIds(idArrays);
    }, 500);
  }, [slug]);
  const path = `/learn/${query.slug[0]}`;
  return (
    <div className="flex justify-between">
      <SectionContainer>
        {/* <BlogSEO url={`${siteMetadata.siteUrl}/blog/${slug}`} {...frontMatter} /> */}
        <article className="z-50 inline-flex mt-8 border dark:bg-kafeblack bg-kafewhite border-1 border-kafeblack dark:border-kafewhite ">
          <div className="px-10 py-4">
            <header>
              <div className="pb-5 space-y-1 text-center">
                <dl>
                  <div>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6">
                      <time dateTime={date}>{formatDate(date)}</time>
                    </dd>
                  </div>
                </dl>
                <div className="font-larken">
                  <PageTitle>{title}</PageTitle>
                </div>
                <div className="py-4 font-thin text-left">{description}</div>
                <div className="text-left">
                  <Tags
                    tags={_.uniq([
                      ...config.categories.map(c => c.name),
                      ...keywords,
                    ])}
                    overrideLengthCheck={true}
                  />
                </div>
              </div>
            </header>
            <div
              className="pb-8 divide-y divide-gray-200 xl:divide-y-0 dark:divide-gray-700 "
              style={{ gridTemplateRows: 'auto 1fr' }}
            >
              <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:pb-0">
                <div className="pt-10 pb-8 mx-auto text-base leading-8 prose-sm prose break-words dark:prose-invert prose-a:font-larken prose-a:no-underline prose:a-text-kafeblack dark:prose-a:text-kafewhite prose-a:text-lg hover:prose-a:underline prose-code:p-1 dark:prose-code:bg-kafedarker prose-code:bg-kafemellow prose-code:rounded prose-code:b text-kafedark dark:text-kafewhite prose-td:break-all first:prose-td:break-normal prose-td:border prose-td:border-kafemellow prose-td:p-1">
                  {children}
                </div>
              </div>
              {/*<Comments frontMatter={frontMatter} />*/}
              <footer className="bg-">
                <div className="flex flex-row justify-between text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                  {prev && (
                    <div className="pt-4 xl:pt-8">
                      <Link
                        href={`${path}${prev.slug}`}
                        className="text-kafewhite dark:text-kafewhite hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        &larr; {prev.title}
                      </Link>
                    </div>
                  )}
                  {next && (
                    <div className="pt-4 xl:pt-8">
                      <Link
                        href={`${path}${next.slug}`}
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {next.title} &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </footer>
            </div>
          </div>
        </article>
      </SectionContainer>
      <div className="sticky">
        <RightSidebar>
          <div className="p-6">
            <TutorialTips id={tutorialId} />
          </div>
        </RightSidebar>
        {/* <div>
            <TableOfContent ids={ids} />
          </div> */}
      </div>
    </div>
  );
};
