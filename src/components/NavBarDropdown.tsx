import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useLoggedInUserContext } from "../hooks/useLoggedInUserContext.ts";
import { strings } from "../utils/strings.ts";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NavbarDropDown() {
  const { loggedInUserInfo } = useLoggedInUserContext();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-slate-050 transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 lg:px-4 lg:py-2 lg:text-base">
          {strings["nav.more"]}
          <ChevronDownIcon
            className="h-4 w-4 text-slate-050"
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-indigo-050 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {loggedInUserInfo?.level === "0" ? (
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/admin"
                    className={classNames(
                      active ? "bg-slate-100 text-slate-900" : "text-slate-700",
                      "block px-4 py-2 text-sm",
                    )}
                  >
                    {strings["nav.admin"]}
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
                  {strings["nav.safety"]}
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
                  {strings["nav.troubleshooting"]}
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
                  {strings["nav.mob.inspection.checklist"]}
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
                  {strings["nav.mob.drill.log"]}
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
                  {strings["nav.certification"]}
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
