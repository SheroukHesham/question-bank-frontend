import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Back = () => {
  const navigate = useNavigate();
  return (
    <div
      className="flex gap-1 items-center cursor-pointer"
      onClick={() => {
        navigate(-1);
      }}
    >
      <MoveLeft size={20} />
      <span className="font-semibold">Back</span>
    </div>
  );
};

export default Back;
