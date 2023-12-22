import { PropsWithChildren } from "react";

export const List = (props: PropsWithChildren): JSX.Element => {
  return (
    <ul {...props} className="list-disc">
      {props.children}
    </ul>
  );
};
