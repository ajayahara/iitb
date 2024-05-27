import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const Resume = ({ data, contentType }) => {
  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (!data || !contentType) return;
    const url = `data:${contentType};base64,${data}`;
    setResume(url);
  }, [data, contentType]);

  return (
    <Button w="full" bg="blue.400" color={"white"} _hover={{bg:"white",color:"blue.400"}}>
      <a href={resume} download="resume.pdf">
        Download CV &darr;
      </a>
    </Button>
  );
};
