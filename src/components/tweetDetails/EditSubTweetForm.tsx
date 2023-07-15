import React, { useCallback, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../Button";
import { updateTextAreaSize } from "../Form";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { PacmanLoader } from "react-spinners";

type EditSubTweetFormProps = {
  subTweetId: string;
  subTweetContent: string;
  tweetId: string;
  onClose: () => void;
};

const EditSubTweetForm = (props: EditSubTweetFormProps) => {
  const session = useSession();
  const [isInputEmpty, setIsInputEmpty] = useState(false);
  const [inputValue, setInputValue] = useState(props.subTweetContent);
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const trpcUtils = api.useContext();
  const editSubTweetMutation = api.subTweet.edit.useMutation({
    onSuccess(changedData) {
      trpcUtils.subTweet.getSubTweetsByTweetId.setData(
        { tweetId: props.tweetId },
        (oldData) => {
          console.log(changedData);
          console.log("OldData: ", oldData);
          if (oldData) {
            const changedItemIndex = oldData.findIndex(
              (d) => d.id === changedData.id
            );

            if (oldData[changedItemIndex]) {
              (oldData[changedItemIndex] as { content: string }).content =
                changedData.content;

              console.log("NewDataSet", oldData);

              return oldData;
            }
          }
        }
      );
      props.onClose();
    },
  });
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (inputValue.length < 3) {
      setIsInputEmpty(true);
    } else {
      if (session.status === "authenticated") {
        editSubTweetMutation.mutate({
          subTweetId: props.subTweetId,
          content: inputValue,
        });
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-10 flex flex-col gap-2 border-b px-4 py-2"
    >
      <div className="flex gap-4">
        <textarea
          ref={inputRef}
          style={{ height: 0 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          placeholder="Like to Edit Tweet?"
          autoFocus
        />
      </div>
      {isInputEmpty && (
        <p className="self-end text-red-500">
          You have to enter at least 3 characters in your tweet!
        </p>
      )}
      {editSubTweetMutation.isLoading ? (
        <PacmanLoader
          size={13}
          color="rgb(59 130 246)"
          className="self-end"
          cssOverride={{ marginRight: "40px" }}
        />
      ) : (
        <Button className="items-center self-end">Edit</Button>
      )}
    </form>
  );
};

export default EditSubTweetForm;
