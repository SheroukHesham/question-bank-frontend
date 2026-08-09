import { ProfileAvatar } from "./ProfileAvatar";

const Navbar = () => {
  return (
    <div className="w-full bg-sidebar px-10 py-3">
      <div className="flex justify-end items-center gap-2 text-sm font-semibold">
        <ProfileAvatar />
        <span className="tracking-tight">Name</span>
      </div>
    </div>
  );
};

export default Navbar;
