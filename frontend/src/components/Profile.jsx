import { Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const Profile = ({ data, contentType }) => {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (!data || !contentType) return;
    const url = `data:${contentType};base64,${data}`;
    setPhotoUrl(url);
  }, [data, contentType]);

  return <Image src={photoUrl} alt="profile" rounded="full" width="200px" aspectRatio={"1"}/>
};
