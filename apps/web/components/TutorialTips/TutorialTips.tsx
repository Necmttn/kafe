import React, { useState } from 'react';
import { addEllipsis } from '../../utils/strings';
import VoteButton from '../VoteButton/VoteButton';
import {
  ProposalStateE,
  useGetDaoState,
  useGetListOfTippersById,
  useGetListOfVoters,
} from '@builderdao-sdk/dao-program';
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn';
import TipTutorialForm from '@app/components/TipTutorialForm/TipTutorialForm';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import Loader from '@app/components/Loader/Loader';
import UserAvatar from '../UserAvatar/UserAvatar';
import Modal from 'react-modal';
import { useTheme } from 'next-themes';
import { VscClose } from 'react-icons/vsc';

type TutorialTipsProps = {
  id: number;
};

Modal.setAppElement('#__next'); // This is for screen-readers. By binding the modal to the root element, screen-readers can read the content of the modal.

const TutorialTips = (props: TutorialTipsProps) => {
  const { id } = props;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      borderRadius: '40px',
      height: '400px',
      padding: '20px 0 20px 0',
      background: dark ? '#1E1C1E' : '#EAE4D9',
    },
    overlay: {
      zIndex: 1000,
    },
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const afterOpenModal = () => {
    console.log('hey');
  };

  const SupportersModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Support modal"
      >
        <h3 className="font-larken text-2xl text-center border-b-[0.5px] border-kafemellow mb-4 pt-5 pb-8">
          Supporters
        </h3>
        <button
          className="absolute right-8 top-10 text-3xl "
          onClick={closeModal}
        >
          <VscClose />
        </button>
        <div className="overflow-auto">
          <ul className="px-8">
            {tippers.map((tipperAccount, index) => (
              <li
                className="py-4 dark:text-kafewhite text-xs text-kafeblack flex items-center justify-between"
                key={tipperAccount.account.pubkey.toString()}
              >
                <UserAvatar address={tipperAccount.account.pubkey.toString()} />
                <p className="font-space-italic">
                  {tipperAccount.account.amount.toNumber() / LAMPORTS_PER_SOL}{' '}
                  SOL
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    );
  };

  const { tippers, loading, error } = useGetListOfTippersById(id);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error occurred</div>;
  }

  return (
    <div className="text-kafeblack dark:text-kafewhite w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-larken text-xl">
          {tippers.length} {tippers.length !== 1 ? 'supporters' : 'supporter'}
        </h3>
        <small className="cursor-pointer" onClick={openModal}>
          view all
        </small>
        <SupportersModal />
      </div>
      <ul>
        {tippers.map((tipperAccount, index) => (
          <li
            className="py-4 dark:text-kafewhite text-xs text-kafeblack flex items-center justify-between"
            key={tipperAccount.account.pubkey.toString()}
          >
            <UserAvatar address={tipperAccount.account.pubkey.toString()} />
            <p className="font-space-italic">
              {tipperAccount.account.amount.toNumber() / LAMPORTS_PER_SOL} SOL
            </p>
          </li>
        ))}
      </ul>

      <IsLoggedIn>
        <div className="mt-6">
          <TipTutorialForm id={id} />
        </div>
      </IsLoggedIn>
    </div>
  );
};

export default TutorialTips;
