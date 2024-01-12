import { Fragment, useContext } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { UserAuthContext } from "./MainPanelLayout.jsx";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavbarDropDown() {
  const { userInfo } = useContext(UserAuthContext);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full w-28 justify-center gap-x-1.5 rounded-md bg-indigo-700 px-3 py-2 text-md font-semibold text-slate-050 hover:bg-indigo-600">
          More
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-slate-050"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-indigo-050 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {userInfo.level === "0" ? (
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/admin"
                    className={classNames(
                      active ? "bg-slate-100 text-slate-900" : "text-slate-700",
                      "block px-4 py-2 text-sm",
                    )}
                  >
                    Admin
                  </Link>
                )}
              </Menu.Item>
            ) : (
              ""
            )}
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/help/safety"
                  className={classNames(
                    active ? "bg-slate-100 text-slate-900" : "text-slate-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  Safety
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/help/troubleshooting"
                  className={classNames(
                    active ? "bg-slate-100 text-slate-900" : "text-slate-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  Troubleshooting
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/help/MobInspectionCheckList"
                  className={classNames(
                    active ? "bg-slate-100 text-slate-900" : "text-slate-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  MOB Inspection Checklist
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/help/MobDrillLog"
                  className={classNames(
                    active ? "bg-slate-100 text-slate-900" : "text-slate-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  MOB Drill Log
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/certification"
                  className={classNames(
                    active ? "bg-slate-100 text-slate-900" : "text-slate-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  Certification
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
