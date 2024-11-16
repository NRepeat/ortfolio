const Message = ({ message, user }: { user: string; message: string }) => {
  return <span className="rounded-md px-2 py-1 w-[250px]">{message}</span>;
};

export default Message;
