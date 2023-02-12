import { generateScopedName, hash } from "@camome/utils";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["@camome/core"],
  webpack: (config) => {
    config.module.rules
      .find(({ oneOf }) => !!oneOf)
      .oneOf.filter(({ use }) => JSON.stringify(use)?.includes("/css-loader/"))
      .reduce((acc, { use }) => acc.concat(use), [])
      .forEach(({ options }) => {
        if (options?.modules) {
          options.modules.getLocalIdent = (
            context,
            localIdentName,
            localName
          ) => {
            const filename = context.resourcePath;
            // @camome/core depends on static class names
            // but your own module classes won't.
            if (!filename.match(/@camome\/core/)) {
              // Whatever. `hash()` doesn't have any special effect.
              return localName + "-" + hash(filename);
            }
            return generateScopedName(localName, context.resourcePath);
          };
        }
      });
    return config;
  },
};

export default nextConfig;
