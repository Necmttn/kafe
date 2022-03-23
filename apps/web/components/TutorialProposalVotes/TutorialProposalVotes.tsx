import React, { useState, useEffect } from 'react';
import VoteButton from '../VoteButton/VoteButton';
import {
  ProposalStateE,
  useGetDaoState,
  useGetListOfVoters,
} from '@builderdao-sdk/dao-program';
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn';
import UserAvatar from '../UserAvatar/UserAvatar';
import Loader from '@app/components/Loader/Loader';
import LoginButton from '@app/components/LoginButton/LoginButton';
import { useDapp } from '../../hooks/useDapp';
import VotedSVG from '@app/components/SVG/Coffee Icons/VotedSVG';

type TutorialProposalVotesProps = {
  id: number;
  state: ProposalStateE;
};

const TutorialProposalVotes = (props: TutorialProposalVotesProps) => {
  const { id, state } = props;
  const { wallet } = useDapp();
  const [voteFull, setVoteFull] = useState(false);
  const [remainder, setRemainder] = useState(0);

  const { daoState, loading, error } = useGetDaoState();
  const {
    voters,
    loading: listLoading,
    error: listError,
  } = useGetListOfVoters(id);

  useEffect(() => {
    if (voters && daoState) {
      setVoteFull(voters.length >= Number(daoState.quorum));
      setRemainder(Number(daoState.quorum) - voters.length);
    }
  }, [voters, daoState]);

  if (loading || listLoading) {
    return <Loader />;
  }

  if (error || listError) {
    return <div>Error occurred</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <p className="text-2xl font-larken">Voters </p>
        <div className="flex-row justify-between">
          <small className="font-space text-xs">
            <span>{voters.length}</span>
            <span className="text-kafemellow">
              /{daoState.quorum.toString()} votes
            </span>
          </small>
        </div>
      </div>
      <ul>
        {voters.map(tutorialVote => (
          <li
            className="py-4 w-full flex"
            key={tutorialVote.account.author.toString()}
          >
            <UserAvatar address={tutorialVote.account.author.toString()} />
          </li>
        ))}
      </ul>

      <div>
        {state.toString() !== ProposalStateE.published && (
          <>
            {wallet.connected ? (
              <VoteButton id={id} variant="standard" currentState={state} />
            ) : (
              <div className="py-2">
                <LoginButton
                  className={
                    'h-auto inline-block dark:bg-kafewhite bg-kafeblack w-full h-14 rounded-2xl dark:text-kafeblack text-kafewhite dark:hover:bg-kafered hover:bg-kafegold hover:text-kafeblack'
                  }
                >
                  <div className="flex items-center justify-center p-0 m-0">
                    vote
                  </div>
                </LoginButton>
              </div>
            )}
          </>
        )}
      </div>

      <div className="pt-4">
        {!voteFull && (
          <>
            <p className="font-bold">Not funded yet</p>
            <p>
              {remainder} more {remainder != 1 ? 'votes' : 'vote'} needed&nbsp;
              <a href="#" className="underline">
                learn more
              </a>
            </p>
          </>
        )}
        {voteFull && (
          <>
            <p className="font-bold">Fully funded!</p>
            <p>
              Voting is now closed&nbsp;{' '}
              <a href="#" className="underline">
                learn more
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default TutorialProposalVotes;
