import UserInfoStatic from "./UserInfoStatic.jsx";
import UserProductsStatic from "./UserProductsStatic.jsx";
import { UserType, UserProducts } from "./types/types.ts";

interface AdminEditUserStaticProps {
  toggleEditMode: (editMode: boolean) => void;
  editMode: boolean;
  userInfo: UserType;
  data: UserProducts;
}

const AdminEditUserStatic: React.FC<AdminEditUserStaticProps> = ({
  userInfo: user,
  toggleEditMode,
  editMode,
  data,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <div className="col-span-2 flex flex-col">
        <h3 className="mb-3 self-start text-lg font-bold text-slate-900 underline lg:text-xl">
          Account Info
        </h3>
        <UserInfoStatic userInfoToEdit={user} />
      </div>
      <div className="col-span-1 flex flex-col">
        <h3 className="mb-3 self-start text-lg font-bold text-slate-900 underline lg:text-xl">
          Account Assigned Products
        </h3>
        <UserProductsStatic userProductData={data} />
      </div>
      <div className="col-span-2 mt-3 flex items-start lg:mt-0">
        <button
          className="text-slate-950 w-24 rounded border border-slate-500 bg-slate-050 px-3 py-1 font-semibold hover:border-transparent hover:bg-slate-600 hover:text-slate-050 lg:w-36 lg:self-center"
          onClick={() => toggleEditMode(!editMode)}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default AdminEditUserStatic;
