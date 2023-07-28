import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { VscClose, VscEdit } from 'react-icons/vsc';

import HeartButton from '../../ui/HeartButton';
import { IconHoverEffect } from '../../ui/IconHoverEffect';
import ReplyButton from '../../ui/ReplyButton';
import Tooltip from '../../ui/Tooltip';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import InteractionButtons from './InteractionButtons';
import type { Tweet } from './TweetCard';

import useToggleLikeMutation from '~/hooks/useToggleLikeMutation';
import dateTimeFormatter from '~/utils/dateTimeFormatter';

type ContentProps = {
    editMode: boolean;
    toggleEditMode: () => void;
    openModal: () => void;
    selectTweetForDelete: (tweetId: string) => void;
} & Tweet;

const Content = (props: ContentProps) => {
    const session = useSession();
    const router = useRouter();

    return (
        <>
            <div className="flex gap-1">
                {router.pathname.includes('/tweet/') ? (
                    <p className="text-sm md:text-base font-bold dark:text-white outline-none hover:underline focus-visible:underline">
                        {props.user.name}
                    </p>
                ) : (
                    <Tooltip
                        content="View Tweet"
                        place="bottom"
                        id="view tweet"
                        delayShow={1000}
                    >
                        <Link
                            href={`/tweet/${props.id}`}
                            className="text-sm md:text-base font-bold dark:text-white outline-none hover:underline focus-visible:underline"
                        >
                            {props.user.name}
                        </Link>
                    </Tooltip>
                )}
                <span className="text-gray-500 dark:text-gray-300">-</span>
                <span className="text-gray-500 dark:text-gray-300 text-xs md:text-base">
                    {dateTimeFormatter.format(props.createdAt)}
                </span>
                {(session.data?.user.id === props.user.id ||
                    session.data?.user?.role?.toString() === 'ADMIN') && (
                    <>
                        <EditButton
                            editMode={props.editMode}
                            toggleEditMode={props.toggleEditMode}
                        />
                        <DeleteButton
                            id={props.id}
                            openModal={props.openModal}
                            selectTweetForDelete={props.selectTweetForDelete}
                        />
                    </>
                )}
            </div>
            <p className="text-xs md:text-base font-normal whitespace-pre-wrap dark:text-white">
                {props.content}
            </p>
            <InteractionButtons
                id={props.id}
                user={props.user}
                likeCount={props.likeCount}
                likedByMe={props.likedByMe}
                subTweetCount={props.subTweetCount}
            />
        </>
    );
};

export default Content;
