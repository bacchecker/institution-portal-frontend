import React, { ReactNode } from "react";
import { User } from "@nextui-org/react";

const CustomUser = ({ name = "User", email, avatarSrc = "-", ...props }) => {
  const initial = name?.charAt(0).toString()?.toUpperCase();
  return (
    <User
      {...props}
      className="rounded-sm cursor-pointer"
      name={<p className="font-nunito text-sm">{name}</p>}
      description={<p>{email}</p>}
      avatarProps={{
        size: "sm",
        name: initial,
        src: avatarSrc,
      }}
    />
  );
};

export default CustomUser;
