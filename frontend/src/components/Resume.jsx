import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const Resume = ({ data, contentType }) => {
  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (!data || !contentType) return;
    const base64Data = btoa(
      String.fromCharCode.apply(null, new Uint8Array(data))
    );

    const url = `data:${contentType};base64,${base64Data}`;
    setResume(url);
  }, [data, contentType]);

  return (
    <Button w="full" bg="blue.400" color={"white"}>
      <a href={resume} download>
        Download CV &darr;
      </a>
    </Button>
  );
};
