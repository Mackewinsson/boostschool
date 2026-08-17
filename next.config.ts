import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "bilingualboost.online" }],
        destination: "https://www.bilingualboost.online/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "bilingualboost.online" }],
        destination: "https://www.bilingualboost.online/:path*",
        permanent: true,
      },
      {
        source: "/admin",
        destination: "/alumno/profesor",
        permanent: false,
      },
      {
        source: "/admin/firma",
        destination: "/alumno/profesor/firma",
        permanent: false,
      },
      {
        source: "/admin/emails",
        destination: "/alumno/profesor/emails",
        permanent: false,
      },
      {
        source: "/admin/leads",
        destination: "/alumno/profesor/leads",
        permanent: false,
      },
      {
        source: "/admin/leads/:id",
        destination: "/alumno/profesor/leads/:id",
        permanent: false,
      },
      {
        source: "/admin/contacts",
        destination: "/alumno/profesor/contactos",
        permanent: false,
      },
      {
        source: "/admin/contacts/:id",
        destination: "/alumno/profesor/contactos/:id",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
