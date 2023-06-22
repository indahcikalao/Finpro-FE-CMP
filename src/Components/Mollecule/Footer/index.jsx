import React from "react";
import { Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/solid";

function Footer({ brandName, brandLink, routes }) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Typography variant="small" className="font-normal text-inherit">
          &copy; {year}, made with{" "}
          <HeartIcon className="-mt-0.5 inline-block h-3.5 w-3.5" /> by{" "}
          <a
            href={brandLink}
            target="_blank"
            className="transition-colors hover:text-blue-500"
            rel="noreferrer"
          >
            {brandName}
          </a>{" "}
        </Typography>
        <ul className="flex items-center gap-4">
          {routes.map(({ name, path }) => (
            <li key={name}>
              <Typography
                as="a"
                href={path}
                target="_blank"
                variant="small"
                className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500"
              >
                {name}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  brandName: "Cash Management Platform BRI",
  brandLink: "https://github.com/indahcikalao/Finpro-FE-CMP",
  routes: [
    { name: "Arya", path: "https://www.creative-tim.com" },
    { name: "Cikal", path: "https://www.creative-tim.com/presentation" },
    { name: "Renald", path: "https://www.creative-tim.com/blog" },
    { name: "Aziz", path: "https://www.creative-tim.com/license" },
    { name: "Roby", path: "https://www.creative-tim.com/license" },
    { name: "Irfan", path: "https://www.creative-tim.com/license" },
    { name: "Andre", path: "https://www.creative-tim.com/license" },
  ],
};

export default Footer;
