import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  experimental: {
    viewTransition: true,
  },
  // Dev-only. Testing on a phone means loading the dev server over the LAN, so
  // requests for /_next/* arrive with a non-localhost Origin. Next warns about
  // those today and will reject them outright in a future major, so the hosts
  // we actually browse from are named here. Wildcards match per dot-segment,
  // which covers a DHCP lease moving to a different address on the subnet.
  // Note: declaring this list at all switches Next from warning to blocking,
  // so anything you browse from has to be in it.
  allowedDevOrigins: [
    "192.168.1.*",
    "10.0.0.*",
    "*.local",
    "Dan-Han-MacBook-Pro.local",
  ],
};

export default nextConfig;
