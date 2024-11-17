const Message = ({
  message,
  time,
  user,
}: {
  user: string;
  time: string;
  message: string;
}) => {
  return (
    <span className="rounded-md px-2 py-1 w-[250px] border-2 bg-muted-foreground/25">
      {message}
      {time}
    </span>
  );
};

export default Message;
